import React from "react";
import { create } from "zustand";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { throttle } from "throttle-debounce";
import { useNavigate } from "react-router-dom";

export const displayHKTime = () => {
    return formatInTimeZone(new Date(), "Asia/Hong_Kong", "h:mm aaaa");
};

export const displayYear = () => {
    return format(new Date(), "yyyy");
};

export const useStore = create((set) => ({
    animeDelay: false,
    setAnimeDelay: (done) => set({ animeDelay: done }),
}));

export const ThrottledLink = ({ to, children, ...props }) => {
    const navigate = useNavigate();

    const handleClick = throttle(500, () => {
        navigate(to);
    });

    return (
        <a {...props} onClick={handleClick} style={{ cursor: "pointer" }}>
            {children}
        </a>
    );
};

export const delayForDemo = (promise) => {
    return new Promise((resolve) => {
        setTimeout(resolve, 50);
    }).then(() => promise);
};
