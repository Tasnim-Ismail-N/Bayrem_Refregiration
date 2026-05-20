// src/components/Layout/Layout.jsx
/**
 * Layout wrapper pour toutes les pages
 * - Applique paddingTop dynamique pour le header fixe (154px ou 118px)
 * - Contient les composants globaux (WhatsApp, ScrollToTop, etc.)
 */
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton';
import ScrollToTop from '../ui/ScrollToTop';
import LocalisationBadge from '../LocalisationBadge/LocalisationBadge';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const { scrollDir, scrollY } = useScrollDirection();
  const isScrolled = scrollDir === 'down' && scrollY > 80;

  return (
    <div className={styles.layout}>
      <main className={`${styles.main} ${isScrolled ? styles.mainScrolled : ''}`}>
        {children}
      </main>
      <ScrollToTop />
      <WhatsAppButton />
      <LocalisationBadge />
    </div>
  );
}
