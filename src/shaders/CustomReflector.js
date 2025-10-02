import {
    Color,
    Matrix4,
    Mesh,
    PerspectiveCamera,
    Plane,
    Vector3,
    Vector4,
    WebGLRenderTarget,
    HalfFloatType,
    MeshStandardMaterial,
    ShaderChunk,
} from "three";

// Only changes from the vanilla Reflector class are:
// 1. changes to using an extended StandardMaterial instead of ShaderMaterial
// 2. passing in uniform time and light position to the shader,
// 3. the mirror pass toggle before and after the virtual camera rendering
class Reflector extends Mesh {
    constructor(geometry, options = {}) {
        super(geometry);

        this.isReflector = true;

        this.type = "Reflector";
        this.camera = new PerspectiveCamera();

        const scope = this;

        const color =
            options.color !== undefined
                ? new Color(options.color)
                : new Color(0x7f7f7f);
        const textureWidth = options.textureWidth || 512;
        const textureHeight = options.textureHeight || 512;
        const clipBias = options.clipBias || 0;
        const multisample =
            options.multisample !== undefined ? options.multisample : 4;

        //

        const reflectorPlane = new Plane();
        const normal = new Vector3();
        const reflectorWorldPosition = new Vector3();
        const cameraWorldPosition = new Vector3();
        const rotationMatrix = new Matrix4();
        const lookAtPosition = new Vector3(0, 0, -1);
        const clipPlane = new Vector4();

        const view = new Vector3();
        const target = new Vector3();
        const q = new Vector4();

        const textureMatrix = new Matrix4();
        const virtualCamera = this.camera;

        const renderTarget = new WebGLRenderTarget(
            textureWidth,
            textureHeight,
            {
                samples: multisample,
                type: HalfFloatType,
            }
        );

        const material = new MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.5,
            roughnessMap: options.shaderUniforms.roughnessMap.value,
            normalMap: options.shaderUniforms.normalMap.value,
        });
        material.onBeforeCompile = (shader) => {
            shader.uniforms["tDiffuse"] = { value: renderTarget.texture };
            shader.uniforms["tColor"] = { value: color };
            shader.uniforms["textureMatrix"] = { value: textureMatrix };
            // needs to pass time in by reference since the above UniformsUtils.clone operation has sabotaged the original reference
            shader.uniforms["uTime"] = options.shaderUniforms.time;
            // --- shader code tweaks --- //
            shader.vertexShader = shader.vertexShader.replace(
                `#include <common>`,
                `uniform mat4 textureMatrix;
                varying vec4 v_Uv;
                #include <common>`
            );
            shader.vertexShader = shader.vertexShader.replace(
                `void main() {`,
                `void main() {
                v_Uv = textureMatrix * vec4( position, 1.0 );
                `
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <common>`,
                `uniform sampler2D tDiffuse;
                uniform float uTime;
		        varying vec4 v_Uv;

                //  Function from Iñigo Quiles
                //  www.iquilezles.org/www/articles/functions/functions.htm
                float cubicPulse( float c, float w, float x ){
                    x = abs(x - c);
                    if( x>w ) return 0.0;
                    x /= w;
                    return 1.0 - x*x*(3.0-2.0*x);
                }

                // previously I used mipmap based roughness but found the blocky artifacts not ideal
                // refactored to use a simple, custom roughness simulation
                // input viewVec should be fed with vViewPosition
                vec3 diffuseReflections(vec3 viewVec){
                    float dimmingFactor = (1.35 - viewVec.z / 4.);
                    vec3 baseColor = vec3(0.15 * dimmingFactor);

                    // strength of the bright line on the ground
                    float pulse = cubicPulse(0.75, 0.5, sqrt(pow(viewVec.x*1.3,2.) + pow(viewVec.z*0.6-1.75,2.)));

                    // keep the highlight strictly white by adding equally across channels
                    vec3 diffuseColor = baseColor + vec3(1.0) * pulse;

                    // no time-based color variation on the floor
                    return diffuseColor;
                }
                    
                #include <common>`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                `void main() {`,
                `void main() {
                vec4 baseColor = texture2DProj( tDiffuse, v_Uv );
                `
            );
            // The following is a small tweak to a pretty deep function: D_GGX <- BRDF_GGX <- RE_Direct_Physical <- lights_fragment_begin.glsl.js
            // I added a multiplier very close to one on dotNH, as from my experimentations
            // this can effectively remove the brightest specular dot from the surface
            // also sqrt twice on dotNH so the reflections spread out more to simulate a spherical area of light
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <lights_physical_pars_fragment>`,
                ShaderChunk["lights_physical_pars_fragment"].replace(
                    "float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;",
                    "float denom = pow2( pow(dotNH, 0.25) * 0.999 ) * ( a2 - 1.0 ) + 1.0;"
                )
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <lights_physical_fragment>`,
                `#include <lights_physical_fragment>
                material.specularColor = mix( vec3( 0.04 ), diffuseReflections(vViewPosition), sqrt(metalnessFactor) );`
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                `vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;`,
                `vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
                totalDiffuse += mix(baseColor.rgb, vec3(0.), smoothstep(0.,0.5,material.roughness));
                `
            );
        };

        this.material = material;

        this.onBeforeRender = function (renderer, scene, camera) {
            reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
            cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

            rotationMatrix.extractRotation(scope.matrixWorld);

            normal.set(0, 0, 1);
            normal.applyMatrix4(rotationMatrix);

            view.subVectors(reflectorWorldPosition, cameraWorldPosition);

            // Avoid rendering when reflector is facing away

            if (view.dot(normal) > 0) return;

            view.reflect(normal).negate();
            view.add(reflectorWorldPosition);

            rotationMatrix.extractRotation(camera.matrixWorld);

            lookAtPosition.set(0, 0, -1);
            lookAtPosition.applyMatrix4(rotationMatrix);
            lookAtPosition.add(cameraWorldPosition);

            target.subVectors(reflectorWorldPosition, lookAtPosition);
            target.reflect(normal).negate();
            target.add(reflectorWorldPosition);

            virtualCamera.position.copy(view);
            virtualCamera.up.set(0, 1, 0);
            virtualCamera.up.applyMatrix4(rotationMatrix);
            virtualCamera.up.reflect(normal);
            virtualCamera.lookAt(target);

            virtualCamera.far = camera.far; // Used in WebGLBackground

            virtualCamera.updateMatrixWorld();
            virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

            // Update the texture matrix
            textureMatrix.set(
                0.5,
                0.0,
                0.0,
                0.5,
                0.0,
                0.5,
                0.0,
                0.5,
                0.0,
                0.0,
                0.5,
                0.5,
                0.0,
                0.0,
                0.0,
                1.0
            );
            textureMatrix.multiply(virtualCamera.projectionMatrix);
            textureMatrix.multiply(virtualCamera.matrixWorldInverse);
            textureMatrix.multiply(scope.matrixWorld);

            // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
            // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
            reflectorPlane.setFromNormalAndCoplanarPoint(
                normal,
                reflectorWorldPosition
            );
            reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

            clipPlane.set(
                reflectorPlane.normal.x,
                reflectorPlane.normal.y,
                reflectorPlane.normal.z,
                reflectorPlane.constant
            );

            const projectionMatrix = virtualCamera.projectionMatrix;

            q.x =
                (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
                projectionMatrix.elements[0];
            q.y =
                (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
                projectionMatrix.elements[5];
            q.z = -1.0;
            q.w =
                (1.0 + projectionMatrix.elements[10]) /
                projectionMatrix.elements[14];

            // Calculate the scaled plane vector
            clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

            // Replacing the third row of the projection matrix
            projectionMatrix.elements[2] = clipPlane.x;
            projectionMatrix.elements[6] = clipPlane.y;
            projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
            projectionMatrix.elements[14] = clipPlane.w;

            // Render
            scope.visible = false;

            const currentRenderTarget = renderer.getRenderTarget();

            const currentXrEnabled = renderer.xr.enabled;
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

            renderer.xr.enabled = false; // Avoid camera modification
            renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

            renderer.setRenderTarget(renderTarget);

            renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

            // turn on the mirror pass toggle for capturing the mirror image
            options.togglePass();

            if (renderer.autoClear === false) renderer.clear();
            renderer.render(scene, virtualCamera);

            // turn off the mirror pass for capturing the real image
            options.togglePass();

            renderer.xr.enabled = currentXrEnabled;
            renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

            renderer.setRenderTarget(currentRenderTarget);

            // Restore viewport

            const viewport = camera.viewport;

            if (viewport !== undefined) {
                renderer.state.viewport(viewport);
            }

            scope.visible = true;
        };

        this.getRenderTarget = function () {
            return renderTarget;
        };

        this.dispose = function () {
            renderTarget.dispose();
            scope.material.dispose();
        };
    }
}

// The original ReflectorShader isn't used here, so skipped including in this file

export { Reflector };
