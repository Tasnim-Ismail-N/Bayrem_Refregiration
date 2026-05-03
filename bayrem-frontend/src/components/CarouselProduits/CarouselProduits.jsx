// src/components/CarouselProduits/CarouselProduits.jsx
// Carrousel 3D perspective infini avec hauteurs alternées et effets parallaxe
import { useRef, useEffect, useCallback, useState } from 'react';
import { produitsMock } from '../../mocks/produits.mock';
import styles from './CarouselProduits.module.css';

/* ─── données : liste originale + copie pour boucle sans saut ─── */
const PRODUITS = produitsMock.map((p, i) => ({
  ...p,
  imageUrl: `https://picsum.photos/300/${i % 2 === 0 ? '380' : '300'}?random=${p.id}`, // alternating heights avec vrais images
}));
const N = PRODUITS.length;                     // 12 produits
const TOUTES_CARTES = [...PRODUITS, ...PRODUITS]; // duplication pour continuité visuelle

/* ─── vitesse de défilement et nombre de points ─── */
const VITESSE_PX_S = 85;  // pixels/seconde → boucle complète ≈ 25 s
const NB_POINTS = 6;       // indicateurs de position

export default function CarouselProduits() {
  /* ─── références DOM et animation ─── */
  const pisteRef       = useRef(null);  // élément flex contenant toutes les cartes
  const xRef           = useRef(0);     // position X courante (valeur négative = décalage gauche)
  const dernierTSRef   = useRef(null);  // timestamp du dernier frame rAF
  const pauseRef       = useRef(false); // true quand le défilement est suspendu
  const demiLargeurRef = useRef(0);     // largeur d'un jeu complet de N cartes + gaps
  const rafIdRef       = useRef(null);  // identifiant de la boucle requestAnimationFrame
  const cartesRef      = useRef([]);    // références aux cartes pour 3D tilt

  /* ─── point indicateur actif ─── */
  const [pointActif, setPointActif] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // index de la carte active au centre

  /* ─── Gestion du tilt 3D au mouvement de souris ─── */
  const handleMouseMove = (e, cardElement) => {
    if (!cardElement) return;
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8; // max ±8deg
    const rotateX = ((centerY - y) / centerY) * 8;
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = (cardElement) => {
    if (cardElement) {
      cardElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
  };

  /* ─── mesure la demi-largeur réelle depuis le DOM (gère le responsive) ─── */
  const calculerDemiLargeur = useCallback(() => {
    const piste = pisteRef.current;
    if (!piste || piste.children.length < 2) return;

    const c0 = piste.children[0];
    const c1 = piste.children[1];
    const largeurCarte = c0.getBoundingClientRect().width;

    // sécurité : la piste n'est pas encore rendue
    if (largeurCarte === 0) return;

    const gap = c1.getBoundingClientRect().left - c0.getBoundingClientRect().right;
    // largeur d'un jeu de N cartes = N × (largeur + gap)
    demiLargeurRef.current = N * (largeurCarte + gap);
  }, []);

  /* ─── boucle d'animation via requestAnimationFrame ─── */
  useEffect(() => {
    // mesure initiale après le premier rendu
    calculerDemiLargeur();
    window.addEventListener('resize', calculerDemiLargeur);

    function etape(ts) {
      // initialisation du compteur de temps
      if (dernierTSRef.current === null) dernierTSRef.current = ts;
      const dt = (ts - dernierTSRef.current) / 1000; // secondes écoulées
      dernierTSRef.current = ts;

      // défilement uniquement si non pausé et largeur connue
      if (!pauseRef.current && demiLargeurRef.current > 0) {
        xRef.current -= VITESSE_PX_S * dt;

        // réinitialisation invisible quand on a parcouru un jeu complet
        if (xRef.current <= -demiLargeurRef.current) {
          xRef.current += demiLargeurRef.current;
        }

        // application directe sur le DOM (évite les re-renders React)
        if (pisteRef.current) {
          pisteRef.current.style.transform = `translateX(${xRef.current}px)`;

          // Calcul de l'index de carte active au centre
          const piste = pisteRef.current;
          const cartes = Array.from(piste.children);
          if (cartes.length > 0) {
            const pisteRect = piste.parentElement?.getBoundingClientRect();
            const centerX = pisteRect?.width / 2 || 0;

            let closestCard = 0;
            let closestDistance = Infinity;

            cartes.forEach((carte, i) => {
              const carteCenterX = carte.getBoundingClientRect().left - (pisteRect?.left || 0) + carte.getBoundingClientRect().width / 2;
              const distance = Math.abs(carteCenterX - centerX);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = i;
              }
            });

            setActiveCardIndex(closestCard % N);
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(etape);
    }

    rafIdRef.current = requestAnimationFrame(etape);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', calculerDemiLargeur);
    };
  }, [calculerDemiLargeur]);

  /* ─── cycle des points indicateurs (indépendant de la position) ─── */
  useEffect(() => {
    const id = setInterval(() => {
      setPointActif(p => (p + 1) % NB_POINTS);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  /* ─── pause au survol ─── */
  const pauser   = () => { pauseRef.current = true; };
  const reprendre = () => {
    pauseRef.current = false;
    dernierTSRef.current = null; // réinitialise le timer pour éviter un saut
  };

  /* ─── navigation manuelle par les flèches ─── */
  function sauter(direction) {
    const piste = pisteRef.current;
    if (!piste || demiLargeurRef.current === 0) return;

    // calcule la largeur d'une carte + gap depuis le DOM
    const c0  = piste.children[0];
    const c1  = piste.children[1];
    const pas = c0
      ? c0.getBoundingClientRect().width +
        (c1 ? c1.getBoundingClientRect().left - c0.getBoundingClientRect().right : 18)
      : 238;

    xRef.current += direction * pas;

    // garde les bornes de la boucle
    if (xRef.current > 0)                           xRef.current = -(demiLargeurRef.current - pas);
    if (xRef.current <= -demiLargeurRef.current)     xRef.current += demiLargeurRef.current;

    // transition courte pour la navigation manuelle
    piste.style.transition = 'transform 0.4s ease';
    piste.style.transform  = `translateX(${xRef.current}px)`;
    setTimeout(() => { if (piste) piste.style.transition = ''; }, 420);
  }

  /* ─── rendu ─── */
  return (
    <section className={styles.section}>
      {/* Titre avec underline animée */}
      <div className={styles.enTete}>
        <h2 className={styles.titre}>
          Nos Dernières Collections
          <span className={styles.underlineAnimee} />
        </h2>
      </div>

      {/* Marquee text — scrolling text strip */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          <span>Qualité • Fraîcheur • Innovation • Fiabilité •</span>
          <span>Qualité • Fraîcheur • Innovation • Fiabilité •</span>
        </div>
      </div>

      {/* Zone du carrousel — la souris en pause l'animation */}
      <div
        className={styles.zoneCarrousel}
        onMouseEnter={pauser}
        onMouseLeave={reprendre}
      >
        {/* Flèche gauche — apparaît au survol */}
        <button
          className={`${styles.fleche} ${styles.gauche}`}
          onClick={() => sauter(1)}
          aria-label="Produit précédent"
        >
          &#8249;
        </button>

        {/* Piste défilante — transformée par le RAF */}
        <div className={styles.piste} ref={pisteRef}>
          {TOUTES_CARTES.map((produit, index) => {
            const isActive = index === activeCardIndex;
            return (
              <div
                key={`carte-${produit.id}-${index}`}
                className={`${styles.carte} ${isActive ? styles.carteActive : ''}`}
                ref={(el) => (cartesRef.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, cartesRef.current[index])}
                onMouseLeave={() => handleMouseLeave(cartesRef.current[index])}
              >
                {/* Image portrait avec overlay gradient */}
                <img
                  src={produit.imageUrl}
                  alt={produit.nom}
                  className={styles.image}
                  loading="lazy"
                />
                {/* Gradient overlay avec nom du produit */}
                <div className={styles.overlay}>
                  <h3 className={styles.nomProduit}>{produit.nom}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flèche droite — apparaît au survol */}
        <button
          className={`${styles.fleche} ${styles.droite}`}
          onClick={() => sauter(-1)}
          aria-label="Produit suivant"
        >
          &#8250;
        </button>
      </div>

      {/* Points indicateurs de position */}
      <div className={styles.points} role="tablist" aria-label="Position dans le carrousel">
        {[...Array(NB_POINTS)].map((_, i) => (
          <span
            key={i}
            role="tab"
            aria-selected={i === pointActif}
            className={`${styles.point} ${i === pointActif ? styles.actif : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
