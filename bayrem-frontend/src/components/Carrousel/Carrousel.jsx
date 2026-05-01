// src/components/Carrousel/Carrousel.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Carrousel.module.css';

export default function Carrousel({ slides = [] }) {
  const [actif, setActif] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActif(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const precedent = () => setActif(prev => (prev - 1 + slides.length) % slides.length);
  const suivant = () => setActif(prev => (prev + 1) % slides.length);

  const slide = slides[actif];

  return (
    <div className={styles.carrousel}>
      <img
        src={slide.imageUrl}
        alt={slide.titre || 'Slide'}
        className={styles.image}
      />

      <div className={styles.overlay}>
        {slide.titre && <h2 className={styles.titre}>{slide.titre}</h2>}
        {slide.sousTitre && <p className={styles.sousTitre}>{slide.sousTitre}</p>}
        {slide.lienProduitId && (
          <button
            className={styles.btnVoir}
            onClick={() => navigate(`/produits/${slide.lienProduitId}`)}
          >
            Voir le produit
          </button>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button className={`${styles.fleche} ${styles.gauche}`} onClick={precedent}>&#8249;</button>
          <button className={`${styles.fleche} ${styles.droite}`} onClick={suivant}>&#8250;</button>
          <div className={styles.points}>
            {slides.map((_, i) => (
              <span
                key={i}
                className={`${styles.point} ${i === actif ? styles.actif : ''}`}
                onClick={() => setActif(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
