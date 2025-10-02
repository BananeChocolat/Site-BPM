import React, { useState } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import App3D from "../app";
import LightRays from "../components/LightRays.jsx";
import MagicBento from "../components/MagicBento.jsx";
import LaserFlow from "../components/LaserFlow.jsx";
import LogoLoop from "../components/LogoLoop.jsx";
import ElectricBorder from "../components/ElectricBorder.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import LikeButton from "../components/LikeButton.jsx";
// Logos used in the marquee loop
import grandMA2Logo from "../assets/grandMA2-Photoroom.png";
import laNetLogo from "../assets/lanet.png";
import qlcLogo from "../assets/QLC+.png";
import sketchupLogo from "../assets/sket.png";
import tspLogo from "../assets/tsp.png";
import imtbsLogo from "../assets/logo_IMT_BS_W.png";
import tedxLogo from "../assets/tedx.png";
import technoParadAlt from "../assets/technoparad.png";
import parisLogo from "../assets/paris.png";
import navaLogo from "../assets/nava.png";
import ScrollRevealText from "../components/ScrollRevealText.jsx";
import VIDAL from "../assets/VIDAL.png";

const HomeLayout = styled.div`
    display: block;
    min-height: 100vh;
`;

const Hero = styled.section`
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
`;

// Wrapper for 3D hero + blur mask on scroll
const HeroInner = styled.div`
    position: absolute;
    inset: 0;
    will-change: filter, opacity, transform, -webkit-mask-image, mask-image;
    /* Smooth blur based on scroll progress */
    filter: ${(p) => `blur(${(p.$progress || 0) * 12}px)`};
    opacity: ${(p) => 1 - (p.$progress || 0) * 0.1};

    /* Soft fade at the bottom edge that grows with progress */
    -webkit-mask-image: ${(p) => {
        const prog = Math.max(0, Math.min(1, p.$progress || 0));
        const cutoff = 78 - prog * 28; /* from 78% to 50% */
        return `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${cutoff}%, rgba(0,0,0,0) 100%)`;
    }};
    mask-image: ${(p) => {
        const prog = Math.max(0, Math.min(1, p.$progress || 0));
        const cutoff = 78 - prog * 28;
        return `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${cutoff}%, rgba(0,0,0,0) 100%)`;
    }};
`;

// 3D Canvas visibility wrapper
const CanvasWrap = styled.div`
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: ${(p) => (p.$visible ? 1 : 0)};
    transition: opacity 700ms ease;
`;

const LeftTitle = styled.h1`
    position: absolute;
    left: clamp(16px, 4vw, 48px);
    top: 50%;
    transform: translateY(${(p) => (p.$visible ? '-50%' : 'calc(-50% + 10px)')});
    z-index: 3;
    display: inline-flex;
    flex-direction: column;
    align-items: center; /* center second line under CLUB */
    text-align: center;
    margin: 0;
    color: #ffffff;
    font-family: 'Compressa VF', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    font-weight: 900;
    line-height: 0.9;
    text-transform: uppercase;
    /* If the VF is available, lock the bold axis */
    font-variation-settings: 'wght' 900;
    opacity: ${(p) => (p.$visible ? 1 : 0)};
    transition: opacity 600ms ease 200ms, transform 600ms ease 200ms;

    span { display: block; white-space: nowrap; }
    .big {
        font-size: clamp(56px, 14vw, 220px);
    }
    .sub {
        font-size: clamp(22px, 4.5vw, 80px);
        font-family: 'Ephesis', cursive;
        text-transform: lowercase;
        font-style: normal;
    }

    /* Portrait: center title above the logo, hide right title */
    @media (orientation: portrait) {
        left: 50%;
        top: 20%;
        transform: translate(-50%, ${() => '-50%'});
        align-items: center;
        text-align: center;
        /* Boost sizes in portrait where vw is too small */
        .big {
            font-size: clamp(84px, 14svh, 280px);
        }
        .sub {
            font-size: clamp(28px, 5.5svh, 96px);
        }
    }
`;

