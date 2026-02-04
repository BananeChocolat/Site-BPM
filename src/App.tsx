import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomeView from "@/pages/HomeView";
import TeamView from "@/pages/TeamView";
import EventView from "@/pages/EventView";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/equipe" element={<TeamView />} />
        <Route path="/event" element={<EventView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
