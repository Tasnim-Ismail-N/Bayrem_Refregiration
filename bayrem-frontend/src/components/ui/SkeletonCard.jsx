// src/components/ui/SkeletonCard.jsx
/**
 * Skeleton loading pour ProductCard
 * Affiche lors du chargement des produits
 */
import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.line} />
        <div className={styles.line} style={{ width: '70%' }} />
        <div className={styles.line} style={{ width: '40%', marginTop: '12px' }} />
      </div>
    </div>
  );
}
