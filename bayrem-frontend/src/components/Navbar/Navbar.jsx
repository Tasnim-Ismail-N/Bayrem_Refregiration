// src/components/Navbar/Navbar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <button className={styles.logo} onClick={() => navigate('/')}>
          <img src={logo} alt="Bayrem Réfrigération" className={styles.logoImg} />
        </button>

        {/* Navigation desktop */}
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.lienActif : styles.lien}>
            Accueil
          </NavLink>
          <NavLink to="/produits" className={({ isActive }) => isActive ? styles.lienActif : styles.lien}>
            Catalogue
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? styles.lienActif : styles.lien}>
            Contact
          </NavLink>
        </nav>

        {/* Burger mobile */}
        <button
          className={styles.burger}
          onClick={() => setMenuOuvert(o => !o)}
          aria-label="Menu"
        >
          <span className={menuOuvert ? styles.barreOuverte1 : styles.barre} />
          <span className={menuOuvert ? styles.barreOuverte2 : styles.barre} />
          <span className={menuOuvert ? styles.barreOuverte3 : styles.barre} />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className={styles.menuMobile}>
          <NavLink to="/" end className={styles.lienMobile} onClick={() => setMenuOuvert(false)}>Accueil</NavLink>
          <NavLink to="/produits" className={styles.lienMobile} onClick={() => setMenuOuvert(false)}>Catalogue</NavLink>
          <NavLink to="/contact" className={styles.lienMobile} onClick={() => setMenuOuvert(false)}>Contact</NavLink>
        </div>
      )}
    </header>
  );
}
