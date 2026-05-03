// src/components/HistoireMarque/HistoireMarque.jsx
// Section "Split Screen Immersive Story" — Image left avec parallax, texte right avec animations

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './HistoireMarque.module.css';

export default function HistoireMarque() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  /* ─── Count-up animation pour les nombres ─── */
  const countUpAnimation = useCallback((element, target) => {
    let current = 0;
    const duration = 1500; // ms
    const increment = target / (duration / 16); // 16ms per frame

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }, []);

  /* ─── Scroll animation — IntersectionObserver pour déclencher animations ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Animation des éléments
          if (imageRef.current) imageRef.current.classList.add(styles.slideIn);
          if (textRef.current) textRef.current.classList.add(styles.fadeInText);

          // Count-up animation pour les stats
          if (statsRef.current) {
            const statNumbers = statsRef.current.querySelectorAll('[data-target]');
            statNumbers.forEach((el) => {
              const target = parseInt(el.getAttribute('data-target'), 10);
              countUpAnimation(el, target);
            });
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, countUpAnimation]);

  /* ─── Parallax effect au scroll ─── */
  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.5; // parallax multiplier
      imageRef.current.style.backgroundPosition = `center ${offset * 0.5}px`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        {/* ── Colonne gauche : Image avec parallax ── */}
        <div className={styles.colonneImage} ref={imageRef}>
          <img
            src="https://picsum.photos/500/600?random=story"
            alt="Notre histoire Bayrem"
            className={styles.image}
          />
          {/* Tint overlay color */}
          <div className={styles.tintOverlay} />
        </div>

        {/* ── Colonne droite : Texte avec animations staggered ── */}
        <div className={styles.colonneTexte} ref={textRef}>
          {/* Label ALL-CAPS */}
          <span className={styles.labelCategory}>Notre Histoire</span>

          {/* Titre avec mixed weights */}
          <div className={styles.titreWrapper}>
            <h2 className={styles.titreLigne1}>Tout savoir</h2>
            <h2 className={styles.titreLigne2}>sur notre histoire</h2>
          </div>

          {/* Séparateur horizontal */}
          <div className={styles.separator} />

          {/* Premier paragraphe */}
          <p className={styles.paragraphe}>
            Depuis plus de 10 ans, Bayrem Réfrigération s'est imposée comme un leader incontournable
            dans la fourniture d'équipements réfrigérés professionnels. Nos débuts modestes ont
            rapidement évolué en une entreprise réputée, grâce à notre engagement inébranlable
            envers la qualité, l'innovation et le service client.
          </p>

          {/* Deuxième paragraphe */}
          <p className={styles.paragraphe}>
            Notre vision est de transformer l'industrie de la réfrigération professionnelle en
            offrant des solutions éco-responsables et performantes. Nous croyons fermement que
            chaque entreprise, du petit commerce à la grande surface, mérite des équipements
            fiables, durables et énergétiquement efficaces. C'est cette philosophie qui guide
            chacune de nos décisions et nos actions quotidiennes.
          </p>

          {/* CTA button */}
          <button className={styles.btnDecouvrirPlus}>
            En savoir plus
          </button>

          {/* ── Stats row ── */}
          <div className={styles.statsRow} ref={statsRef}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>
                <span data-target="10">0</span>
                <span className={styles.plus}>+</span>
              </div>
              <p className={styles.statLabel}>Ans d'expérience</p>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.stat}>
              <div className={styles.statNumber}>
                <span data-target="500">0</span>
                <span className={styles.plus}>+</span>
              </div>
              <p className={styles.statLabel}>Clients satisfaits</p>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.stat}>
              <div className={styles.statNumber}>
                <span data-target="50">0</span>
                <span className={styles.plus}>+</span>
              </div>
              <p className={styles.statLabel}>Produits proposés</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
