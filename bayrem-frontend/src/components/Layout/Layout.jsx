// src/components/Layout/Layout.jsx
/**
 * Layout wrapper pour toutes les pages
 * - Applique paddingTop: 70px pour le header fixe
 * - Contient les composants globaux (WhatsApp, ScrollToTop, etc.)
 */
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton';
import ScrollToTop from '../ui/ScrollToTop';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        {children}
      </main>
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  );
}
