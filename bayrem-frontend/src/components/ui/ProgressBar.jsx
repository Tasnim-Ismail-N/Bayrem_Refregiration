import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ProgressBar.module.css';

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  // Only show progress bar on product detail pages
  const isProductPage = /^\/produits\/\d+$/.test(location.pathname);

  useEffect(() => {
    if (!isProductPage) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;

      if (documentHeight > 0) {
        const progressPercent = (scrolled / documentHeight) * 100;
        setProgress(Math.min(progressPercent, 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isProductPage]);

  if (!isProductPage) return null;

  return (
    <div
      className={styles.progressBar}
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
