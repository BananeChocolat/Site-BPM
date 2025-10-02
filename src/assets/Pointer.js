import * as React from "react";
const PointerIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={6}
        height={10}
        fill="none"
        {...props}
    >
        <path
            fill="#fff"
            d="M0 4.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-1ZM3 7.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1ZM3 1.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1Z"
        />
    </svg>
);
export default PointerIcon;
