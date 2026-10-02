'use client';

import { useEffect, useState } from 'react';
import { useCursor } from '../lib/hooks/useCursor'

const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_POINTER_QUERY);
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return enabled ? <CursorElements /> : null;
};

const CursorElements = () => {
  const { dotRef, ringRef } = useCursor();

  return (
    <>
      <div
        ref={dotRef}
        id="cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#7c5cff',
          zIndex: 100,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        id="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: '1px solid rgba(124, 92, 255, 0.55)',
          zIndex: 100,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </>
  );
};
