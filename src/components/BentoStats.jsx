import React from "react";
import styled from "styled-components";

const Section = styled.section`
    position: relative;
    z-index: 3;
    width: 100%;
    padding: clamp(24px, 6vw, 72px) clamp(16px, 5vw, 64px);
    max-width: 1200px;
    margin: 0 auto; /* center the section */
`;

const Heading = styled.h2`
    margin: 0 0 24px;
    color: #fff;
    font-family: 'Compressa VF', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    font-weight: 800;
    font-variation-settings: 'wght' 800;
    text-transform: uppercase;
    font-size: clamp(20px, 3.5vw, 36px);
    letter-spacing: 0.02em;
    text-align: center;
`;

const Sub = styled.p`
    margin: 0 0 28px;
    color: #b9b9b9;
    font-size: clamp(12px, 1.6vw, 16px);
    text-align: center;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: clamp(10px, 2vw, 20px);
    align-items: stretch;

    @media (max-width: 1100px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    @media (max-width: 700px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

const Card = styled.div`
    position: relative;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    padding: clamp(16px, 2.4vw, 24px);
    backdrop-filter: blur(4px);
    transform: translateZ(0);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    text-align: center; /* center text within cards */

    &:before {
        content: "";
        position: absolute;
        inset: -30% -50% auto -50%;
        height: 70%;
        background: conic-gradient(from 0deg,
            rgba(255,255,255,0.0),
            rgba(255,255,255,0.35),
            rgba(255,255,255,0.0) 60%);
        filter: blur(26px);
        transform: rotate(8deg);
        pointer-events: none;
    }

    &:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.14);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
`;

const Span2 = styled(Card)`
    grid-column: span 2;
`;
const Span3 = styled(Card)`
    grid-column: span 3;
`;
const Span4 = styled(Card)`
    grid-column: span 4;
`;

const StatValue = styled.div`
    color: #fff;
    font-family: 'Compressa VF', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
    font-weight: 900;
    font-variation-settings: 'wght' 900;
    text-transform: uppercase;
    font-size: clamp(28px, 6vw, 64px);
    line-height: 0.95;
`;

const StatLabel = styled.div`
    margin-top: 6px;
    color: #cfcfcf;
    font-size: clamp(11px, 1.6vw, 14px);
    letter-spacing: 0.04em;
`;

const StatRow = ({ value, label }) => (
    <div>
        <StatValue>{value}</StatValue>
        <StatLabel>{label}</StatLabel>
    </div>
);

const BentoStats = () => {
    return (
        <Section>
            <Heading>Quelques chiffres</Heading>
            <Sub>Statistiques clés de BPM pour vos événements.</Sub>
            <Grid>
                <Span3>
                    <StatRow value={"10+"} label={"Années d’expertise"} />
                </Span3>
                <Span3>
                    <StatRow value={"200+"} label={"Événements réalisés"} />
                </Span3>
                <Span2>
                    <StatRow value={"4.9/5"} label={"Satisfaction clients"} />
                </Span2>
                <Span2>
                    <StatRow value={"> 30 kW"} label={"Puissance sonore déployable"} />
                </Span2>
                <Span2>
                    <StatRow value={"500+"} label={"Projecteurs & effets lumineux"} />
                </Span2>
                <Span4>
                    <StatRow value={"< 1 h"} label={"Temps moyen de réponse"} />
                </Span4>
            </Grid>
        </Section>
    );
};

export default BentoStats;
