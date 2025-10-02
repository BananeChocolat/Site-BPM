import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/home";

const root = ReactDOM.createRoot(document.querySelector("#root"));

const ReactApp = () => {
    const location = useLocation();

    // Reset scroll on route changes (and first mount)
    React.useEffect(() => {
        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch (_) {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    return (
        <>
            <Suspense fallback={null}>
                <AnimatePresence mode="wait">
                    <Routes key={location.pathname} location={location}>
                        <Route path="/" Component={Home} />
                    </Routes>
                </AnimatePresence>
            </Suspense>
        </>
    );
};

const AppRoot = () => (
    <BrowserRouter>
        <ReactApp />
    </BrowserRouter>
);

root.render(<AppRoot />);
