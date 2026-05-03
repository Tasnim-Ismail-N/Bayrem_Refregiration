// src/components/CarteProduit/CarteProduit.jsx
import { useNavigate } from 'react-router-dom';
import styles from './CarteProduit.module.css';

export default function CarteProduit({ produit }) {
  const navigate = useNavigate();

  // Formater le prix en DZD
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculer le pourcentage de réduction s'il n'existe pas
  const percentagePromo = produit.pourcentagePromo ||
    (produit.estEnPromotion && produit.prixPromo
      ? Math.round((1 - produit.prixPromo / produit.prix) * 100)
      : null);

  const handleClick = (e) => {
    // Ne pas naviguer si on clique sur le bouton (il a son propre onClick)
    if (e.target.tagName === 'BUTTON') return;
    navigate(`/produits/${produit.id}`);
  };

  return (
    <article className={styles.carte} onClick={handleClick}>
      {/* Image wrapper avec badges */}
      <div className={styles.imageWrapper}>
        <img
          src={produit.imageUrl}
          alt={produit.nom}
          className={styles.image}
          loading="lazy"
        />

        {/* Badge promo avec % */}
        {produit.estEnPromotion && percentagePromo && (
          <span className={styles.badgePromo}>-{percentagePromo}%</span>
        )}

        {/* Badge catégorie */}
        <span className={styles.badgeCategorie}>{produit.categorie}</span>
      </div>

      {/* Corps de la carte */}
      <div className={styles.corps}>
        <h3 className={styles.nom}>{produit.nom}</h3>

        {/* Prix */}
        <div className={styles.prix}>
          {produit.estEnPromotion && produit.prixPromo ? (
            <>
              <span className={styles.prixPromo}>{formatPrice(produit.prixPromo)}</span>
              <span className={styles.prixBarre}>{formatPrice(produit.prix)}</span>
            </>
          ) : (
            <span className={styles.prixNormal}>{formatPrice(produit.prix)}</span>
          )}
        </div>

        {/* Bouton qui slide au hover */}
        <button
          className={styles.btnVoirProduit}
          onClick={() => navigate(`/produits/${produit.id}`)}
        >
          Voir le produit →
        </button>
      </div>
    </article>
  );
}
