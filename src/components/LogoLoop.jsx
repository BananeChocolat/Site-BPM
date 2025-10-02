import React, { useMemo } from 'react';
import './LogoLoop.css';

const LogoLoop = ({ items = [], speed = 40, simple = false }) => {
  const trackStyle = useMemo(() => ({ animationDuration: `${speed}s` }), [speed]);
  const doubled = useMemo(() => [...items, ...items], [items]);

  return (
    <div className={`logo-loop ${simple ? 'is-simple' : ''}`}>
      <div className="logo-loop__track" style={trackStyle}>
        {doubled.map((it, idx) => {
          const isImage = Boolean(it.image);
          return (
            <div
              className={`logo-item ${isImage ? 'logo-item--image' : ''}`}
              key={idx}
              title={it.caption || it.primary || ''}
            >
              {isImage ? (
                <>
                  <img
                    src={it.image}
                    alt={it.alt || it.primary || ''}
                    loading="lazy"
                  />
                  {!simple && it.primary && (
                    <div className="logo-item__primary">{it.primary}</div>
                  )}
                </>
              ) : (
                <>
                  <div className="logo-item__primary">{it.primary}</div>
                  {it.secondary && (
                    <div className="logo-item__secondary">{it.secondary}</div>
                  )}
                  {it.caption && (
                    <div className="logo-item__caption">{it.caption}</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogoLoop;
