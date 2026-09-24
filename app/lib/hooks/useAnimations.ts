import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const splitWords = (el: Element) => {
  if ((el as any).dataset.split) return el.querySelectorAll('span > span');
  (el as any).dataset.split = '1';
  const text = el.textContent || '';
  el.textContent = '';
  const words = text.split(' ');

  words.forEach((w, i) => {
    const mask = document.createElement('span');
    mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
    const inner = document.createElement('span');
    inner.style.cssText = 'display:inline-block;will-change:transform;';
    inner.textContent = w;
    mask.appendChild(inner);
    el.appendChild(mask);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });

  return el.querySelectorAll('span > span');
};

export const useAnimations = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation — CSS sets opacity:0, GSAP animates from hidden to visible
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo('.hero-line',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12 }
        )
        .fromTo('[data-hero-fade]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15 },
          '-=0.5'
        );

      // Reveal words on scroll
      document.querySelectorAll('[data-reveal-words]').forEach((el) => {
        if ((el as any).dataset.split || el.closest('#hero')) return;
        const inners = splitWords(el);
        gsap.from(inners, {
          yPercent: 115,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.035,
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'restart none none reverse',
          },
        });
      });

      // Fade up
      gsap.utils.toArray('[data-fade-up]').forEach((el: any) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'restart none none reverse',
          },
        });
      });

      // Stagger
      gsap.utils.toArray('[data-stagger]').forEach((group: any) => {
        const items = group.querySelectorAll('[data-stagger-item]');
        gsap.from(items, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.05,
          immediateRender: false,
          scrollTrigger: {
            trigger: group,
            start: 'top 92%',
            toggleActions: 'restart none none reverse',
          },
        });
      });
    });

    const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      ctx.revert(); // reverts all GSAP inline styles + kills all ScrollTriggers in context
      clearTimeout(refreshTimeout);
    };
  }, []);
};
