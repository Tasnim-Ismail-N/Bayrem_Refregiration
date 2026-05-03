// src/pages/DetailProduit/DetailProduit.jsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProduitDetail } from '../../hooks/useProduitDetail';
import { useProduits } from '../../hooks/useProduits';
import CarteProduit from '../../components/CarteProduit/CarteProduit';
import styles from './DetailProduit.module.css';

export default function DetailProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageActive, setImageActive] = useState(0);

  const { produit, loading, erreur } = useProduitDetail(id);

  // Fetch all products in same category for navigation
  const { produits: produitsCategorie } = useProduits(
    produit?.categorieId ? { categorieId: produit.categorieId, limite: 100 } : {}
  );

  // Calculate previous/next navigation
  const navigation = useMemo(() => {
    if (!produit || !produitsCategorie.length) return { prev: null, next: null };

    const currentIndex = produitsCategorie.findIndex(p => p.id === parseInt(id));
    return {
      prev: currentIndex > 0 ? produitsCategorie[currentIndex - 1] : null,
      next: currentIndex < produitsCategorie.length - 1 ? produitsCategorie[currentIndex + 1] : null,
    };
  }, [produit, produitsCategorie, id]);

  const { produits: similaires } = useProduits(
    produit?.produitsSimilaires?.length
      ? { limite: 4 }
      : {}
  );

  const similairesFiltres = similaires.filter(p =>
    produit?.produitsSimilaires?.includes(p.id)
  );

  if (loading) return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.skeletonDetail} />
      </div>
    </main>
  );

  if (erreur || !produit) return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.etatErreur}>
          <p>Produit introuvable.</p>
          <button className={styles.btnRetour} onClick={() => navigate('/produits')}>
            ← Retour au catalogue
          </button>
        </div>
      </div>
    </main>
  );

  const images = produit.images?.length ? produit.images : [produit.imageUrl];

  return (
    <main className={styles.page}>
      <Helmet>
        <title>{produit?.nom} — Bayrem Réfrigération</title>
        <meta name="description" content={produit?.description?.substring(0, 160) || "Découvrez ce produit réfrigéré professionnel"} />
      </Helmet>
      <div className={styles.container}>
        {/* Fil d'ariane */}
        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate('/')} className={styles.breadcrumbLien}>Accueil</button>
          <span className={styles.breadcrumbSep}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></span>
          <button onClick={() => navigate('/produits')} className={styles.breadcrumbLien}>Catalogue</button>
          <span className={styles.breadcrumbSep}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></span>
          <span className={styles.breadcrumbActif}>{produit.nom}</span>
        </nav>

        {/* Corps principal */}
        <div className={styles.corps}>
          {/* ── Galerie ── */}
          <div className={styles.galerie}>
            <div className={styles.imageprincipaleWrapper}>
              {produit.estEnPromotion && (
                <span className={styles.badgePromo}>Promo</span>
              )}
              <img
                src={images[imageActive]}
                alt={produit.nom}
                className={styles.imagePrincipale}
              />
            </div>

            {images.length > 1 && (
              <div className={styles.miniatures}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${produit.nom} ${i + 1}`}
                    className={`${styles.miniature} ${i === imageActive ? styles.miniatureActive : ''}`}
                    onClick={() => setImageActive(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Infos produit ── */}
          <div className={styles.infos}>
            <span className={styles.categorieBadge}>{produit.categorie}</span>
            <h1 className={styles.nom}>{produit.nom}</h1>

            {/* Prix */}
            <div className={styles.prixBloc}>
              {produit.estEnPromotion ? (
                <>
                  <span className={styles.prixPromo}>
                    {produit.prixPromo?.toLocaleString()} DT
                  </span>
                  <span className={styles.prixBarre}>
                    {produit.prix.toLocaleString()} DT
                  </span>
                  <span className={styles.economie}>
                    Économie : {(produit.prix - produit.prixPromo).toLocaleString()} DT
                  </span>
                </>
              ) : (
                <span className={styles.prixNormal}>
                  {produit.prix.toLocaleString()} DT
                </span>
              )}
            </div>

            {/* Description */}
            <p className={styles.description}>{produit.description}</p>

            {/* Caractéristiques */}
            {produit.caracteristiques?.length > 0 && (
              <div className={styles.caracteristiques}>
                <h3 className={styles.sousTitre}>Fiche technique</h3>
                <table className={styles.tableau}>
                  <tbody>
                    {produit.caracteristiques.map((c, i) => (
                      <tr key={i} className={styles.ligne}>
                        <td className={styles.label}>{c.label}</td>
                        <td className={styles.valeur}>{c.valeur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CTA */}
            <div className={styles.actions}>
              <a
                href="tel:+21322465343"
                className={styles.btnAppel}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Appeler pour commander
              </a>
              <button
                className={styles.btnRetour}
                onClick={() => navigate('/produits')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Retour au catalogue
              </button>
            </div>

            {/* Navigation produits précédent/suivant */}
            {(navigation.prev || navigation.next) && (
              <div className={styles.navButtons}>
                {navigation.prev ? (
                  <button
                    className={styles.btnNavProd}
                    onClick={() => navigate(`/produits/${navigation.prev.id}`)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Produit précédent
                  </button>
                ) : (
                  <div />
                )}
                {navigation.next ? (
                  <button
                    className={styles.btnNavProd}
                    onClick={() => navigate(`/produits/${navigation.next.id}`)}
                  >
                    Produit suivant
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Produits similaires ── */}
        {similairesFiltres.length > 0 && (
          <section className={styles.similaires}>
            <h2 className={styles.titreSimilaires}>Produits similaires</h2>
            <div className={styles.grilleSimilaires}>
              {similairesFiltres.map(p => <CarteProduit key={p.id} produit={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
