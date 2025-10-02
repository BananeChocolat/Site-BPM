import React from 'react';
import './LoadingScreen.css';
import Logo from '../assets/logo.png';

const LoadingScreen = ({ simulateMs = 5600 }) => {
  const [progress, setProgress] = React.useState(0);
  const [leaving, setLeaving] = React.useState(false);
  const [mounted, setMounted] = React.useState(true);

  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = Math.max(1000, simulateMs);

    const tick = (t) => {
      const elapsed = t - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      // Ease-out for nicer finish
      const eased = pct < 100 ? (1 - Math.pow(1 - pct / 100, 2)) * 100 : 100;
      setProgress(eased);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        // trigger a smooth fade-out, then unmount
        setLeaving(true);
        setTimeout(() => setMounted(false), 520);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [simulateMs]);

  if (!mounted) return null;
  return (
    <div className={`loading-overlay ${leaving ? 'is-leaving' : ''}`} aria-live="polite" aria-busy="true">
      <div className="loading-inner">
        <img src={Logo} alt="" aria-hidden="true" className="loading-platine" draggable="false" />
        <div className="loading-percent">{Math.round(progress)}%</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
