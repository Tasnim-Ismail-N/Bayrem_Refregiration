// src/components/Navbar/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Phone, Mail, ChevronDown, ShoppingBag, ChevronRight, Menu, Snowflake, Store, Cake, Pizza, Croissant, PartyPopper, Beef, Flame, Coffee, Smartphone, Columns, Utensils, Building
} from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import logo from '../../assets/logo.jpg';
import { CATEGORIES } from '../../data/categories';
import styles from './Navbar.module.css';

const IconMap = {
  Menu, Snowflake, Store, Cake, Pizza, Croissant, PartyPopper, Beef, Flame, Coffee, Smartphone, Columns, Utensils, Building
};

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catMenuOuvert, setCatMenuOuvert] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollDir, scrollY } = useScrollDirection();
  const catDropdownRef = useRef(null);

  // Sync selectedCat state with URL category slug
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'catalogue' && pathParts[2]) {
      const activeCat = CATEGORIES.find(c => c.slug === pathParts[2]);
      if (activeCat) {
        setSelectedCat(activeCat);
        return;
      }
    }
    setSelectedCat(null);
  }, [location.pathname]);

  // Click outside to close categories dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
        setCatMenuOuvert(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedCat) {
      if (searchQuery.trim()) {
        navigate(`/catalogue/${selectedCat.slug}?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/catalogue/${selectedCat.slug}`);
      }
    } else {
      if (searchQuery.trim()) {
        navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate('/catalogue');
      }
    }
  };

  const handleSelectCat = (cat) => {
    setSelectedCat(cat);
    setCatMenuOuvert(false);
    
    // Navigate immediately upon category selection
    if (cat) {
      if (searchQuery.trim()) {
        navigate(`/catalogue/${cat.slug}?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/catalogue/${cat.slug}`);
      }
    } else {
      if (searchQuery.trim()) {
        navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate('/catalogue');
      }
    }
  };

  const isScrolled = scrollDir === 'down' && scrollY > 80;

  return (
    <>
      <div className={`${styles.headerWrapper} ${isScrolled ? styles.headerScrolled : ''}`}>
        
        {/* ── TOPBAR ── */}
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <a href="tel:+21322465343" className={styles.topbarLink}>
              <Phone size={14} />
              <span>22 46 53 43 / 53 96 53 43</span>
            </a>
          </div>
          <div className={styles.topbarCenter}>
            Livraison sur Alger et environs — Route de Boumerdès
          </div>
          <div className={styles.topbarRight}>
            <a href="mailto:alfrigo48@gmail.com" className={styles.topbarLink}>
              <Mail size={14} />
              <span>alfrigo48@gmail.com</span>
            </a>
          </div>
        </div>

        {/* ── MAINBAR ── */}
        <div className={styles.mainbar}>
          <button className={styles.logoWrapper} onClick={() => navigate('/')} title="Accueil">
            <img src={logo} alt="Bayrem Réfrigération" className={styles.logoImg} />
          </button>

          <form className={styles.searchContainer} onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Rechercher dans le catalogue" 
              className={styles.searchInput} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.searchDivider}></span>
            
            <div className={styles.searchCatContainer} ref={catDropdownRef}>
              <button 
                type="button" 
                className={styles.searchCatBtn} 
                onClick={() => setCatMenuOuvert(o => !o)}
              >
                <span className={styles.searchCatName}>
                  {selectedCat ? selectedCat.nom : 'LES CATÉGORIES'}
                </span>
                <ChevronDown size={14} className={`${styles.searchCatChevron} ${catMenuOuvert ? styles.chevronRotated : ''}`} />
              </button>

              {catMenuOuvert && (
                <div className={styles.searchCatDropdown}>
                  <button 
                    type="button"
                    className={`${styles.searchCatItem} ${!selectedCat ? styles.searchCatItemActive : ''}`}
                    onClick={() => handleSelectCat(null)}
                  >
                    Toutes les catégories
                  </button>
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id} 
                      type="button"
                      className={`${styles.searchCatItem} ${selectedCat?.id === cat.id ? styles.searchCatItemActive : ''}`}
                      onClick={() => handleSelectCat(cat)}
                    >
                      {cat.nom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className={styles.searchBtn}>
              <Search size={18} />
            </button>
          </form>

          <div className={styles.actions}>
            <NavLink to="/contact" className={styles.navLink}>
              Qui Sommes Nous ?
            </NavLink>
            <button className={styles.cartBtn}>
              <ShoppingBag size={24} />
            </button>
            <button className={styles.burger} onClick={() => setMenuOuvert(o => !o)}>
              <span className={menuOuvert ? styles.barreOuverte1 : styles.barre} />
              <span className={menuOuvert ? styles.barreOuverte2 : styles.barre} />
              <span className={menuOuvert ? styles.barreOuverte3 : styles.barre} />
            </button>
          </div>
        </div>

        {/* ── SOTEQ NAVIGATION BAR ── */}
        <div className={styles.soteqBar}>
          <div className={styles.soteqNav}>
            {CATEGORIES.map(cat => {
              const TopIcon = IconMap[cat.icone] || Store;
              return (
                <div key={cat.id} className={styles.soteqItem} onClick={() => navigate(`/catalogue/${cat.slug}`)}>
                  <span className={styles.itemContent}>
                    <TopIcon size={16} />
                    <span>{cat.nom}</span>
                    {cat.isDropdown && <ChevronDown size={14} className={styles.chevron} />}
                  </span>
                  
                  {cat.sousCategories && cat.sousCategories.length > 0 && (
                    <div className={styles.dropdownMenu1} onClick={(e) => e.stopPropagation()}>
                      {cat.sousCategories.map(sub => (
                        <div key={sub.id} className={styles.menuItem1} onClick={(e) => { e.stopPropagation(); navigate(`/catalogue/${cat.slug}?sousCategorieId=${sub.id}`); }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {(() => {
                              const SubIcon = IconMap[sub.icone];
                              return SubIcon ? <SubIcon size={14} /> : null;
                            })()}
                            {sub.nom}
                          </span>
                          <ChevronRight size={14} className={styles.chevronRight} />

                          {sub.groups && sub.groups.length > 0 && (
                            <div className={styles.dropdownMenu2} onClick={(e) => e.stopPropagation()}>
                              <div className={styles.dropdown2Content}>
                                {sub.groups.map((group, idx) => {
                                  const GroupIcon = IconMap[group.icone] || Store;
                                  return (
                                    <div key={idx} className={styles.groupCol}>
                                      <div className={styles.groupTitle}>
                                        <GroupIcon size={16} />
                                        {group.titre}
                                      </div>
                                      <div className={styles.groupLinks}>
                                        {group.liens.map((lien, i) => (
                                          <a key={i} href="/catalogue" onClick={(e) => { e.preventDefault(); navigate(`/catalogue?search=${encodeURIComponent(lien)}`); }} className={styles.subLink}>
                                            <span className={styles.linkBullet}></span>
                                            {lien}
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MOBILE NAV DRAWER ── */}
      {menuOuvert && (
        <div className={styles.mobileNavOverlay} onClick={() => setMenuOuvert(false)}>
          <div className={styles.mobileNavDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileNavHeader}>
              <button className={styles.logoWrapperMobile} onClick={() => { navigate('/'); setMenuOuvert(false); }} title="Accueil">
                <img src={logo} alt="Bayrem Réfrigération" className={styles.logoImgMobile} />
              </button>
            </div>
            
            {/* Search Bar in Mobile Menu */}
            <form className={styles.mobileSearchContainer} onSubmit={(e) => { handleSearch(e); setMenuOuvert(false); }}>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className={styles.mobileSearchInput} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.mobileSearchBtn}>
                <Search size={18} />
              </button>
            </form>

            <div className={styles.mobileNavLinks}>
              <NavLink to="/" className={styles.mobileNavLink} onClick={() => setMenuOuvert(false)}>
                Accueil
              </NavLink>
              <NavLink to="/contact" className={styles.mobileNavLink} onClick={() => setMenuOuvert(false)}>
                Qui Sommes Nous ? / Contact
              </NavLink>
              <div className={styles.mobileDivider}></div>
              <p className={styles.mobileNavTitle}>Nos Catégories</p>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className={styles.mobileCatItem}>
                  <button 
                    className={styles.mobileCatHeader}
                    onClick={() => { navigate(`/catalogue/${cat.slug}`); setMenuOuvert(false); }}
                  >
                    <span>{cat.nom}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
