import React from 'react';
import styled from 'styled-components';

// Generic scroll-reveal text animation (character-based)
// Usage: <ScrollRevealText text="Hello world" step={6} />
const Reveal = styled.span`
  display: inline-block;
  white-space: pre-line; /* keep line breaks */
  .char {
    display: inline-block;
    transform: translateY(12px);
    opacity: 0;
    transition: transform 180ms ease, opacity 180ms ease;
    transition-delay: var(--d, 0ms);
    will-change: transform, opacity;
  }
  &.is-visible .char { transform: translateY(0); opacity: 1; }
  .char.space { opacity: 1; transform: none; transition: none; }
`;

const ScrollRevealText = ({ text = '', delayStart = 0, step = 6, className = '' }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Reveal ref={ref} className={className}>
      {Array.from(text).map((ch, i) => {
        if (ch === '\\n') return <br key={`br-${i}`} />;
        if (ch === ' ') return <span className="char space" key={i}>{"\u00A0"}</span>;
        return <span className="char" key={i} style={{ '--d': `${delayStart + i * step}ms` }}>{ch}</span>;
      })}
    </Reveal>
  );
};

export default ScrollRevealText;

