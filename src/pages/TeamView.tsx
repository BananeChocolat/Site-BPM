import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StaggeredMenu from "@/components/StaggeredMenu";
import { menuItems, socialItems } from "@/data/menu";
import { teamNodes, type TeamNode } from "@/data/team";
import logoUrl from "@/assets/logo.png";
import "./TeamView.css";

const MIN_SCALE = 0.55;
const MAX_SCALE = 2.6;
const CARD_SIZE = 180;
const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 2200;
const CANVAS_CENTER = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const TeamView: React.FC = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    pointerId: number;
  } | null>(null);

  const centerView = useCallback(
    (scaleOverride?: number) => {
      if (!viewportRef.current) return;
      const scale = typeof scaleOverride === "number" ? scaleOverride : transform.scale;
      const rect = viewportRef.current.getBoundingClientRect();
      setTransform({
        scale,
        x: (rect.width - CANVAS_WIDTH * scale) / 2,
        y: (rect.height - CANVAS_HEIGHT * scale) / 2
      });
    },
    [transform.scale]
  );

  const zoomBy = (factor: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE)
    }));
  };

  const resetView = () => {
    centerView(1);
  };

  const canvasStyle = useMemo(
    () => ({ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})` }),
    [transform]
  );

  const nodeStyle = (node: TeamNode) => {
    const left = CANVAS_CENTER.x + node.x - CARD_SIZE / 2;
    const top = CANVAS_CENTER.y + node.y - CARD_SIZE / 2;
    return { left: `${left}px`, top: `${top}px` };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLElement)) return;
    event.preventDefault();
    setIsDragging(true);
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
      pointerId: event.pointerId
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const { startX, startY, originX, originY } = dragState.current;
    setTransform((prev) => ({
      ...prev,
      x: originX + (event.clientX - startX),
      y: originY + (event.clientY - startY)
    }));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    if (event.currentTarget.hasPointerCapture(dragState.current.pointerId)) {
      event.currentTarget.releasePointerCapture(dragState.current.pointerId);
    }
    dragState.current = null;
    setIsDragging(false);
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setTransform((prev) => ({
      ...prev,
      scale: clamp(prev.scale - event.deltaY * 0.0018, MIN_SCALE, MAX_SCALE)
    }));
  };

  useEffect(() => {
    centerView(1);
    const handleResize = () => centerView(transform.scale);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [centerView, transform.scale]);

  return (
    <main className="team">
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
        logoUrl={logoUrl}
        accentColor="#5227FF"
        isFixed
      />

      <section className="team-frame">
        <div className="team-label">Organigramme</div>
        <div className="team-toolbar">
          <button type="button" className="team-button" onClick={() => zoomBy(1.12)}>
            +
          </button>
          <button type="button" className="team-button" onClick={() => zoomBy(0.9)}>
            -
          </button>
          <button type="button" className="team-button" onClick={resetView}>
            Reset
          </button>
        </div>
        <div className="team-hint">Glissez pour bouger. Molette pour zoomer.</div>

        <div
          ref={viewportRef}
          className="team-viewport"
          data-dragging={isDragging || undefined}
          role="region"
          aria-label="Organigramme"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
        >
          <div className="team-canvas" style={canvasStyle}>
            <div className="team-tree">
              {teamNodes.map((node, index) => (
                <div key={`${node.id}-${index}`} className="team-node" style={nodeStyle(node)}>
                  <div className="team-card">
                    <img className="team-avatar" src={node.photo} alt={node.name} loading="lazy" />
                    <span className="team-name">{node.name}</span>
                    <span className="team-role">{node.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TeamView;
