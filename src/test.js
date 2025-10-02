import React, { useEffect } from "react";

const EmptyGroup = ({ setIsLoaded }) => {
    useEffect(() => {
        setIsLoaded(true);
    }, [setIsLoaded]);

    return <group />;
};

export default EmptyGroup;
