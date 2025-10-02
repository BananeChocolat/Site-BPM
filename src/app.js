import { Object3D, Vector3, AdditiveBlending } from "three";
import React, { Fragment, useMemo, useRef, useState, useEffect, lazy } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import Mirror from "./shaders/reflector";
import { delayForDemo } from "./utils";
import logoUrl from "./assets/logo.png";

function Rig() {
    const defaultVec = useMemo(() => new Vector3(0, 1.2, 4.5), []);
    const mobileVec = useMemo(() => new Vector3(0, 0.95, 4.5), []);
    const vec = useMemo(() => new Vector3(0, 1.2, 4.5), []);

    // Subtle parallax camera rig
    return useFrame(({ camera, pointer }) => {
        if (window.innerWidth >= 600) {
            vec.set(pointer.x * 0.8, 1.2 + pointer.y * 0.2, 4.5);
            camera.position.lerp(vec, 0.03);
            camera.lookAt(0, 1.2, 0);
        } else if (window.innerWidth < 600) {
            // Mobile: keep overlay text readable
            camera.position.lerp(mobileVec, 0.03);
            camera.lookAt(0, 1.2, 0);
        } else {
            camera.position.lerp(defaultVec, 0.03);
            camera.lookAt(0, 1.2, 0);
        }
    });
}

// Ensure Suspense has a minimum visible duration
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
            // Motion blur strength scales with remaining spin
            blurAmtRef.current = Math.max(0, Math.min(1, remaining));
            const ghosts = ghostsRef.current || [];
            const mults = multipliersRef.current || [];
            const offsetBase = 0.5 * blurAmtRef.current;
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
            {/* Ghost planes: additive trail for motion blur */}
            {multipliersRef.current.map((mul, k) => (
                <mesh
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
    // Scene background/fog and mirror base color
    const bgColor = 0x000000;

    const mirrorRef = useRef();

    // Toggle used to switch mirror pass during offscreen render
    const mirrorPass = useMemo(() => ({ value: 0.0 }), []);

    // Dynamic uniforms (stable reference for frame updates)
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uOpacity: { value: 1 },
            uMirrorPass: mirrorPass,
        }),
        []
    );
    // Moving target for the spotlight
    const lightTarget = useMemo(() => new Object3D(), []);
    // Target vector used for lightTarget (spotlight)
    const ltVec = useMemo(() => new Vector3(0, 0, 4.5 * 0.3), []);

    const [pearlVisible, setPearlVisible] = useState(true);

    const togglePass = () => {
        mirrorPass.value = mirrorPass.value ? 0.0 : 1.0;
    };

    useFrame(({ clock, pointer }, delta) => {
        uniforms.uTime.value += 0.3 * delta;
        // Spotlight follows pointer, limited range
        ltVec.set(pointer.x * 0.8 * 0.3, 0, 4.5 * 0.3);
        lightTarget.position.lerp(ltVec, 0.03);
    });

    return (
        <Fragment>
            {/* Minimal loading gate for Suspense */}
            <EmptyGroup setIsLoaded={setIsLoaded} />
            <Rig />
            <color attach="background" args={[bgColor]} />
            <fog attach="fog" color={bgColor} near={3} far={7} />
            {/* Light target must be in the scene for spotlight.target */}
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
                {/* Spinning logo on mount, then settle upright */
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
