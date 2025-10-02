import { Object3D, Vector3, AdditiveBlending } from "three";
import React, { Fragment, useMemo, useRef, useState, useEffect, lazy } from "react";
import { useFrame } from "@react-three/fiber";
// drei docs: https://github.com/pmndrs/drei
import { Stats, OrbitControls, useTexture } from "@react-three/drei";
import Mirror from "./shaders/reflector";
import { delayForDemo } from "./utils";
import logoUrl from "./assets/logo.png";

function Rig() {
    const defaultVec = useMemo(() => new Vector3(0, 1.2, 4.5), []);
    const mobileVec = useMemo(() => new Vector3(0, 0.95, 4.5), []);
    const vec = useMemo(() => new Vector3(0, 1.2, 4.5), []);

    return useFrame(({ camera, pointer }) => {
        if (window.innerWidth >= 600) {
            vec.set(pointer.x * 0.8, 1.2 + pointer.y * 0.2, 4.5);
            camera.position.lerp(vec, 0.03);
            camera.lookAt(0, 1.2, 0);
        } else if (window.innerWidth < 600) {
            // position the cam to show the overlay text more clearly
            camera.position.lerp(mobileVec, 0.03);
            camera.lookAt(0, 1.2, 0);
        } else {
            camera.position.lerp(defaultVec, 0.03);
            camera.lookAt(0, 1.2, 0);
        }
    });
}

// Lazy-loading components is one of the ways to activate the Suspense component
// To give a minimum loading time for the wrapping suspense component, we have to use this workaround
const EmptyGroup = lazy(() => delayForDemo(import("./test.js")));

function LogoMesh({ visible = true, onSettled, spinDuration = 4, totalTurns = 6 }) {
    const texture = useTexture(logoUrl);
    const meshRef = useRef();
    const ghostsRef = useRef([]);
    const multipliersRef = useRef([-2, -1, 1, 2]);
    const [size, setSize] = useState([2, 2]);
    const spinStartRef = useRef(null);
    const settledRef = useRef(false);
    const blurAmtRef = useRef(0);

    useEffect(() => {
        const img = texture?.image || texture?.source?.data;
        if (img && img.width && img.height) {
            const baseW = 2.85; // 5% smaller than previous size
            const baseH = (img.height / img.width) * baseW;
            setSize([baseW, baseH]);
        }
    }, [texture]);
    useFrame(({ camera, clock }) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        mesh.lookAt(camera.position);
        if (spinStartRef.current === null) spinStartRef.current = clock.getElapsedTime();
        if (!settledRef.current) {
            const t = clock.getElapsedTime() - spinStartRef.current;
            const dur = Math.max(0.1, spinDuration);
            const progress = Math.min(1, Math.max(0, t / dur));
            const ease = 1 - Math.pow(1 - progress, 3);
            const remaining = 1 - ease;
            const angle = remaining * totalTurns * Math.PI * 2;
            mesh.rotation.z = angle;
            // Motion blur amount proportional to remaining spin
            blurAmtRef.current = Math.max(0, Math.min(1, remaining));
            const ghosts = ghostsRef.current || [];
            const mults = multipliersRef.current || [];
            const offsetBase = 0.5 * blurAmtRef.current; // stronger spread
            ghosts.forEach((g, i) => {
                if (!g) return;
                const mul = mults[i] ?? (i % 2 === 0 ? -1 : 1);
                g.rotation.z = angle + mul * offsetBase;
                if (g.material) {
                    const strength = Math.abs(mul) === 1 ? 1 : 0.75;
                    g.material.opacity = 0.28 * strength * blurAmtRef.current;
                }
            });
            if (progress >= 1) {
                mesh.rotation.z = 0;
                settledRef.current = true;
                onSettled?.();
            }
        }
    });
    return (
        <group visible={visible}>
            <mesh ref={meshRef} renderOrder={10}>
                <planeGeometry args={size} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    depthTest={false}
                    depthWrite={false}
                    toneMapped={false}
                    fog={false}
                />
            </mesh>
            {/* four ghost planes for a stronger motion blur effect */}
            {multipliersRef.current.map((mul, k) => (
                <mesh
                    // eslint-disable-next-line react/no-array-index-key
                    key={k}
                    ref={(el) => (ghostsRef.current[k] = el)}
                    renderOrder={9}
                >
                    <planeGeometry args={size} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={0}
                        blending={AdditiveBlending}
                        depthTest={false}
                        depthWrite={false}
                        toneMapped={false}
                        fog={false}
                        color={0xffffff}
                    />
                </mesh>
            ))}
        </group>
    );
}

const App = ({ setIsLoaded, onLogoSettled }) => {
    // This is used by the scene background, fog and the reflector base color
    // previously I use a dark color instead of pitch black, but with StandardMaterial, pure black is the easier option
    const bgColor = 0x000000;

    const mirrorRef = useRef();

    // This flag is solely for making a workaround to correct the fresnel angle in the reflection
    const mirrorPass = useMemo(() => ({ value: 0.0 }), []);

    // useMemo is essential for dynamic uniforms, since any state changes trigger component rerendering, which also creates a new uniforms object if you don't useMemo to cache the object
    // in such case(without useMemo), your code that updates the uniforms will most probably "froze" bcaz the reference to the new uniforms object is lost
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 1 },
            uMirrorPass: mirrorPass,
        }),
        // eslint-disable-next-line
        []
    ); // remember to put [] as dependencies, so that the memo function is only run once on mount
    // moving target for the spot light
    const lightTarget = useMemo(() => new Object3D(), []);
    // the target vector used for lightTarget(spot light)
    const ltVec = useMemo(() => new Vector3(0, 0, 4.5 * 0.3), []);

    const [pearlVisible, setPearlVisible] = useState(true);

    const togglePass = () => {
        mirrorPass.value = mirrorPass.value ? 0.0 : 1.0;
    };

    useFrame(({ clock, pointer }, delta) => {
        uniforms.uTime.value += 0.3 * delta;

        // the spot light should shine at less than half way from the sphere to the camera on the ground
        ltVec.set(pointer.x * 0.8 * 0.3, 0, 4.5 * 0.3);
        lightTarget.position.lerp(ltVec, 0.03);
    });

    return (
        <Fragment>
            {/* EmptyGroup is just for adding a minimum loading time */}
            <EmptyGroup setIsLoaded={setIsLoaded} />
            {/* <OrbitControls target={[0, 1.2, 0]} /> */}
            {/* <Stats className="stats" /> */}
            <Rig />
            <color attach="background" args={[bgColor]} />
            <fog attach="fog" color={bgColor} near={3} far={7} />
            {/* very important for the light target to be added in the scene for the spotLight.target to work */}
            <primitive object={lightTarget} position={[0, 0, 4.5 * 0.3]} />
            <spotLight
                position={[0, 1.2, 0]}
                intensity={0.6}
                target={lightTarget}
                penumbra={1.0}
                angle={Math.PI / 4}
            />
            <group position={[0, 1.2, 0]}>
                <pointLight color={0xffffff} intensity={0.6} />
                {/* Spinning logo on mount, then settle upright */}
                <LogoMesh visible={pearlVisible} onSettled={onLogoSettled} spinDuration={4} totalTurns={6} />
            </group>
            <group ref={mirrorRef} position={[0, 0, 0]}>
                <Mirror
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                    baseColor={bgColor}
                    togglePass={togglePass}
                    time={uniforms.uTime}
                />
            </group>
        </Fragment>
    );
};

export default App;