const RightTitle = styled.h1`
    position: absolute;
    /* Slightly more to the right */
    left: 80%;
    top: 50%;
    transform: ${(p) => (p.$visible ? 'translate(-50%, -50%)' : 'translate(-50%, -42%)')};
    z-index: 3;
    margin: 0;
    color: #ffffff;
    font-family: 'Compressa VF', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    font-weight: 900;
    line-height: 0.9;
    text-transform: uppercase;
    font-variation-settings: 'wght' 900;
    cursor: pointer; /* show it's clickable */
    user-select: none;
    opacity: ${(p) => (p.$visible ? 1 : 0)};
    transition: opacity 600ms ease 320ms, transform 600ms ease 320ms;
    .big {
        display: inline-block;
        font-size: clamp(56px, 14vw, 220px);
        padding: 0 0.08em;
        border-radius: 10px;
        transition: background-color 200ms ease, color 200ms ease;
    }
    &:hover .big { background: #ffffff; color: #000000; }
    @media (max-width: 900px) {
        left: 75%;
    }
    @media (max-width: 600px) {
        left: 70%;
    }
    @media (orientation: portrait) {
        display: none;
    }
`;

const Content = styled.div`
    position: relative;
    z-index: 3;
    /* Allow children (like offset cards) to render outside without clipping */
    overflow: visible;
`;

// Horizontal logo loop container
const LoopSection = styled.section`
    position: relative;
    z-index: 3;
    /* Match Magic Bento width */
    max-width: 54em;
    margin: clamp(32px, 7vw, 96px) auto;
    padding: 0 clamp(16px, 4vw, 24px);
    /* Match Magic Bento responsive scale so 54em maps the same */
    font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
`;

// Full-width horizontal slider of team cards
const SliderSection = styled.section`
    position: relative;
    z-index: 3;
    /* Match other section width */
    max-width: 54em;
    margin: clamp(32px, 7vw, 96px) auto;
    padding: 0 clamp(16px, 4vw, 24px);
    /* Keep same responsive scale as other sections */
    font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
`;

const SliderTitle = styled.h3`
    color: #ffffff;
    font-family: 'Compressa VF', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    font-weight: 800;
    font-variation-settings: 'wght' 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1;
    font-size: clamp(18px, 3.4vw, 28px);
    margin: 0 0 12px 0;
    flex: 1 1 auto;
    min-width: 0; /* allow flexbox to shrink */
    word-break: break-word;
    hyphens: auto;
    @media (max-width: 640px) {
        letter-spacing: 0.02em;
        font-size: clamp(16px, 4vw, 22px);
        margin-bottom: 6px;
    }
`;

const SliderHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;
    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }
`;

const SwipeHint = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--white-icon, #bbb);
    font-size: 13px;
    letter-spacing: 0.04em;
    user-select: none;
    .chev { width: 12px; height: 12px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; opacity: 0.8; }
    .left { transform: rotate(135deg); opacity: 0.6; }
    .right { transform: rotate(-45deg); }
    @media (max-width: 640px) {
        display: none;
    }
`;

const SliderViewport = styled.div`
    width: 100%;
    /* Match width and center */
    max-width: 54em;
    margin: 0 auto;
    position: relative;
    overflow-x: auto;
    overflow-y: visible;
    /* Extra vertical breathing room so offset cards are never cropped */
    padding: clamp(32px, 6vw, 96px) clamp(16px, 4vw, 24px);
    /* Snap to center so each card parks centered */
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    /* Match section responsive scale */
    font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
    /* Hide horizontal scrollbar while keeping scroll */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    &::-webkit-scrollbar { display: none; }
    /* Soft side fade like Hero's mask */
    --side-fade: clamp(24px, 8vw, 96px);
    -webkit-mask-image: linear-gradient(
      to right,
      rgba(0,0,0,0) 0,
      rgba(0,0,0,1) var(--side-fade),
      rgba(0,0,0,1) calc(100% - var(--side-fade)),
      rgba(0,0,0,0) 100%
    );
    mask-image: linear-gradient(
      to right,
      rgba(0,0,0,0) 0,
      rgba(0,0,0,1) var(--side-fade),
      rgba(0,0,0,1) calc(100% - var(--side-fade)),
      rgba(0,0,0,0) 100%
    );
`;

const SliderTrack = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min(368px, 82vw);
    /* Spacing between cards */
    gap: clamp(28px, 5vw, 72px);
    align-items: start;
`;

const Slide = styled.div`
    scroll-snap-align: center;
    scroll-snap-stop: always;
    width: min(368px, 82vw);
    transform: translateY(var(--offset, 0px));
    transition: transform 500ms ease;
`;

// Contact & Footer
const ContactSection = styled.section`
    position: relative;
    z-index: 3;
    max-width: 54em;
    margin: clamp(32px, 7vw, 96px) auto;
    padding: 0 clamp(16px, 4vw, 24px);
    font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
`;

const ContactCard = styled.div`
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border-radius: 20px;
    padding: clamp(16px, 3vw, 24px);
    color: #fff;
