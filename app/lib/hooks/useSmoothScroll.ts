import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    const bar = document.getElementById('scroll-bar');
    lenis.on('scroll', () => {
      ScrollTrigger.update();
      const max = Math.max(1, lenis.limit || 1);
      const progress = Math.min(1, Math.max(0, lenis.scroll / max));
      if (bar) bar.style.transform = `scaleX(${progress})`;
    });

    // Store reference so we can remove the exact same function
    const rafFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    // Nav anchor clicks
    document.querySelectorAll('[data-nav]').forEach((a) => {
      a.addEventListener('click', (ev) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector<HTMLElement>(href);
          if (target) {
            ev.preventDefault();
            lenis.scrollTo(target, { offset: 0 });
          }
        }
      });
    });

    return () => {
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, []);
};
