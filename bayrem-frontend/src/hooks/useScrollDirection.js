import { useState, useEffect } from 'react';

/**
 * Hook pour détecter la direction du scroll (haut/bas)
 * Retourne { scrollDir: 'up' | 'down', scrollY: number }
 * Threshold: 10px pour éviter les micro-scrolls
 */
export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState('up');
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (currentScrollY > lastScrollY) {
        setScrollDir('down');
      } else {
        setScrollDir('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return { scrollDir, scrollY };
}
