import React, { useEffect, useRef, useState } from "react";
import RevealText from "./RevealText";
import type { EquipmentCard } from "@/data/equipment";
import sideRight from "@/assets/ec1.jpg";
import sideLeft from "@/assets/ec2.jpg";
import "./EquipmentGrid.css";

type EquipmentGridProps = {
  title: string;
  cards: EquipmentCard[];
  textAutoHide?: boolean;
};

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ title, cards, textAutoHide = true }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`equip-section ${isVisible ? "is-visible" : ""}`}>
      <img className="equip-side equip-side--right" src={sideRight} alt="" aria-hidden="true" />
      <img className="equip-side equip-side--left" src={sideLeft} alt="" aria-hidden="true" />

      <div className="equip-content">
        <h2 className="equip-title">
          <RevealText text={title} step={10} />
        </h2>

        <div className="equip-grid">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`equip-card ${card.large ? "is-large" : ""} ${textAutoHide ? "text-autohide" : ""}`}
              style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}
            >
              <header className="equip-card__header">
                <span className="equip-card__label">{card.label}</span>
              </header>
              <div className="equip-card__content">
                <h3 className="equip-card__title">{card.title}</h3>
                <p className="equip-card__description">{card.description}</p>
                {card.image && (
                  <div className="equip-card__image" style={{ height: card.imageHeight || undefined }}>
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      style={card.imageOffsetY ? { transform: `translateY(${card.imageOffsetY}px)` } : undefined}
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EquipmentGrid;
