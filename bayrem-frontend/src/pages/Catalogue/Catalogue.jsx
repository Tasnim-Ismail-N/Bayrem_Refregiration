// src/pages/Catalogue/Catalogue.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid2x2, Grid3x3, LayoutGrid, Search, Flame, Snowflake, Pizza, Store, Coffee, Menu, Building, Cake, Croissant, PartyPopper, Beef, Columns, Utensils, Smartphone, ShoppingBag, Thermometer, Box, CircleDollarSign, Tag } from 'lucide-react';
import { useProduits } from '../../hooks/useProduits';
import { useDebounce } from '../../hooks/useDebounce';
import CarteProduit from '../../components/CarteProduit/CarteProduit';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { CATEGORIES } from '../../data/categories';
import styles from './Catalogue.module.css';

const IconMap = {
  Flame, Snowflake, Pizza, Store, Coffee, Menu, Building, Cake, Croissant, PartyPopper, Beef, Columns, Utensils, Smartphone, ShoppingBag
};

const CATEGORY_BANNERS = {
  'cuisson': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1920&h=400',
  'equipement-froid': 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&q=80&w=1920&h=400',
  'snack': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1920&h=400',
  'superette-top': 'https://images.unsplash.com/photo-1579621970588-a3f5ce5998c1?auto=format&fit=crop&q=80&w=1920&h=400',
  'cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1920&h=400',
  'pizzeria-top': 'https://images.unsplash.com/photo-1590947132387-155cc3ddf28d?auto=format&fit=crop&q=80&w=1920&h=400',
  'par-metier': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1920&h=400',
};

const CATEGORY_DESC = {
  'cuisson': 'Découvrez notre gamme complète d\'équipements de cuisson pour les professionnels de la restauration.',
  'equipement-froid': 'Vitrines, armoires et chambres froides : l\'excellence du froid commercial et industriel.',
  'snack': 'Tout l\'équipement nécessaire pour aménager votre espace snacking avec du matériel performant.',
  'superette-top': 'Agencement complet et meubles frigorifiques pour superettes et grands magasins.',
  'cafe': 'Équipez votre café ou salon de thé avec des machines et arrières bars de haute qualité.',
  'pizzeria-top': 'Matériel spécialisé pour pizzeria : fours, tours réfrigérés et accessoires.',
  'par-metier': 'Sélection d\'équipements triés selon votre métier pour répondre parfaitement à vos besoins.'
};

const MOCK_CAPACITES = ['Moins de 200L', '200L - 500L', 'Plus de 500L'];
const MOCK_TYPES_FROID = ['Froid Ventilé', 'Froid Statique', 'Température Positive', 'Température Négative'];

