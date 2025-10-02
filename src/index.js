import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const root = ReactDOM.createRoot(document.querySelector("#root"));

const ReactApp = () => {
    const location = useLocation();

    // Always reset scroll to top on route change and on first mount
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
                    {/* /profile route removed */}
                    </Routes>
                </AnimatePresence>
            </Suspense>
            {/* no global PNG loader; 3D logo handles intro */}
        </>
    );
};

const AppRoot = () => (
    <BrowserRouter>
        <ReactApp />
    </BrowserRouter>
);

root.render(<AppRoot />);
