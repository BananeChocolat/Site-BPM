import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 16px;
  border-radius: 9999px;
  border: 2px solid var(--white-icon, rgba(255,255,255,0.6));
  color: var(--white, #fff);
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  &:hover { transform: translateY(-1px); border-color: var(--white, #fff); }
`;

const Count = styled.span`
  font-size: 14px;
`;

const LikeButton = ({ initialCount = 0, storageKey = 'bpm_like_count_v2' }) => {
  const [count, setCount] = React.useState(() => {
    try {
      const v = localStorage.getItem(storageKey);
      const n = v ? parseInt(v, 10) : NaN;
      return Number.isFinite(n) ? n : initialCount;
    } catch {
      return initialCount;
    }
  });

  const onClick = () => {
    const next = count + 1;
    setCount(next);
    try { localStorage.setItem(storageKey, String(next)); } catch {}
  };

  return (
    <Btn type="button" onClick={onClick} aria-label="Like">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9 2 5.5 4.5 3 7.5 3 9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"/>
      </svg>
      <Count>{count} Likes</Count>
    </Btn>
  );
};

export default LikeButton;
