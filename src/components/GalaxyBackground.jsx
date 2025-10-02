import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERT = `
precision highp float;
attribute vec3 position;
void main(){
  gl_Position = vec4(position, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform float uIntensity;
uniform float uNebula;
uniform float uStarDensity;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

// Simple FBM for nebula
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i);
  float b=hash(i+vec2(1.0,0.0));
  float c=hash(i+vec2(0.0,1.0));
  float d=hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p){
  float v=0.0;
  float a=0.5;
  mat2 m=mat2(0.8,0.6,-0.6,0.8);
  for(int i=0;i<5;i++){
    v+=a*noise(p);
    p=m*p*2.02;
    a*=0.5;
  }
  return v;
}

// Star at cell centers with soft falloff
float starField(vec2 uv, float scale, float density){
  vec2 gv = fract(uv*scale) - 0.5;
  vec2 id = floor(uv*scale);
  float rnd = hash(id);
  float present = step(1.0 - density, rnd);
  float d = length(gv);
  float star = smoothstep(0.25, 0.0, d);
  // twinkle
  float tw = 0.5 + 0.5 * sin(iTime*2.0 + rnd*6.2831);
  return present * star * tw;
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 R = iResolution.xy;
  vec2 uv = (frag - 0.5*R)/R.y; // preserve aspect

  // Slow drift and swirl
  float t = iTime * 0.02;
  float ca = cos(t), sa = sin(t);
  mat2 rot = mat2(ca,-sa,sa,ca);
  vec2 suv = rot * (uv * 1.2 + vec2(0.0, t*0.6));

  // Nebula base
  float neb = fbm(suv*2.0);
  neb = pow(neb, 2.2);
  vec3 nebCol = mix(vec3(0.02,0.01,0.05), vec3(0.08,0.04,0.12), neb) * uNebula;

  // Multi-scale starfield
  float st1 = starField(suv, 40.0, uStarDensity);
  float st2 = starField(suv*1.6 + 7.3, 70.0, uStarDensity);
  float st3 = starField(suv*2.3 - 3.1, 120.0, uStarDensity);
  float stars = st1*0.9 + st2*0.6 + st3*0.45;

  vec3 col = nebCol + vec3(stars) * uIntensity;

  // vignette for subtle edges
  float v = smoothstep(1.2, 0.2, length(uv));
  col *= mix(0.8, 1.0, v);

  gl_FragColor = vec4(col, 1.0);
}
`;

const GalaxyBackground = ({
  className,
  style,
  intensity = 0.85,
  nebula = 0.55,
  starDensity = 0.985 // closer to 1.0 -> fewer stars
}) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const uniformsRef = useRef(null);
  const pausedRef = useRef(false);
  const inViewRef = useRef(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, depth: false, stencil: false });
    rendererRef.current = renderer;
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector3(1, 1, pr) },
      uIntensity: { value: intensity },
      uNebula: { value: nebula },
      uStarDensity: { value: starDensity }
    };
    uniformsRef.current = uniforms;

    const material = new THREE.RawShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.iResolution.value.set(w * pr, h * pr, pr);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    const io = new IntersectionObserver((e) => { inViewRef.current = e[0]?.isIntersecting ?? true; }, { threshold: 0 });
    io.observe(mount);

    const onVis = () => { pausedRef.current = document.hidden; };
    document.addEventListener('visibilitychange', onVis, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (pausedRef.current || !inViewRef.current) return;
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(canvas)) mount.removeChild(canvas);
    };
  }, [intensity, nebula, starDensity]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }}
      aria-hidden="true"
    />
  );
};

export default GalaxyBackground;