`;

const ContactTitle = styled.h3`
    color: #ffffff;
    font-family: 'Compressa VF', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    font-weight: 800;
    font-variation-settings: 'wght' 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1;
    font-size: clamp(18px, 3.4vw, 28px);
    margin: 0 0 12px 0;
`;

const ContactSubtitle = styled.h4`
    color: var(--sec, #bbb);
    font-size: clamp(14px, 1.6vw, 18px);
    margin: 0 0 6px 0;
`;

const ContactGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
`;

const InfoBlock = styled.div`
    color: var(--white, #fff);
    opacity: 0.9;
    p { margin: 0 0 12px 0; }
    .row { display: flex; align-items: center; gap: 8px; color: var(--white-icon, #ddd); }
    .row span.value { color: var(--white, #fff); }
`;

const ContactForm = styled.form`
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    input, textarea {
        width: 100%;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 10px;
        color: #fff;
        padding: 10px 12px;
        font: inherit;
    }
    textarea { min-height: 120px; resize: vertical; }
    button {
        justify-self: start;
        background: #fff;
        color: #000;
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        font-weight: 700;
        cursor: pointer;
    }
`;

const Footer = styled.footer`
    position: relative;
    z-index: 3;
    width: 100%;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: clamp(24px, 6vw, 48px) 0;
`;

const FooterInner = styled.div`
    max-width: 64rem;
    margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 24px);
`;

const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    @media (min-width: 1024px) { grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
`;

const SocialColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    @media (min-width: 1024px) { align-items: flex-start; }
`;

const SocialRow = styled.div`
    display: flex;
    gap: 24px;
    a { color: var(--white-icon, #ccc); transition: color 0.2s ease; }
    a:hover { color: var(--white, #fff); }
`;

const BuiltColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    @media (min-width: 1024px) { align-items: flex-start; }
`;

const BuiltRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--white-icon, #bbb);
    font-size: 14px;
    span.value { color: var(--white, #fff); }
`;

const PlayerColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 1024px) { align-items: flex-start; }
    .player { width: 100%; max-width: 20rem; height: 160px; border-radius: 12px; border: 0; }
`;

const FooterBottom = styled.div`
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
    color: var(--white-icon, #bbb);
    font-size: 13px;
    text-align: center;
`;

const LoopTitle = styled.h3`
    color: #ffffff;
    font-family: 'Compressa VF', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    font-weight: 800;
    font-variation-settings: 'wght' 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1;
    font-size: clamp(18px, 3.4vw, 28px);
    margin: 0 0 12px 0;
`;


const ScrollCue = styled.div`
    position: absolute;
    left: 50%;
    bottom: clamp(16px, 3vw, 36px);
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 1;
    text-shadow: 0 0 16px rgba(255,255,255,0.45), 0 0 36px rgba(255,255,255,0.25);

    .mouse {
        width: 26px;
        height: 40px;
        border: 3px solid rgba(255,255,255,0.7);
        border-radius: 14px;
        position: relative;
        margin-bottom: 8px;
        box-shadow: 0 0 18px rgba(255,255,255,0.35), 0 0 36px rgba(255,255,255,0.2);
        filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
    }
    .wheel {
        position: absolute;
        left: 50%;
        top: 8px;
        width: 4px;
        height: 8px;
        background: rgba(255,255,255,0.7);
        border-radius: 2px;
        transform: translateX(-50%);
        animation: wheel 1.2s ease-in-out infinite;
    }
    .label { margin-top: 2px; display: inline-block; }
    .label .char {
        display: inline-block;
        transform: translateY(12px);
        opacity: 0;
        transition: transform 180ms ease, opacity 180ms ease;
        transition-delay: var(--d, 0ms);
    }
    .label.is-visible .char {
        transform: translateY(0);
        opacity: 1;
    }
    .chevron {
        width: 14px;
        height: 14px;
        border-right: 3px solid rgba(255,255,255,0.7);
        border-bottom: 3px solid rgba(255,255,255,0.7);
        transform: rotate(45deg);
        opacity: 0.9;
        animation: chevron 1.2s ease-in-out infinite;
        margin-top: 6px;
        filter: drop-shadow(0 0 10px rgba(255,255,255,0.35)) drop-shadow(0 0 20px rgba(255,255,255,0.2));
    }
    .chevron-2 { opacity: 0.6; animation-delay: 0.2s; }
    @keyframes wheel {
        0% { transform: translate(-50%, 0); opacity: 1; }
        100% { transform: translate(-50%, 8px); opacity: 0; }
    }
    @keyframes chevron {
        0% { transform: translateY(0) rotate(45deg); opacity: 0.2; }
        50% { opacity: 1; }
        100% { transform: translateY(6px) rotate(45deg); opacity: 0.2; }
    }
`;

const AboutSection = styled.section`
    position: relative;
    z-index: 3;
    max-width: 900px;
    margin: clamp(32px, 7vw, 96px) auto;
    padding: 0 clamp(16px, 4vw, 24px);
    color: #eaeaea;
    line-height: 1.5;
    font-size: clamp(14px, 1.5vw, 18px);
    p { margin: 0 0 12px; }
`;

// Scroll-reveal text component moved to components/ScrollRevealText.jsx

// No manual offset; centering uses container content box center

const CONTACT_EMAIL = 'contact@example.com';
const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/mnnjznkj';
const LINKEDIN_URL = '#';
const GITHUB_URL = '#';
const EMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=Hey!`;
const SOUNDCLOUD_EMBED = 'https://w.soundcloud.com/player/?url=https%3A%2F%2Fweb.archive.org%2Fweb%2F20250711012557%2Fhttps%3A%2F%2Fsoundcloud.com%2Fbpm-club-sono&color=%23ffffff&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true';

const Home = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showTitles, setShowTitles] = useState(false);
    const [logoSettled, setLogoSettled] = useState(false);
    // ensure the reload auto-scroll runs only once
    const didReloadAutoScrollRef = React.useRef(false);
    const rightTitleRef = React.useRef(null);
    const sliderRef = React.useRef(null);
    const sliderViewportRef = React.useRef(null);
    const jeanSlideRef = React.useRef(null);
    const [blurProgress, setBlurProgress] = useState(0);
    const [isPortrait, setIsPortrait] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(orientation: portrait)').matches : false
    );
    // Helper: center Jean Vidal card within horizontal slider viewport
    const centerJean = React.useCallback(() => {
        const container = sliderViewportRef.current;
        const target = jeanSlideRef.current;
        if (!container || !target) return;
        const targetCenter = target.offsetLeft + target.clientWidth / 2;
        const desired = targetCenter - container.clientWidth / 2;
        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        container.scrollLeft = Math.max(0, Math.min(desired, maxScroll));
    }, []);

    // Center on mount and on resize (after layout settles)
    React.useEffect(() => {
        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(centerJean);
        });
        const onResize = () => centerJean();
        window.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }, [centerJean]);

    // Also recenter when the slider section becomes visible
    React.useEffect(() => {
        if (!sliderRef.current) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                centerJean();
                io.disconnect();
            }
        }, { threshold: 0.2 });
        io.observe(sliderRef.current);
        return () => io.disconnect();
    }, [centerJean]);

    // Recenter when orientation changes
    React.useEffect(() => {
        const t = setTimeout(() => centerJean(), 250);
        return () => clearTimeout(t);
    }, [isPortrait, centerJean]);

    // Gradual blur between hero and next section
    React.useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || window.pageYOffset || 0;
            const h = window.innerHeight || 1;
            const progress = Math.min(1, Math.max(0, y / (0.6 * h)));
            setBlurProgress(progress);
        };
        const onResize = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        onScroll();
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // Track orientation changes to adapt layout (portrait vs landscape)
    React.useEffect(() => {
        const mq = window.matchMedia('(orientation: portrait)');
        const handler = (e) => setIsPortrait(e.matches);
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else mq.addListener(handler);
        setIsPortrait(mq.matches);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener('change', handler);
            else mq.removeListener(handler);
        };
    }, []);

    // Reveal after loader: show 3D, then titles after 1s
    React.useEffect(() => {
        if (!isLoaded) {
            setShowCanvas(false);
            setShowTitles(false);
            setLogoSettled(false);
            return;
        }

        let stopped = false;
        let checkRaf = 0;

        const waitForLoaderGone = () => {
            if (stopped) return;
            const overlay = document.querySelector('.loading-overlay');
            if (!overlay) {
                setShowCanvas(true);
                const t = setTimeout(() => {
                    if (!stopped && logoSettled) setShowTitles(true);
                }, 1000);
                return () => clearTimeout(t);
            }
            checkRaf = requestAnimationFrame(waitForLoaderGone);
        };

        checkRaf = requestAnimationFrame(waitForLoaderGone);
        return () => {
            stopped = true;
            if (checkRaf) cancelAnimationFrame(checkRaf);
        };
    }, [isLoaded, logoSettled]);

    // On reload: auto-scroll then briefly freeze scroll
    React.useEffect(() => {
        // Run only after intro (titles visible) so page is scrollable
        if (!showTitles) return;
        if (didReloadAutoScrollRef.current) return;
        const nav = (typeof performance !== 'undefined' && performance.getEntriesByType)
            ? performance.getEntriesByType('navigation')[0]
            : undefined;
        const isReload = (nav && nav.type === 'reload') || (performance && performance.navigation && performance.navigation.type === 1);
        if (!isReload) return;

        didReloadAutoScrollRef.current = true;

        const AUTO_SCROLL_DURATION_MS = 1200; // how long the smooth scroll lasts
        const FREEZE_DURATION_MS = 1800; // how long to freeze after scrolling (set 0 for indefinite)

        const startY = window.scrollY || 0;
        const maxY = Math.max(0, (document.documentElement?.scrollHeight || document.body.scrollHeight) - window.innerHeight);
        // "scroll too much": jump many viewports down but cap at bottom
        const targetY = Math.min(maxY, startY + window.innerHeight * 6);
        try {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        } catch (_) {
            window.scrollTo(0, targetY);
        }

        // After auto-scroll completes, freeze the scroll for a short time
        const prevOverflow = document.body.style.overflow;
        const freezeTimeout = window.setTimeout(() => {
            document.body.style.overflow = 'hidden';
            if (FREEZE_DURATION_MS > 0) {
                window.setTimeout(() => {
                    document.body.style.overflow = prevOverflow || '';
                }, FREEZE_DURATION_MS);
            }
        }, AUTO_SCROLL_DURATION_MS);

        return () => {
            window.clearTimeout(freezeTimeout);
        };
    }, [showTitles]);

    // Prevent page scroll until titles are shown
    React.useEffect(() => {
        const body = document.body;
        if (!showTitles) {
            const prev = body.style.overflow;
            body.style.overflow = 'hidden';
            return () => {
                body.style.overflow = prev || '';
            };
        }
        // ensure scroll is enabled once intro is done
        body.style.overflow = '';
        return undefined;
    }, [showTitles]);

    // Subtle mouse-follow for the "27." label
    React.useEffect(() => {
        const el = rightTitleRef.current;
        if (!el) return;
        const label = el.querySelector('.big');
        if (!label) return;
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            const rx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) || 0;
            const ry = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) || 0;
            gsap.to(label, { x: rx * 6, y: ry * 6, duration: 0.2, ease: 'power2.out' });
        };
        const onLeave = () => {
            gsap.to(label, { x: 0, y: 0, duration: 0.25, ease: 'power2.out' });
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, []);
    // Build team items once
    const teamItems = [
        { title: 'Président', name: 'Jean Vidal' },
        { title: 'Secrétaire', name: 'Luca Fuster' },
        { title: 'VP Trésorier', name: 'John Doe' },
        { title: 'VP Light', name: 'Hector Nussbaumer' },
        { title: 'VP Son', name: 'Mathieu Bonnet' },
        { title: 'Respo Light', name: 'Samy Baiak' },
        { title: 'Pôle Light', name: 'Loucas Bremond' },
        { title: 'Respo Son', name: 'Jacques Angleys' },
        { title: 'Pôle Son', name: 'Paolo Janvier' },
        { title: 'Pôle Son', name: 'Gustave Beauvallet' },
        { title: 'Mapping', name: 'Lucas Dreano' },
        { title: 'Réparation', name: 'William Fournier' },
        { title: 'Log/Inventaire', name: 'Douae Zainoun' },
        { title: 'Prod', name: 'Lucas Broussely' },
        { title: 'RE', name: 'Ines Tagliaferri' },
        { title: 'RE', name: 'Martin Briançon' },
        { title: 'RI', name: 'Zeineb Benjemaa' },
        { title: 'VDP', name: 'Maëlle Leymerigie' },
        { title: 'Conan', name: 'Arnaud Cottermans' },
        { title: 'Conan', name: 'Charlotte Vlieghe' },
        { title: 'Communication', name: 'Slavik Zhyhota-Locquin' },
    ];
    // Order: pole son → respo son → vp son → secretaire → prez → vp treso → vp light → respo light → pole light
    const normalize = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
    const rankMap = new Map([
        ['poleson', 0],
        ['resposon', 1],
        ['vpson', 2],
        ['secretaire', 3],
        ['president', 4],
        ['vptreso', 5],
        ['vplight', 6],
        ['respolight', 7],
        ['polelight', 8],
    ]);
    const rank = (title) => {
        const key = normalize(title || '');
        for (const [k, v] of rankMap) {
            if (key.includes(k)) return v;
        }
        return 99;
    };
    const orderedItems = teamItems.slice().sort((a, b) => rank(a.title) - rank(b.title));
    const jeanIdx = orderedItems.findIndex(p => p.name === 'Jean Vidal');
    const mid = jeanIdx >= 0 ? jeanIdx : Math.floor((orderedItems.length - 1) / 2);

    // Preload central avatar image early for instant display
    React.useEffect(() => {
        const img = new Image();
        try { img.loading = 'eager'; } catch {}
        try { img.decoding = 'async'; } catch {}
        try { img.fetchPriority = 'high'; } catch {}
        img.src = VIDAL;
        // Attempt to decode proactively
        if (img.decode) { img.decode().catch(() => {}); }
    }, []);

    return (
        <HomeLayout>
            <Hero>
                <HeroInner $progress={blurProgress}>
                    {/* 3D Hero Section */}
                    <CanvasWrap $visible={showCanvas}>
                        <Canvas
                            camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.2, 4.5] }}
                        >
                            <App3D setIsLoaded={setIsLoaded} onLogoSettled={() => setLogoSettled(true)} />
                        </Canvas>
                    </CanvasWrap>
                    {/* Electric border around the central logo */}
                    {!isPortrait && (
                        <ElectricBorder
                            color="#FFFFFF"
                            speed={1.4}
                            chaos={0.5}
                            thickness={2}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 'min(34.65vw, 416px)',
                                height: 'min(34.65vw, 416px)',
                                borderRadius: '50%',
                                zIndex: 2
                            }}
                        />
                    )}
                    <LeftTitle $visible={showTitles}>
                        <span className="big">Club</span>
                        <span className="sub">light / sono</span>
                    </LeftTitle>
                    {!isPortrait && (
                        <>
                          <RightTitle
                            $visible={showTitles}
                            ref={rightTitleRef}
                            onClick={() => {
                                sliderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setTimeout(() => centerJean(), 700);
                            }}
                          >
                            <span className="big">27.</span>
                          </RightTitle>
                          <LaserFlow fromRef={rightTitleRef} color="#FFFFFF" flowSpeed={0.06} style={{ zIndex: 4 }} />
                        </>
                    )}
                    <LightRays
                        className="custom-rays"
                        raysOrigin="top-center"
                        raysColor="#ffffff"
                        saturation={0}
                        raysSpeed={0.3}
                        lightSpread={0.8}
                        rayLength={1.2}
                        followMouse={true}
                        mouseInfluence={0.06}
                        noiseAmount={0.06}
                        distortion={0.03}
                    />
                    {/* Scroll cue removed */}
                </HeroInner>
            </Hero>
            <Content>
                {/* Galaxy background removed per request */}
                <AboutSection>
                    <p><strong><ScrollRevealText text={"Une équipe de 26 personnes."} step={6} /></strong></p>
                    <p>
                        <ScrollRevealText
                            text={"BPM Club Sono est le club son et lumières du campus des écoles d’ingénieurs Télécom SudParis (TSP) et d’ingénieurs-managers Institut Mines-Télécom Business School (IMT-BS), situé à Évry-Courcouronnes. Nous installons notre matériel et animons des soirées tout au long de l’année, lors de prestations pour des associations et clubs du campus."}
                            delayStart={150}
                            step={6}
                        />
                    </p>
                    <p>
                        <ScrollRevealText
                            text={"Nous réalisons aussi de nombreuses prestations extérieures au campus, que ce soit pour d’autres écoles ou des particuliers, dans lesquelles nous mettons à disposition nos compétences et notre matériel. Contact."}
                            delayStart={300}
                            step={6}
                        />
                    </p>
                </AboutSection>
                <MagicBento 
                    textAutoHide={true}
                    enableStars={false}
                    enableSpotlight={false}
                    enableBorderGlow={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect={false}
                    spotlightRadius={300}
                    particleCount={12}
                    glowColor="255, 255, 255"
                    showOnlyLarge={isPortrait}
                />

                {/* Outils / Logiciels */}
                <LoopSection>
                    <LoopTitle><ScrollRevealText text={"Outils / Logiciels"} step={10} /></LoopTitle>
                    <LogoLoop
                        speed={42}
                        items={[
                            {
                                image: grandMA2Logo,
                                alt: 'grandMA2 onPC',
                                primary: 'grandMA2 onPC',
                                caption: "Contrôle des lumières à grande échelle depuis une console MA Lighting",
                            },
                            {
                                image: laNetLogo,
                                alt: 'LA Network Manager',
                                primary: 'LA Network Manager',
                                caption: 'Paramétrage et configuration du matériel L-Acoustics',
                            },
                            {
                                image: qlcLogo,
                                alt: 'QLC+',
                                primary: 'QLC+',
                                caption: 'Contrôle des lumières depuis un ordinateur',
                            },
                            {
                                image: sketchupLogo,
                                alt: 'SketchUp',
                                primary: 'SketchUp',
                                caption: 'Modélisation en 3D de la structure',
                            },
                        ]}
                    />
                </LoopSection>

                {/* Ils nous ont fait confiance */}
                <LoopSection>
                    <LoopTitle><ScrollRevealText text={"Ils nous ont fait confiance"} step={8} /></LoopTitle>
                    <LogoLoop
                        simple
                        speed={38}
                        items={[
                            { image: tspLogo, alt: 'Télécom SudParis' },
                            { image: imtbsLogo, alt: 'IMT-BS' },
                            { image: technoParadAlt, alt: 'technoparad' },
                            { image: parisLogo, alt: 'Paris' },
                            { image: navaLogo, alt: 'Nava' },
                            { image: tedxLogo, alt: 'tedx' },
                        ]}
                    />
                </LoopSection>

    {/* Slider horizontal d'équipe (cadres de profil) */}
    <SliderSection ref={sliderRef}>
        <SliderHeader>
            <SliderTitle><ScrollRevealText text={"Notre équipe de 26 personnes"} step={10} /></SliderTitle>
            <SwipeHint aria-hidden="true">
                <span className="chev left" />
                <span>Glissez</span>
                <span className="chev right" />
            </SwipeHint>
        </SliderHeader>
        <SliderViewport ref={sliderViewportRef}>
            <SliderTrack>
                {orderedItems.map((p, idx) => {
                    const dist = Math.abs(idx - mid);
                    const offset = Math.min(48, dist * 12); // pyramid vertical offsets
                    const isCenter = p.name === 'Jean Vidal';
                    return (
                    <Slide
                        key={`${p.title}-${p.name}-${idx}`}
                        style={{ '--offset': `${offset}px` }}
                        ref={p.name === 'Jean Vidal' ? jeanSlideRef : null}
                    >
                        <ProfileCard
                            className={isPortrait ? 'is-compact' : 'is-featured'}
                            name={p.name}
                            title={p.title}
                            handle={(p.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 24)}
                            avatarUrl={VIDAL}
                            miniAvatarUrl={VIDAL}
                            showUserInfo={true}
                            enableTilt={true}
                            enableMobileTilt={false}
                            // Hint the browser to fetch/decode the main image sooner
                            imgLoading={isCenter ? 'eager' : 'lazy'}
                            imgFetchPriority={isCenter ? 'high' : 'auto'}
                            imgDecoding={'async'}
                            imgWidth={960}
                            imgHeight={957}
                        />
                    </Slide>
                )})}
            </SliderTrack>
        </SliderViewport>
    </SliderSection>
            </Content>

            {/* Contact */}
            <ContactSection>
                <ContactSubtitle><ScrollRevealText text={"Let's talk"} step={12} /></ContactSubtitle>
                <ContactTitle><ScrollRevealText text={"Contact"} step={12} /></ContactTitle>
                <ContactCard>
                    <ContactGrid>
                        <InfoBlock>
                            <p>Have a question or a project in mind? Feel free to reach out.</p>
                            <div className="row">
                                <span>Location:</span>
                                <span className="value">Evry-Courcouronnes, France</span>
                            </div>
                        </InfoBlock>
                        <div>
                            <ContactForm onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const data = {
                                    from_name: form.querySelector('input[name="from_name"]').value || '',
                                    reply_to: form.querySelector('input[name="reply_to"]').value || '',
                                    message: form.querySelector('textarea[name="message"]').value || ''
                                };
                                try {
                                    const res = await fetch(CONTACT_FORM_ENDPOINT, {
                                        method: 'POST',
                                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                        body: JSON.stringify(data)
                                    });
                                    if (res.ok) {
                                        form.reset();
                                        const msgEl = form.parentElement.querySelector('#form-message');
                                        if (msgEl) msgEl.classList.remove('hidden');
                                    } else {
                                        window.location.href = `mailto:${CONTACT_EMAIL}`;
                                    }
                                } catch (_) {
                                    window.location.href = `mailto:${CONTACT_EMAIL}`;
                                }
                            }}>
                                <input type="text" name="from_name" placeholder="Name" required />
                                <input type="email" name="reply_to" placeholder="Email" required />
                                <textarea name="message" placeholder="Message" rows="6" required />
                                <button type="submit">Submit</button>
                            </ContactForm>
                            <div id="form-message" style={{ display: 'none', justifyContent: 'center', alignItems: 'center', marginTop: 16, color: 'var(--white)', fontSize: 18 }}>
                                ✅ Thank you for your message!
                            </div>
                        </div>
                    </ContactGrid>
                </ContactCard>
            </ContactSection>

            {/* Footer */}
            <Footer>
              <FooterInner>
                <FooterGrid>
                  <SocialColumn>
                    <SocialRow>
                      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M12.001 2C6.476 2 2.001 6.475 2.001 12c0 4.425 2.862 8.162 6.837 9.487.5.088.687-.212.687-.475 0-.237-.013-1.025-.013-1.862-2.513.463-3.163-.612-3.363-1.175-.112-.287-.6-1.175-1.025-1.412-.35-.187-.85-.65-.012-.662.788-.013 1.35.725 1.537 1.025.9 1.512 2.338 1.087 2.913.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.388-1.988 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .838-.262 2.75 1.025.8-.225 1.65-.338 2.5-.338.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.025 2.75-1.025.55 1.375.2 2.4.1 2.65.637.7 1.025 1.6 1.025 2.688 0 3.838-2.338 4.7-4.563 4.95.363.313.675.975.675 1.912 0 1.338-.013 2.412-.013 2.75 0 .263.188.563.688.475C19.139 20.162 22 16.425 22.001 12 22.001 6.475 17.526 2 12.001 2Z"/></svg>
                      </a>
                      <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M18.3362 18.339H15.6707V14.1622C15.6707 13.1662 15.6505 11.8845 14.2817 11.8845C12.892 11.8845 12.6797 12.9683 12.6797 14.0887V18.339H10.0142V9.75H12.5747V10.9207H12.6092C12.967 10.2457 13.837 9.53325 15.1367 9.53325C17.8375 9.53325 18.337 11.3108 18.337 13.6245V18.339H18.3362ZM7.00373 8.57475C6.14573 8.57475 5.45648 7.88025 5.45648 7.026C5.45648 6.1725 6.14648 5.47875 7.00373 5.47875C7.85873 5.47875 8.55173 6.1725 8.55173 7.026C8.55173 7.88025 7.85798 8.57475 7.00373 8.57475ZM8.34023 18.339H5.66723V9.75H8.34023V18.339ZM19.6697 3H4.32923C3.59498 3 3.00098 3.5805 3.00098 4.29675V19.7033C3.00098 20.4202 3.59498 21 4.32923 21H19.6675C20.401 21 21.001 20.4202 21.001 19.7033V4.29675C21.001 3.5805 20.401 3 19.6675 3H19.6697Z"/></svg>
                      </a>
                      <a href={EMAIL_COMPOSE_URL} target="_blank" rel="noopener noreferrer" aria-label="Email">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="34" height="34"><path d="m18.73 5.41-1.28 1L12 10.46 6.55 6.37l-1.28-1A2 2 0 0 0 2 7.05v11.59A1.36 1.36 0 0 0 3.36 20h3.19v-7.72L12 16.37l5.45-4.09V20h3.19A1.36 1.36 0 0 0 22 18.64V7.05a2 2 0 0 0-3.27-1.64"/></svg>
                      </a>
                    </SocialRow>
                    <LikeButton />
                  </SocialColumn>
                  <BuiltColumn>
                    <BuiltRow><span>Built with</span> <span className="value">React</span></BuiltRow>
                    <BuiltRow><span>Styled with</span> <span className="value">React Bits</span></BuiltRow>
                    <BuiltRow><span>Bundled with</span> <span className="value">Parcel</span></BuiltRow>
                  </BuiltColumn>
                  <PlayerColumn>
                    <iframe className="player" title="SoundCloud Player" src={SOUNDCLOUD_EMBED} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
                  </PlayerColumn>
                </FooterGrid>
                <FooterBottom>
                  <p className="text-center">Copyright © {new Date().getFullYear()} BPM Club Sono. All rights reserved.</p>
                </FooterBottom>
              </FooterInner>
            </Footer>
        </HomeLayout>
    );
};

export default Home;
