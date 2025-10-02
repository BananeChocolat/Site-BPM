/**
 * ProgressiveImage Component
 *
 * A React component that implements progressive image loading with a low-res placeholder.
 * The component first displays a low-resolution version of the image while loading the
 * high-resolution version in the background. Once the high-res image is loaded, it
 * smoothly transitions between the two using CSS positioning.
 *
 * @component
 *
 * @param {string} props.lowResSrc - URL of the low-resolution image
 * @param {string} props.highResSrc - URL of the high-resolution image
 * @param {string} props.alt - Alt text for the image
 * @param {string} [props.loading="lazy"] - Loading strategy ("lazy" | "eager")
 *
 * @example
 * // Basic usage
 * <ProgressiveImage
 *   lowResSrc="/images/photo_lowres.jpg"
 *   highResSrc="/images/photo.jpg"
 *   alt="Description"
 *   loading="lazy"
 * />
 *
 * @note
 * - Parent container must have position: relative
 * - Low-res image should be significantly smaller in file size
 * - Component uses absolute positioning to handle image swapping
 */

import React, { useState, useRef } from "react";
import styled from "styled-components";

const ProgressiveImageContainer = styled.div`
    position: relative;
    .pi-wrapper {
        img {
            min-width: 100%;
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
            &.original {
                position: absolute;
            }
            &.thumb {
                filter: blur(8px);
                transition-delay: 0.5s;
            }
            &.hide {
                opacity: 0;
            }
        }
        .thumb-wrapper {
            overflow: hidden;
        }
    }
`;

const ProgressiveImage = ({ lowResSrc, highResSrc, alt, loading }) => {
    const [highResLoaded, setHighResLoaded] = useState(false);
    const imgRef = useRef(null);

    return (
        <ProgressiveImageContainer>
            <div className="pi-wrapper">
                <img
                    className={`original ${highResLoaded ? "" : "hide"}`}
                    src={highResSrc}
                    alt={alt}
                    ref={imgRef}
                    onLoad={() => setHighResLoaded(true)}
                />
                <div className="thumb-wrapper">
                    <img
                        src={lowResSrc}
                        className={`thumb ${highResLoaded ? "hide" : ""}`}
                        loading={loading}
                    />
                </div>
            </div>
        </ProgressiveImageContainer>
    );
};

export default ProgressiveImage;
