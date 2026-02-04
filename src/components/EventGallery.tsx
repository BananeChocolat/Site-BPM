import React from "react";
import "./EventGallery.css";

type EventImage = {
  src: string;
  alt: string;
};

type EventGalleryProps = {
  images: EventImage[];
};

const EventGallery: React.FC<EventGalleryProps> = ({ images }) => {
  return (
    <div className="event-gallery" role="region" aria-label="Galerie d'événements">
      <div className="event-gallery__track">
        {images.map((image, index) => (
          <figure key={index} className="event-gallery__item">
            <img src={image.src} alt={image.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </div>
  );
};

export default EventGallery;
