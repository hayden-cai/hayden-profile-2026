'use client';

import { useStarsBackground } from '../lib/hooks/useStarsBackground';

export const StarsBackground = () => {
  const canvasRef = useStarsBackground();

  return (
    <canvas
      ref={canvasRef}
      id="stars-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};
