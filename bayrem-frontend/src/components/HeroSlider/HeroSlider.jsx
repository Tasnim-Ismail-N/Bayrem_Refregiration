// src/components/HeroSlider/HeroSlider.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HeroSlider.module.css';

export default function HeroSlider({ slides = [] }) {
  const [actif, setActif] = useState(0);
  const [pause, setPause] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  if (!slides.length) return null;

  // Autoplay 5s, pause au hover
  useEffect(() => {
    const startAutoplay = () => {
      timerRef.current = setInterval(() => {
        setActif(prev => (prev + 1) % slides.length);
      }, 5000);
    };

    if (!pause) {
      startAutoplay();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pause, slides.length]);

  const precedent = () => {
    setActif(prev => (prev - 1 + slides.length) % slides.length);
  };

  const suivant = () => {
    setActif(prev => (prev + 1) % slides.length);
  };

  const handleCTA = (slide) => {
    if (slide.lienUrl) {
      navigate(slide.lienUrl);
    } else if (slide.lienProduitId) {
      navigate(`/produits/${slide.lienProduitId}`);
    }
  };

  const slide = slides[actif];

  return (
    <div
      className={styles.heroSlider}
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      {/* Images animées avec zoom */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`${styles.slideItem} ${i === actif ? styles.activeSlide : ''}`}
        >
          <img
            src={s.imageUrl}
            alt={s.titre || `Slide ${i + 1}`}
            className={styles.image}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Overlay gradient bleu froid */}
      <div className={styles.overlay}></div>

      {/* Contenu texte avec animation */}
      <div className={styles.content}>
        <div className={styles.textWrapper} key={`text-${actif}`}>
          {slide.titre && <h1 className={styles.titre}>{slide.titre}</h1>}
          {slide.sousTitre && <p className={styles.sousTitre}>{slide.sousTitre}</p>}
          {(slide.lienUrl || slide.lienProduitId) && (
            <button
              className={styles.btnCTA}
              onClick={() => handleCTA(slide)}
            >
              Voir le catalogue
            </button>
          )}
        </div>
      </div>

      {/* Flèches prev/next */}
      {slides.length > 1 && (
        <>
          <button
            className={`${styles.fleche} ${styles.flecheGauche}`}
            onClick={precedent}
            aria-label="Précédent"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className={`${styles.fleche} ${styles.flecheDroite}`}
            onClick={suivant}
            aria-label="Suivant"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicateurs traits animés */}
      {slides.length > 1 && (
        <div className={styles.indicators}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === actif ? styles.indicatorActive : ''}`}
              onClick={() => setActif(i)}
              aria-label={`Aller au slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
