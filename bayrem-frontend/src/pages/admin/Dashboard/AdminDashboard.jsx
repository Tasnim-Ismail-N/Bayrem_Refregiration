// src/pages/admin/Dashboard/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';
import {
  adminGetProduits, adminDeleteProduit, adminAddProduit, adminUpdateProduit,
  adminGetCategories, adminDeleteCategorie,
  adminDeleteSlide, getSlider,
} from '../../../api/api';
import styles from './AdminDashboard.module.css';

const ONGLETS = ['Produits', 'Slider', 'Catégories'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const nom = localStorage.getItem('adminNom') || 'Admin';
  const [onglet, setOnglet] = useState('Produits');

  const [produits, setProduits]       = useState([]);
  const [slides, setSlides]           = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [message, setMessage]         = useState('');

  const [formulaire, setFormulaire]   = useState(null); // null | { mode: 'ajout'|'edit', data: {} }
  
  // État local pour le formulaire
  const [formValues, setFormValues]   = useState({
    prix: '',
    pourcentagePromo: '',
    estEnPromotion: false,
  });

  // Calculer le prix promo
  const calculerPrixPromo = () => {
    const prix = Number(formValues.prix) || 0;
    const pourcentage = Number(formValues.prixPromo) || 0;
    if (pourcentage > 0 && pourcentage <= 100) {
      return Math.round(prix * (1 - pourcentage / 100));
    }
    return null;
  };

  const prixPromoCalcule = calculerPrixPromo();
  const estEnPromotion = prixPromoCalcule !== null;

  const afficherMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const [resProduits, resSlides, resCat] = await Promise.all([
        adminGetProduits(),
        getSlider(),
        adminGetCategories(),
      ]);
      setProduits(resProduits.produits || resProduits);
      setSlides(resSlides);
      setCategories(resCat);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { chargerDonnees(); }, []);

  const deconnecter = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminNom');
    navigate('/admin/login');
  };

  const supprimerProduit = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await adminDeleteProduit(id);
    setProduits(prev => prev.filter(p => p.id !== id));
    afficherMessage('Produit supprimé.');
  };

  const supprimerSlide = async (id) => {
    if (!confirm('Supprimer ce slide ?')) return;
    await adminDeleteSlide(id);
    setSlides(prev => prev.filter(s => s.id !== id));
    afficherMessage('Slide supprimé.');
  };

  const supprimerCategorie = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await adminDeleteCategorie(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    afficherMessage('Catégorie supprimée.');
  };

  const soumettreFormulaire = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (formulaire.mode === 'ajout') {
        await adminAddProduit(fd);
        afficherMessage('Produit ajouté avec succès.');
      } else {
        await adminUpdateProduit(formulaire.data.id, fd);
        afficherMessage('Produit mis à jour avec succès.');
      }
      setFormulaire(null);
      chargerDonnees();
    } catch {
      afficherMessage('Erreur lors de l\'enregistrement.');
    }
  };

  return (
    <main className={styles.page}>
      {/* ── Header admin ── */}
      <header className={styles.header}>
        <div className={styles.headerGauche}>
          <img src={logo} alt="Bayrem Réfrigération" className={styles.logoImg} />
          <span className={styles.logoTexte}>Tableau de Bord</span>
        </div>
        <div className={styles.headerDroite}>
          <span className={styles.salut}>Bonjour, {nom}</span>
          <button className={styles.btnDeconnexion} onClick={deconnecter}>Déconnexion</button>
        </div>
      </header>

      <div className={styles.container}>
        {/* Message flash */}
        {message && <div className={styles.flash}>{message}</div>}

        {/* Onglets */}
        <div className={styles.onglets}>
          {ONGLETS.map(o => (
            <button
              key={o}
              className={onglet === o ? styles.ongletActif : styles.onglet}
              onClick={() => setOnglet(o)}
            >
              {o}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.skeleton} />
        ) : (
          <>
            {/* ══ PRODUITS ══ */}
            {onglet === 'Produits' && (
              <section>
                <div className={styles.barreSection}>
                  <h2 className={styles.titreSection}>Produits ({produits.length})</h2>
                  <button
                    className={styles.btnAjouter}
                    onClick={() => {
                      setFormulaire({ mode: 'ajout', data: {} });
                      setFormValues({ prix: '', pourcentagePromo: '', estEnPromotion: false });
                    }}
                  >
                    + Ajouter un produit
                  </button>
                </div>

                {formulaire && (
                  <form className={styles.formulaire} onSubmit={soumettreFormulaire}>
                    <h3 className={styles.titreForm}>
                      {formulaire.mode === 'ajout' ? 'Nouveau produit' : 'Modifier le produit'}
                    </h3>
                    <div className={styles.grilleForm}>
                      <div className={styles.champ}>
                        <label>Nom</label>
                        <input name="nom" defaultValue={formulaire.data.nom || ''} required className={styles.inputForm} />
                      </div>
                      <div className={styles.champ}>
                        <label>Prix (DT)</label>
                        <input 
                          name="prix" 
                          type="number" 
                          defaultValue={formulaire.data.prix || ''} 
                          required 
                          className={styles.inputForm}
                          onChange={(e) => setFormValues(prev => ({ ...prev, prix: e.target.value }))}
                        />
                      </div>
                      <div className={styles.champ}>
                        <label>Catégorie</label>
                        <select name="categorieId" defaultValue={formulaire.data.categorieId || ''} className={styles.inputForm}>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                      </div>
                      <div className={styles.champ}>
                        <label>Pourcentage promo (%)</label>
                        <input 
                          name="pourcentagePromo" 
                          type="number" 
                          min="0" 
                          max="100"
                          defaultValue={formulaire.data.prixPromo || formulaire.data.pourcentagePromo || ''} 
                          placeholder="Ex: 20 pour 20%"
                          className={styles.inputForm}
                          onChange={(e) => setFormValues(prev => ({ ...prev, pourcentagePromo: e.target.value }))}
                        />
                      </div>
                      {prixPromoCalcule && (
                        <div className={styles.champ}>
                          <label>Prix après promo</label>
                          <input 
                            name="prixPromo" 
                            type="number" 
                            value={prixPromoCalcule}
                            readOnly
                            className={styles.inputForm}
                          />
                        </div>
                      )}
                      <div className={`${styles.champ} ${styles.champLarge}`}>
                        <label>Description</label>
                        <textarea name="description" defaultValue={formulaire.data.description || ''} rows={3} className={styles.inputForm} />
                      </div>
                      <div className={styles.champ}>
                        <label>Image(s)</label>
                        <input name="images[]" type="file" multiple accept="image/*" className={styles.inputForm} />
                      </div>
                    </div>
                    <div className={styles.actionsForm}>
                      <button type="submit" className={styles.btnSauvegarder}>Sauvegarder</button>
                      <button type="button" className={styles.btnAnnuler} onClick={() => setFormulaire(null)}>Annuler</button>
                    </div>
                  </form>
                )}

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix</th>
                        <th>Promo</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produits.map(p => (
                        <tr key={p.id}>
                          <td><img src={p.imageUrl} alt={p.nom} className={styles.miniature} /></td>
                          <td className={styles.nomProduit}>{p.nom}</td>
                          <td>{p.categorie}</td>
                          <td>{p.prix.toLocaleString()} DT</td>
                          <td>{p.prixPromo ? <span className={styles.badgePromo}>{p.prixPromo.toLocaleString()} DT</span> : '—'}</td>
                          <td>
                            <div className={styles.actionsLigne}>
                              <button
                                className={styles.btnEditer}
                                onClick={() => {
                                setFormulaire({ mode: 'edit', data: p });
                                setFormValues({ 
                                  prix: p.prix || '', 
                                  pourcentagePromo: p.pourcentagePromo || p.prixPromo ? Math.round(((p.prix - (p.prixPromo || p.prix)) / p.prix) * 100) : '',
                                  estEnPromotion: p.estEnPromotion || false 
                                });
                              }}
                              >
                                Modifier
                              </button>
                              <button
                                className={styles.btnSupprimer}
                                onClick={() => supprimerProduit(p.id)}
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ══ SLIDER ══ */}
            {onglet === 'Slider' && (
              <section>
                <div className={styles.barreSection}>
                  <h2 className={styles.titreSection}>Slides ({slides.length})</h2>
                </div>
                <div className={styles.grilleSlides}>
                  {slides.map(s => (
                    <div key={s.id} className={styles.carteSlide}>
                      <img src={s.imageUrl} alt={s.titre} className={styles.imageSlide} />
                      <div className={styles.infoSlide}>
                        <p className={styles.titreSlide}>{s.titre || '(sans titre)'}</p>
                        <p className={styles.sousTitreSlide}>{s.sousTitre}</p>
                        <p className={styles.ordreSlide}>Ordre : {s.ordre}</p>
                      </div>
                      <button className={styles.btnSupprimer} onClick={() => supprimerSlide(s.id)}>
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ══ CATÉGORIES ══ */}
            {onglet === 'Catégories' && (
              <section>
                <div className={styles.barreSection}>
                  <h2 className={styles.titreSection}>Catégories ({categories.length})</h2>
                </div>
                <div className={styles.grilleCategories}>
                  {categories.map(c => (
                    <div key={c.id} className={styles.carteCategorie}>
                      <img src={c.iconeUrl} alt={c.nom} className={styles.iconeCategorie} />
                      <p className={styles.nomCategorie}>{c.nom}</p>
                      <button className={styles.btnSupprimer} onClick={() => supprimerCategorie(c.id)}>
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
