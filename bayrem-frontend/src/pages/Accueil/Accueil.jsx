// src/pages/Accueil/Accueil.jsx
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSlider } from '../../hooks/useSlider';
import { useProduitsVedette } from '../../hooks/useProduitsVedette';
import { useCategories } from '../../hooks/useCategories';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CarteProduit from '../../components/CarteProduit/CarteProduit';
import CarouselProduits from '../../components/CarouselProduits/CarouselProduits';
import HistoireMarque from '../../components/HistoireMarque/HistoireMarque';
import styles from './Accueil.module.css';

export default function Accueil() {
  const navigate = useNavigate();
  const { slides, loading: loadingSlider } = useSlider();
  const { produits, loading: loadingProduits, erreur: erreurProduits } = useProduitsVedette();
  const { categories, loading: loadingCategories } = useCategories();

  return (
    <>
      <Helmet>
        <title>Bayrem Réfrigération — Équipement Réfrigéré Professionnel</title>
        <meta name="description" content="Vente d'équipements réfrigérés professionnels : armoires réfrigérées, comptoirs réfrigérés, congélateurs et équipements de cuisine pour votre établissement." />
      </Helmet>      {/* ── Hero Slider ── */}
      {loadingSlider ? (
        <div className={styles.skeletonSlider} />
      ) : (
        <HeroSlider slides={slides} />
      )}

      {/* ── Catégories ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.titre}>Nos Catégories</h2>
          {loadingCategories ? (
            <div className={styles.grilleCategories}>
              {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonCategorie} />)}
            </div>
          ) : (
            <div className={styles.grilleCategories}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={styles.carteCategorie}
                  onClick={() => navigate(`/catalogue?categorieId=${cat.id}`)}
                >
                  <img src={cat.iconeUrl} alt={cat.nom} className={styles.iconeCategorie} />
                  <span>{cat.nom}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bannière Promotionnelle ── */}
      <div className={styles.container}>
        <div className={styles.bannierePromo}>
          <div className={styles.bannierePromoTexte}>
            <h3>Promotions Exceptionnelles — Jusqu'à -20% sur tout le stock</h3>
            <p>Offres limitées · Expédition sous 48h · Paiement en 3x sans frais</p>
          </div>
          <button
            className={styles.bannierePromoBtn}
            onClick={() => navigate('/produits?promotion=true')}
          >
            Voir les offres
          </button>
        </div>
      </div>

      {/* ── Produits vedettes ── */}
      <section className={`${styles.section} ${styles.sectionGrise}`}>
        <div className={styles.container}>
          <div className={styles.enteteSection}>
            <h2 className={styles.titre}>Produits en Promotion</h2>
            <button className={styles.btnVoirTout} onClick={() => navigate('/catalogue?promotion=true')}>
              Voir tout →
            </button>
          </div>

          {erreurProduits ? (
            <p className={styles.erreur}>Impossible de charger les produits.</p>
          ) : loadingProduits ? (
            <div className={styles.grilleProduits}>
              {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonCarte} />)}
            </div>
          ) : produits.length === 0 ? (
            <p className={styles.vide}>Aucun produit en promotion pour le moment.</p>
          ) : (
            <div className={styles.grilleProduits}>
              {produits.map(p => <CarteProduit key={p.id} produit={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Carrousel produits (défilement automatique infini) ── */}
      <CarouselProduits />

      {/* ── Section histoire marque (deux colonnes) ── */}
      <HistoireMarque />

      {/* ── Bandeau contact ── */}
      <section className={styles.bandeau}>
        <div className={styles.container}>
          <h2 className={styles.bandeauTitre}>Besoin d'un conseil ?</h2>
          <p className={styles.bandeauTexte}>Visitez notre showroom ou contactez-nous directement.</p>
          <button className={styles.btnContact} onClick={() => navigate('/contact')}>
            Nous contacter
          </button>
        </div>
      </section>
    </>
  );
}
