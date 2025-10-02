import React, { useMemo } from "react";
import { PlaneGeometry, RepeatWrapping } from "three";
import { useControls } from "leva";
import { Reflector } from "./CustomReflector";
import { useTexture } from "@react-three/drei";
import { extend } from "@react-three/fiber";
// -- https://polyhaven.com/a/rock_wall_04 -- //
import FloorTexture from "../assets/rock_wall_04_rough_2kv3.jpg";
import FloorNormal from "../assets/rock_wall_04_normal_2kv2.jpg";

// https://r3f.docs.pmnd.rs/api/objects#using-3rd-party-objects-declaratively
extend({ Reflector });

const Mirror = (props) => {
    // use the controls to tweak your texture offset to the best spot
    // const ctrls = useControls({
    //     offsetX: { value: 0.49, min: 0, max: 1, step: 0.01 },
    //     offsetY: { value: 0.36, min: 0, max: 1, step: 0.01 },
    // });
    const [floor, normal] = useTexture([FloorTexture, FloorNormal]);
    floor.wrapS = RepeatWrapping;
    floor.wrapT = RepeatWrapping;
    floor.repeat.set(1, 2);
    floor.offset.set(0.49, 0.36);

    normal.wrapS = RepeatWrapping;
    normal.wrapT = RepeatWrapping;
    normal.repeat.set(1, 2);
    normal.offset.set(0.49, 0.36);

    const mirrorGeom = useMemo(() => new PlaneGeometry(7.5, 15), []);

    const shaderUniforms = useMemo(
        () => ({
            roughnessMap: { value: floor },
            normalMap: { value: normal },
        }),
        [floor, normal]
    );

    return (
        <reflector
            {...props}
            args={[
                mirrorGeom,
                {
                    clipBias: 0.003,
                    textureWidth: window.innerWidth * window.devicePixelRatio,
                    textureHeight: window.innerHeight * window.devicePixelRatio,
                    // eslint-disable-next-line react/prop-types
                    color: props.baseColor,
                    shaderUniforms: {
                        ...shaderUniforms,
                        // eslint-disable-next-line react/prop-types
                        time: props.time,
                    },
                    // eslint-disable-next-line react/prop-types
                    togglePass: props.togglePass,
                },
            ]}
        />
    );
};

export default Mirror;
