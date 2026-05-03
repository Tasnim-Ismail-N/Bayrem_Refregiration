// src/components/Navbar/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Phone, Sun, Moon } from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useTheme } from '../../hooks/useTheme';
import { useCategories } from '../../hooks/useCategories';
import logo from '../../assets/logo.jpg';
import SearchBar from '../search/SearchBar';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { scrollDir, scrollY } = useScrollDirection();
  const { theme, toggleTheme } = useTheme();
  const { categories } = useCategories();

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerClassName = `${styles.header} ${
    scrollDir === 'down' && scrollY > 80 ? styles.headerHidden : ''
  } ${scrollY > 50 ? styles.headerScrolled : ''}`;

  return (
    <>
      <header className={headerClassName}>
        <div className={styles.container}>
          {/* Logo texte stylisé */}
          <button className={styles.logo} onClick={() => navigate('/')} title="Accueil">
            <img src={logo} alt="Bayrem Réfrigération" className={styles.logoImg} />
          </button>

          {/* Navigation desktop */}
          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => isActive ? styles.lienActif : styles.lien}>
              Accueil
            </NavLink>

            {/* Dropdown catégories */}
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <button
                className={styles.lien}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                Catalogue
              </button>
              {dropdownOpen && (
                <div
                  className={styles.dropdown}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {categories.map(cat => (
                    <NavLink
                      key={cat.id}
                      to={`/produits?categorieId=${cat.id}`}
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {cat.nom}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/contact" className={({ isActive }) => isActive ? styles.lienActif : styles.lien}>
              Contact
            </NavLink>
          </nav>

          {/* Icône loupe + Téléphone + Theme */}
          <div className={styles.actions}>
            <button
              className={styles.btnSearch}
              onClick={() => setSearchOpen(true)}
              title="Rechercher"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </button>
            <button
              className={styles.btnTheme}
              onClick={toggleTheme}
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              aria-label="Basculer le thème"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a href="tel:+21322465343" className={styles.btnPhone} title="Appeler">
              <Phone size={20} />
              <span className={styles.phoneText}>+213 22 46 53 43</span>
            </a>
          </div>

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
            <a href="tel:+21322465343" className={styles.lienMobile}>📞 +213 22 46 53 43</a>
          </div>
        )}
      </header>

      {/* Barre de recherche modale */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
