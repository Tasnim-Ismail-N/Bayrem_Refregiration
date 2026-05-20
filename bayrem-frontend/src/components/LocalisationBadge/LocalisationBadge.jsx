// src/components/LocalisationBadge/LocalisationBadge.jsx
import { MapPin } from 'lucide-react';
import { useMagasin } from '../../hooks/useMagasin';
import styles from './LocalisationBadge.module.css';

export default function LocalisationBadge() {
  const { magasin } = useMagasin();
  const mapsUrl = magasin?.googleMapsUrl || 'https://maps.google.com/?q=Bayrem+Refrigeration+Alger';

  return (
    <a 
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.badge} 
      title="Trouver un revendeur (Google Maps)"
      aria-label="Trouver un revendeur sur Google Maps"
    >
      <div className={styles.iconWrapper}>
        <MapPin size={22} className={styles.icon} />
      </div>
      <span className={styles.text}>TROUVER UN REVENDEUR</span>
    </a>
  );
}
