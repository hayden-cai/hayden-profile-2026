import { useEffect, useRef } from 'react';

const RING_DEFAULT_COLOR = 'rgba(124,92,255,0.55)';
const RING_HOVER_COLOR = 'rgba(76,201,240,0.7)';
const RING_HOVER_SCALE = 1.8;
const RING_DEFAULT_SCALE = 1;
const LERP_FACTOR = 0.16;

export const useCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringScaleRef = useRef(RING_DEFAULT_SCALE);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let mx = rx;
    let my = ry;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    };

    const loop = () => {
      rx += (mx - rx) * LERP_FACTOR;
      ry += (my - ry) * LERP_FACTOR;
      ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px) scale(${ringScaleRef.current})`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(loop);

    // Add hover effects to interactive elements
    const interactiveEls = document.querySelectorAll<Element>('a, button, [data-hover]');

    const onEnter = () => {
      ringScaleRef.current = RING_HOVER_SCALE;
      ring.style.borderColor = RING_HOVER_COLOR;
    };
    const onLeave = () => {
      ringScaleRef.current = RING_DEFAULT_SCALE;
      ring.style.borderColor = RING_DEFAULT_COLOR;
    };

    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return { dotRef, ringRef };
};
