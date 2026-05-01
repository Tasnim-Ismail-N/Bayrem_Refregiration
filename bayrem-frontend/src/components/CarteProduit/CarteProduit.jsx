// src/components/CarteProduit/CarteProduit.jsx
import { useNavigate } from 'react-router-dom';
import styles from './CarteProduit.module.css';

export default function CarteProduit({ produit }) {
  const navigate = useNavigate();

  return (
    <div className={styles.carte} onClick={() => navigate(`/produits/${produit.id}`)}>
      <div className={styles.imageWrapper}>
        <img src={produit.imageUrl} alt={produit.nom} className={styles.image} />
        {produit.estEnPromotion && (
          <span className={styles.badgePromo}>Promo</span>
        )}
      </div>

      <div className={styles.corps}>
        <span className={styles.categorie}>{produit.categorie}</span>
        <h3 className={styles.nom}>{produit.nom}</h3>

        <div className={styles.prix}>
          {produit.estEnPromotion ? (
            <>
              <span className={styles.prixPromo}>{produit.prixPromo?.toLocaleString()} DT</span>
              <span className={styles.prixBarre}>{produit.prix.toLocaleString()} DT</span>
            </>
          ) : (
            <span className={styles.prixNormal}>{produit.prix.toLocaleString()} DT</span>
          )}
        </div>

        <button className={styles.btnDetail}>Voir le détail</button>
      </div>
    </div>
  );
}
