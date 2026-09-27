import { useEffect, useState } from 'react';

export const useLoadingProgress = () => {
  const [percent, setPercent] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      if (p < 30) p += Math.random() * 10 + 2;
      else if (p < 70) p += Math.random() * 6 + 1;
      else p += Math.random() * 4 + 0.5;

      if (p >= 100) {
        p = 100;
        setPercent(Math.floor(p));
        clearInterval(interval);
        setTimeout(() => {
          setShowOverlay(false);
        }, 1800);
      } else {
        setPercent(Math.floor(p));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return { percent, showOverlay };
};
