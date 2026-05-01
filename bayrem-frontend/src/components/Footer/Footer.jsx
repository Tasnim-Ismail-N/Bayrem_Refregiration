// src/components/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grille}>
          {/* Colonne 1 — Marque */}
          <div>
            <div className={styles.logo}>
              <img src={logo} alt="Bayrem Réfrigération" className={styles.logoImg} />
            </div>
            <p className={styles.description}>
              Spécialiste en équipements frigorifiques professionnels depuis plus de 20 ans.
              Qualité, fiabilité et service après-vente.
            </p>
          </div>

          {/* Colonne 2 — Navigation */}
          <div>
            <h4 className={styles.titreColonne}>Navigation</h4>
            <ul className={styles.liste}>
              <li><Link to="/" className={styles.lien}>Accueil</Link></li>
              <li><Link to="/produits" className={styles.lien}>Catalogue</Link></li>
              <li><Link to="/produits?promotion=true" className={styles.lien}>Promotions</Link></li>
              <li><Link to="/contact" className={styles.lien}>Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3 — Catégories */}
          <div>
            <h4 className={styles.titreColonne}>Catégories</h4>
            <ul className={styles.liste}>
              <li><Link to="/produits?categorieId=1" className={styles.lien}>Armoires réfrigérées</Link></li>
              <li><Link to="/produits?categorieId=2" className={styles.lien}>Comptoirs réfrigérés</Link></li>
              <li><Link to="/produits?categorieId=3" className={styles.lien}>Congélateurs</Link></li>
              <li><Link to="/produits?categorieId=4" className={styles.lien}>Équipements de cuisine</Link></li>
            </ul>
          </div>

          {/* Colonne 4 — Contact */}
          <div>
            <h4 className={styles.titreColonne}>Contact</h4>
            <ul className={styles.listeContact}>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Route de Boumerdès, Alger</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> 22 46 53 43</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> 53 96 53 43</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> alfrigo48@gmail.com</li>
            </ul>
            <div className={styles.reseaux}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bas}>
          <p>© {new Date().getFullYear()} Bayrem Réfrigération — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
