// src/pages/Accueil/Accueil.jsx
import { useNavigate } from 'react-router-dom';
import { useSlider } from '../../hooks/useSlider';
import { useProduitsVedette } from '../../hooks/useProduitsVedette';
import { useCategories } from '../../hooks/useCategories';
import Carrousel from '../../components/Carrousel/Carrousel';
import CarteProduit from '../../components/CarteProduit/CarteProduit';
import styles from './Accueil.module.css';

export default function Accueil() {
  const navigate = useNavigate();
  const { slides, loading: loadingSlider } = useSlider();
  const { produits, loading: loadingProduits, erreur: erreurProduits } = useProduitsVedette();
  const { categories, loading: loadingCategories } = useCategories();

  return (
    <main>
      {/* ── Carrousel ── */}
      <section className={styles.sectionSlider}>
        {loadingSlider ? (
          <div className={styles.skeletonSlider} />
        ) : (
          <Carrousel slides={slides} />
        )}
      </section>

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
                  onClick={() => navigate(`/produits?categorieId=${cat.id}`)}
                >
                  <img src={cat.iconeUrl} alt={cat.nom} className={styles.iconeCategorie} />
                  <span>{cat.nom}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Produits vedettes ── */}
      <section className={`${styles.section} ${styles.sectionGrise}`}>
        <div className={styles.container}>
          <div className={styles.enteteSection}>
            <h2 className={styles.titre}>Produits en Promotion</h2>
            <button className={styles.btnVoirTout} onClick={() => navigate('/produits?promotion=true')}>
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
    </main>
  );
}
