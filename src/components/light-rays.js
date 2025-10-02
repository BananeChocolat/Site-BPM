import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: ${(p) => p.$intensity};
`;

const Layer = styled.div`
    position: absolute;
    /* focus the effect near the top like a spotlight */
    inset: -10vmax -20vmax 35vh -20vmax;
    filter: blur(18px) saturate(130%);
    animation: ${spin} linear ${(p) => p.$duration}s infinite;
    transform-origin: 50% 0%;
    background:
        /* soft top glow */
        radial-gradient(
            ellipse at 50% -40%,
            rgba(255, 255, 255, 0.35),
            rgba(255, 255, 255, 0.08) 35%,
            rgba(255, 255, 255, 0.0) 60%
        ),
        /* rays emanating from the top center */
        repeating-conic-gradient(
            from ${(p) => p.$offset}deg at 50% 0%,
            rgba(255, 255, 255, 0.0) 0deg 8deg,
            rgba(255, 255, 255, 0.09) 8deg 12deg
        );
    /* keep only the upper cone region visible */
    mask-image:
        radial-gradient(120% 70% at 50% -20%, white 0%, rgba(255, 255, 255, 0) 65%),
        linear-gradient(to bottom, white 0%, white 30%, rgba(255, 255, 255, 0) 80%);
    -webkit-mask-image:
        radial-gradient(120% 70% at 50% -20%, white 0%, rgba(255, 255, 255, 0) 65%),
        linear-gradient(to bottom, white 0%, white 30%, rgba(255, 255, 255, 0) 80%);
`;

const LightRays = ({ intensity = 0.5, speed = 60 }) => {
    // two layers with different speeds and phase offsets for richer motion
    return (
        <Wrapper $intensity={intensity}>
            <Layer $duration={speed} $offset={0} />
            <Layer $duration={speed * 1.5} $offset={45} />
        </Wrapper>
    );
};

export default LightRays;
