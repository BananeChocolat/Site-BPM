import React from "react";
import StaggeredMenu from "@/components/StaggeredMenu";
import { menuItems, socialItems } from "@/data/menu";
import "./EventView.css";

const EventView: React.FC = () => {
  return (
    <main className="event">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={["#B19EEF", "#5227FF"]}
        accentColor="#5227FF"
        isFixed
      />
      <section className="event__content">
        <h1>Event</h1>
        <p>Page en construction.</p>
      </section>
    </main>
  );
};

export default EventView;