export default function Catalogue() {
  const { categorieSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = CATEGORIES.find(c => c.slug === categorieSlug);
  const categorieId = currentCategory ? currentCategory.id : searchParams.get('categorieId');

  const [filtres, setFiltres] = useState({
    search:          searchParams.get('search')          || '',
    categorieId:     categorieId                         || '',
    sousCategorieId: searchParams.get('sousCategorieId') || '',
    prixMin:         searchParams.get('prixMin')         || '',
    prixMax:         searchParams.get('prixMax')         || '',
    promotion:       searchParams.get('promotion') === 'true',
    tri:             searchParams.get('tri')             || '',
    page:            Number(searchParams.get('page'))    || 1,
    limite:          Number(searchParams.get('limite'))  || 12,
  });

  const [gridLayout, setGridLayout] = useState('grid-3');
  const [inputPrixMin, setInputPrixMin] = useState(filtres.prixMin);
  const [inputPrixMax, setInputPrixMax] = useState(filtres.prixMax);
  const debouncedPrixMin = useDebounce(inputPrixMin, 400);
  const debouncedPrixMax = useDebounce(inputPrixMax, 400);
  // Visual contextual filters states
  const [selectedCapacites, setSelectedCapacites] = useState([]);
  const [selectedTypesFroid, setSelectedTypesFroid] = useState([]);

  useEffect(() => {
    const newCatId = currentCategory ? currentCategory.id : searchParams.get('categorieId') || '';
    setFiltres(prev => ({
      ...prev,
      categorieId: newCatId,
      sousCategorieId: searchParams.get('sousCategorieId') || '',
      search: searchParams.get('search') || '',
      prixMin: searchParams.get('prixMin') || '',
      prixMax: searchParams.get('prixMax') || '',
      promotion: searchParams.get('promotion') === 'true',
      tri: searchParams.get('tri') || '',
      page: Number(searchParams.get('page')) || 1,
      limite: Number(searchParams.get('limite')) || 12,
    }));
  }, [categorieSlug, searchParams, currentCategory]);

  // Synchroniser les inputs avec les filtres quand ces derniers changent (ex: réinitialisation)
  useEffect(() => {
    setInputPrixMin(filtres.prixMin);
  }, [filtres.prixMin]);

  useEffect(() => {
    setInputPrixMax(filtres.prixMax);
  }, [filtres.prixMax]);

  // Appliquer le filtre de prix après le debounce
  useEffect(() => {
    if (debouncedPrixMin !== filtres.prixMin) {
      appliquerFiltre('prixMin', debouncedPrixMin);
    }
  }, [debouncedPrixMin]);

  useEffect(() => {
    if (debouncedPrixMax !== filtres.prixMax) {
      appliquerFiltre('prixMax', debouncedPrixMax);
    }
  }, [debouncedPrixMax]);

  const { produits, loading, erreur, total } = useProduits(
    Object.fromEntries(
      Object.entries(filtres).filter(([k, v]) => {
        if (k === 'prixMin' || k === 'prixMax') return v !== '' && v !== null && v !== undefined && v !== 0;
        return v !== '' && v !== false;
      })
    )
  );

  const totalPages = Math.ceil(total / filtres.limite);

  const appliquerFiltre = (cle, valeur) => {
    const newFiltres = { ...filtres, [cle]: valeur, page: 1 };
    if (cle === 'categorieId') {
      newFiltres.sousCategorieId = '';
      const cat = CATEGORIES.find(c => c.id === Number(valeur));
      if (cat) {
        navigate(`/catalogue/${cat.slug}`);
        return;
      } else {
        navigate(`/catalogue`);
        return;
      }
    }
    setFiltres(newFiltres);
    updateURL(newFiltres);
  };

  const updateURL = (f) => {
    const params = {};
    if (f.search)          params.search          = f.search;
    if (!currentCategory && f.categorieId) params.categorieId = f.categorieId;
    if (f.sousCategorieId) params.sousCategorieId = f.sousCategorieId;
    if (f.prixMin !== '' && f.prixMin !== null && f.prixMin !== undefined) params.prixMin = f.prixMin;
    if (f.prixMax !== '' && f.prixMax !== null && f.prixMax !== undefined) params.prixMax = f.prixMax;
    if (f.promotion)       params.promotion       = 'true';
    if (f.tri)             params.tri             = f.tri;
    if (f.page > 1)        params.page            = f.page;
    if (f.limite !== 12)   params.limite          = f.limite;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reinitialiser = () => {
    setSelectedCapacites([]);
    setSelectedTypesFroid([]);
    const emptyFilters = { 
      search: '', categorieId: currentCategory ? currentCategory.id : '', sousCategorieId: '', 
      prixMin: '', prixMax: '', promotion: false, tri: '', page: 1, limite: 12 
    };
    setFiltres(emptyFilters);
    updateURL(emptyFilters);
  };

  const toggleFilter = (setState, item) => {
    setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const sousCategories = currentCategory ? currentCategory.sousCategories : [];
  const bannerBg = currentCategory ? CATEGORY_BANNERS[currentCategory.slug] : 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&q=80&w=1920&h=400';
  const descText = currentCategory ? CATEGORY_DESC[currentCategory.slug] : 'Découvrez notre catalogue complet d\'équipements pour professionnels.';

  return (
    <main className={styles.page}>
      <Helmet>
        <title>{currentCategory ? `${currentCategory.nom} — Bayrem Réfrigération` : 'Catalogue Produits — Bayrem Réfrigération'}</title>
      </Helmet>

      {/* ── BANNER ── */}
      {currentCategory && (
        <div className={styles.banner} style={{ backgroundImage: `url(${bannerBg})` }}>
          <div className={styles.bannerOverlay}></div>
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerTitle}>{currentCategory.nom}</h1>
            <p className={styles.bannerDesc}>{descText}</p>
            {sousCategories.length > 0 && (
              <div className={styles.subCatPills}>
                {sousCategories.map(sc => {
                  const ScIcon = IconMap[sc.icone] || Store;
                  return (
                    <button
                      key={sc.id}
                      className={`${styles.pill} ${filtres.sousCategorieId === String(sc.id) ? styles.pillActive : ''}`}
                      onClick={() => appliquerFiltre('sousCategorieId', filtres.sousCategorieId === String(sc.id) ? '' : String(sc.id))}
                    >
                      <ScIcon size={16} />
                      {sc.nom}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.container} style={{ paddingTop: currentCategory ? '0' : '40px' }}>
        
        <div className={styles.disposition}>
          {/* ── SIDEBAR FILTRES CONTEXTUELS ── */}
          <aside className={styles.sidebar}>
            
            {/* PRIX */}
            <div className={styles.bloc}>
              <h3 className={styles.titreFlitre}>
                <CircleDollarSign size={18} />
                Filtrer par Prix
              </h3>
              <div className={styles.rangePrix}>
                <input type="number" placeholder="Min" value={inputPrixMin} onChange={e => setInputPrixMin(e.target.value)} className={styles.inputPrix} />
                <span style={{color: '#9ca3af'}}>-</span>
                <input type="number" placeholder="Max" value={inputPrixMax} onChange={e => setInputPrixMax(e.target.value)} className={styles.inputPrix} />
              </div>
            </div>

            {/* CAPACITÉ (Visual Mock) */}
            <div className={styles.bloc}>
              <h3 className={styles.titreFlitre}>
                <Box size={18} />
                Capacité (Litres)
              </h3>
              <div className={styles.listeFiltresContextuels}>
                {MOCK_CAPACITES.map(cap => (
                  <label key={cap} className={styles.filterLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.customCheckbox}
                      checked={selectedCapacites.includes(cap)}
                      onChange={() => toggleFilter(setSelectedCapacites, cap)}
                    />
                    <span>{cap}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* TYPE DE FROID (Visual Mock) */}
            <div className={styles.bloc}>
              <h3 className={styles.titreFlitre}>
                <Thermometer size={18} />
                Type de Froid
              </h3>
              <div className={styles.listeFiltresContextuels}>
                {MOCK_TYPES_FROID.map(type => (
                  <label key={type} className={styles.filterLabel}>
                    <input 
                      type="checkbox" 
                      className={styles.customCheckbox}
                      checked={selectedTypesFroid.includes(type)}
                      onChange={() => toggleFilter(setSelectedTypesFroid, type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PROMOTION (Toggle) */}
            <div className={styles.bloc}>
              <h3 className={styles.titreFlitre}>
                <Tag size={18} />
                Offres Spéciales
              </h3>
              <label className={styles.filterLabel} style={{ justifyContent: 'space-between', width: '100%' }}>
                <span>Produits en promotion</span>
                <input 
                  type="checkbox" 
                  className={styles.toggleSwitch} 
                  checked={filtres.promotion} 
                  onChange={e => appliquerFiltre('promotion', e.target.checked)} 
                />
              </label>
            </div>

            <button className={styles.btnReinit} onClick={reinitialiser} style={{ marginTop: '8px' }}>
              Effacer les filtres
            </button>
          </aside>

          {/* ── CONTENU PRINCIPAL ── */}
          <div className={styles.contenu}>
            
            {/* TOP BAR LAYOUT */}
            <div className={styles.topBarLayout}>
              <div className={styles.breadcrumbArea}>
                <Breadcrumb items={[
                  { label: 'Catalogue', to: currentCategory ? '/catalogue' : null },
                  ...(currentCategory ? [{ label: currentCategory.nom }] : [])
                ]} />
              </div>
              
              <div className={styles.layoutOptions}>
                <div className={styles.afficherText}>
                  Afficher : 
                  {[9, 12, 18, 24].map(num => (
                    <span 
                      key={num} 
                      className={filtres.limite === num ? styles.afficherActive : ''}
                      onClick={() => appliquerFiltre('limite', num)}
                    >
                      {num}
                    </span>
                  ))}
                </div>
                
                <div className={styles.gridIcons}>
                  <Grid2x2 size={20} className={gridLayout === 'grid-2' ? styles.gridActive : ''} onClick={() => setGridLayout('grid-2')} />
                  <Grid3x3 size={20} className={gridLayout === 'grid-3' ? styles.gridActive : ''} onClick={() => setGridLayout('grid-3')} />
                  <LayoutGrid size={20} className={gridLayout === 'grid-4' ? styles.gridActive : ''} onClick={() => setGridLayout('grid-4')} />
                </div>

                <select value={filtres.tri} onChange={e => appliquerFiltre('tri', e.target.value)} className={styles.selectTri}>
                  <option value="">Tri par défaut</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* GRILLE PRODUITS */}
            {erreur ? (
              <div className={styles.etatCentre}>
                <p className={styles.erreur}>Erreur : {erreur}</p>
              </div>
            ) : loading ? (
              <div className={styles.grille} style={{ gridTemplateColumns: gridLayout === 'grid-4' ? 'repeat(4, 1fr)' : gridLayout === 'grid-2' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)' }}>
                {[...Array(filtres.limite)].map((_, i) => (
                  <div key={i} className={styles.skeletonCarte} />
                ))}
              </div>
            ) : produits.length === 0 ? (
              <div className={styles.etatCentre}>
                <p className={styles.vide}>Aucun produit ne correspond à vos critères.</p>
                <button className={styles.btnReinit} onClick={reinitialiser}>Effacer les filtres</button>
              </div>
            ) : (
              <div className={styles.grille} style={{ gridTemplateColumns: gridLayout === 'grid-4' ? 'repeat(4, 1fr)' : gridLayout === 'grid-2' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)' }}>
                {produits.map(p => <CarteProduit key={p.id} produit={p} />)}
              </div>
            )}

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.btnPage}
                  disabled={filtres.page === 1}
                  onClick={() => appliquerFiltre('page', filtres.page - 1)}
                >
                  Précédent
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={filtres.page === i + 1 ? styles.btnPageActif : styles.btnPage}
                    onClick={() => appliquerFiltre('page', i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className={styles.btnPage}
                  disabled={filtres.page === totalPages}
                  onClick={() => appliquerFiltre('page', filtres.page + 1)}
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
