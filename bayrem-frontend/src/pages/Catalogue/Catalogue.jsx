// src/pages/Catalogue/Catalogue.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProduits } from '../../hooks/useProduits';
import { useCategories } from '../../hooks/useCategories';
import CarteProduit from '../../components/CarteProduit/CarteProduit';
import Breadcrumb from '../../components/ui/Breadcrumb';
import styles from './Catalogue.module.css';

const LIMITE = 12;

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filtres, setFiltres] = useState({
    search:      searchParams.get('search')      || '',
    categorieId: searchParams.get('categorieId') ? Number(searchParams.get('categorieId')) : '',
    prixMin:     searchParams.get('prixMin')     || '',
    prixMax:     searchParams.get('prixMax')     || '',
    promotion:   searchParams.get('promotion') === 'true',
    tri:         searchParams.get('tri')         || '',
    page:        Number(searchParams.get('page')) || 1,
    limite:      LIMITE,
  });

  const [recherche, setRecherche] = useState(filtres.search);

  const { produits, loading, erreur, total } = useProduits(
    Object.fromEntries(
      Object.entries(filtres).filter(([k, v]) => {
        // Garder prixMin et prixMax seulement s'ils ont une valeur valide
        if (k === 'prixMin' || k === 'prixMax') {
          return v !== '' && v !== null && v !== undefined && v !== 0;
        }
        return v !== '' && v !== false;
      })
    )
  );

  const { categories } = useCategories();

  const totalPages = Math.ceil(total / LIMITE);

  useEffect(() => {
    const params = {};
    if (filtres.search)      params.search      = filtres.search;
    if (filtres.categorieId) params.categorieId = filtres.categorieId;
    // Correction: vérifier que les valeurs ne sont pas vides et valides
    if (filtres.prixMin !== '' && filtres.prixMin !== null && filtres.prixMin !== undefined)     params.prixMin     = filtres.prixMin;
    if (filtres.prixMax !== '' && filtres.prixMax !== null && filtres.prixMax !== undefined)     params.prixMax     = filtres.prixMax;
    if (filtres.promotion)   params.promotion   = 'true';
    if (filtres.tri)         params.tri         = filtres.tri;
    if (filtres.page > 1)    params.page        = filtres.page;
    setSearchParams(params);
  }, [filtres]);

  const appliquerFiltre = (cle, valeur) => {
    setFiltres(prev => ({ ...prev, [cle]: valeur, page: 1 }));
  };

  const lancerRecherche = () => appliquerFiltre('search', recherche);

  const reinitialiser = () => {
    setRecherche('');
    setFiltres({ search: '', categorieId: '', prixMin: '', prixMax: '', promotion: false, tri: '', page: 1, limite: LIMITE });
  };

  return (
    <main className={styles.page}>
      <Helmet>
        <title>Catalogue Produits — Bayrem Réfrigération</title>
        <meta name="description" content="Découvrez notre gamme complète d'équipements réfrigérés professionnels : armoires, comptoirs, congélateurs et bien plus." />
      </Helmet>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Catalogue', to: '/produits' }]} />
        <h1 className={styles.titrePage}>Catalogue Produits</h1>

        <div className={styles.disposition}>
          {/* ── Sidebar filtres ── */}
          <aside className={styles.sidebar}>
            {/* Recherche */}
            <div className={styles.bloc}>
              <h3 className={styles.titreFlitre}>Recherche</h3>
              <div className={styles.champRecherche}>
                <input
                  type="text"
                  placeholder="Nom du produit..."
                  value={recherche}
                  onChange={e => setRecherche(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && lancerRecherche()}
                  className={styles.input}
                />
                <button className={styles.btnRecherche} onClick={lancerRecherche}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
              </div>
            </div>

            {/* Catégories */}
            <div className={styles.bloc}>
              <h3 className={styles.titreFlitre}>Catégorie</h3>
              <ul className={styles.listeCategories}>
                <li>
                  <button
                    className={!filtres.categorieId ? styles.categorieActive : styles.categorieBtn}
                    onClick={() => appliquerFiltre('categorieId', '')}
                  >
                    Toutes les catégories
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={filtres.categorieId === cat.id ? styles.categorieActive : styles.categorieBtn}
                      onClick={() => appliquerFiltre('categorieId', cat.id)}
                    >
                      {cat.nom}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prix */}
            <div className={styles.bloc}>
              <h3 className={styles.titreFlitre}>Prix (milliers DT)</h3>
              <div className={styles.rangePrix}>
                <input
                  type="number"
                  placeholder="Ex: 75"
                  value={filtres.prixMin}
                  onChange={e => appliquerFiltre('prixMin', e.target.value)}
                  className={styles.inputPrix}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Ex: 150"
                  value={filtres.prixMax}
                  onChange={e => appliquerFiltre('prixMax', e.target.value)}
                  className={styles.inputPrix}
                />
              </div>
            </div>

            {/* Promotion */}
            <div className={styles.bloc}>
              <label className={styles.labelToggle}>
                <input
                  type="checkbox"
                  checked={filtres.promotion}
                  onChange={e => appliquerFiltre('promotion', e.target.checked)}
                  className={styles.checkbox}
                />
                Promotions uniquement
              </label>
            </div>

            <button className={styles.btnReinit} onClick={reinitialiser}>
              Réinitialiser les filtres
            </button>
          </aside>

          {/* ── Contenu principal ── */}
          <div className={styles.contenu}>
            {/* Barre de tri + résultats */}
            <div className={styles.barreOutils}>
              <p className={styles.nbResultats}>
                {loading ? '...' : `${total} produit${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
              </p>
              <select
                value={filtres.tri}
                onChange={e => appliquerFiltre('tri', e.target.value)}
                className={styles.selectTri}
              >
                <option value="">Trier par défaut</option>
                <option value="prix_asc">Prix croissant</option>
                <option value="prix_desc">Prix décroissant</option>
              </select>
            </div>

            {/* Grille produits */}
            {erreur ? (
              <div className={styles.etatCentre}>
                <p className={styles.erreur}>Erreur : {erreur}</p>
              </div>
            ) : loading ? (
              <div className={styles.grille}>
                {[...Array(LIMITE)].map((_, i) => (
                  <div key={i} className={styles.skeletonCarte} />
                ))}
              </div>
            ) : produits.length === 0 ? (
              <div className={styles.etatCentre}>
                <p className={styles.vide}>Aucun produit ne correspond à votre recherche.</p>
                <button className={styles.btnReinit} onClick={reinitialiser}>Effacer les filtres</button>
              </div>
            ) : (
              <div className={styles.grille}>
                {produits.map(p => <CarteProduit key={p.id} produit={p} />)}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.btnPage}
                  disabled={filtres.page === 1}
                  onClick={() => appliquerFiltre('page', filtres.page - 1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
