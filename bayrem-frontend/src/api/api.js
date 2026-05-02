// src/api/api.js — NE PAS MODIFIER SAUF USE_MOCK
import { sliderMock } from '../mocks/slider.mock';
import { produitsMock } from '../mocks/produits.mock';
import { categoriesMock } from '../mocks/categories.mock';
import { magasinMock } from '../mocks/magasin.mock';

// ═══════════════════════════════════════════════════════
// 🔑  CHANGER ICI LE JOUR J  (true → false)
const USE_MOCK = true;
// ═══════════════════════════════════════════════════════

const BASE_URL = 'http://localhost:8080/api';
const delay = (ms) => new Promise(r => setTimeout(r, ms));
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

// ── Slider ──────────────────────────────────────────────
export const getSlider = async () => {
  if (USE_MOCK) { 
    await delay(200); 
    return [...sliderMock].sort((a, b) => a.ordre - b.ordre); 
  }
  const res = await fetch(`${BASE_URL}/slider`);
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

// ── Produits ────────────────────────────────────────────
export const getProduits = async (params = {}) => {
  if (USE_MOCK) {
    await delay(300);
    let data = [...produitsMock];
    if (params.search)      data = data.filter(p => p.nom.toLowerCase().includes(params.search.toLowerCase()));
    if (params.categorieId) data = data.filter(p => p.categorieId === Number(params.categorieId));
    // Conversion: l'utilisateur entre des valeurs comme 75 pour 75000 DT
    // Comparer avec le prix promo si disponible, sinon le prix normal
    if (params.prixMin !== undefined && params.prixMin !== '' && params.prixMin !== null) {
      const min = Number(params.prixMin) * 1000;
      if (!isNaN(min)) data = data.filter(p => {
        const prixAComparer = p.estEnPromotion && p.prixPromo ? p.prixPromo : p.prix;
        return prixAComparer >= min;
      });
    }
    if (params.prixMax !== undefined && params.prixMax !== '' && params.prixMax !== null) {
      const max = Number(params.prixMax) * 1000;
      if (!isNaN(max)) data = data.filter(p => {
        const prixAComparer = p.estEnPromotion && p.prixPromo ? p.prixPromo : p.prix;
        return prixAComparer <= max;
      });
    }
    if (params.promotion)   data = data.filter(p => p.estEnPromotion);
    if (params.tri === 'prix_asc')  data.sort((a, b) => a.prix - b.prix);
    if (params.tri === 'prix_desc') data.sort((a, b) => b.prix - a.prix);
    const page = params.page || 1; const limite = params.limite || 12;
    return { total: data.length, page, limite, produits: data.slice((page-1)*limite, page*limite) };
  }
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/produits?${query}`);
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

export const getProduitById = async (id) => {
  if (USE_MOCK) { await delay(200); return produitsMock.find(p => p.id === +id); }
  const res = await fetch(`${BASE_URL}/produits/${id}`);
  if (!res.ok) throw new Error('Produit introuvable');
  return res.json();
};

export const getProduitsVedette = async () => {
  if (USE_MOCK) { await delay(150); return produitsMock.filter(p => p.estEnPromotion).slice(0,8); }
  const res = await fetch(`${BASE_URL}/produits/vedette`);
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

// ── Catégories ──────────────────────────────────────────
export const getCategories = async () => {
  if (USE_MOCK) { await delay(100); return categoriesMock; }
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

// ── Magasin ──────────────────────────────────────────────
export const getMagasin = async () => {
  if (USE_MOCK) { await delay(100); return magasinMock; }
  const res = await fetch(`${BASE_URL}/magasin/info`);
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

// ── Auth Admin ───────────────────────────────────────────
export const login = async (email, motDePasse) => {
  if (USE_MOCK) {
    await delay(500);
    if (email === 'admin@bayrem.com' && motDePasse === 'admin123')
      return { token: 'mock-jwt-token', role: 'ADMIN', nom: 'Administrateur' };
    throw new Error('Email ou mot de passe incorrect');
  }
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse })
  });
  if (!res.ok) throw new Error('Email ou mot de passe incorrect');
  return res.json();
};

// ── Admin — Produits ─────────────────────────────────────
export const adminGetProduits = async () => {
  if (USE_MOCK) { await delay(200); return { total: produitsMock.length, produits: produitsMock }; }
  const res = await fetch(`${BASE_URL}/admin/produits`, { headers: authHeader() });
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

export const adminAddProduit = async (formData) => {
  if (USE_MOCK) {
    await delay(400);
    // Extraire les données du FormData correctement
    const data = {
      nom: formData.get('nom'),
      prix: formData.get('prix'),
      prixPromo: formData.get('prixPromo'),
      categorieId: formData.get('categorieId'),
      description: formData.get('description'),
    };
    
    // Calculer le prix promo basé sur le pourcentage
    const prix = Number(data.prix) || 0;
    const prixPromo = Number(data.prixPromo) || 0;
    const estEnPromotion = prixPromo > 0;
    const pourcentagePromo = estEnPromotion && prix > 0 ? Math.round(((prix - prixPromo) / prix) * 100) : null;
    
    // Créer le nouveau produit
    const newId = Math.max(...produitsMock.map(p => p.id)) + 1;
    const newProduit = {
      id: newId,
      nom: data.nom || 'Nouveau produit',
      prix: prix,
      prixPromo: prixPromo,
      pourcentagePromo: pourcentagePromo,
      description: data.description || '',
      categorieId: Number(data.categorieId) || 1,
      categorie: categoriesMock.find(c => c.id === Number(data.categorieId))?.nom || 'Non catégorisé',
      estEnPromotion: estEnPromotion,
      imageUrl: 'https://via.placeholder.com/150',
      estEnStock: true,
    };
    
    // Ajouter au mock
    produitsMock.push(newProduit);
    
    return { id: newId, message: 'Produit créé avec succès', produit: newProduit };
  }
  const res = await fetch(`${BASE_URL}/admin/produits`, {
    method: 'POST', headers: authHeader(), body: formData,
  });
  if (!res.ok) throw new Error('Erreur lors de la création');
  return res.json();
};

export const adminUpdateProduit = async (id, formData) => {
  if (USE_MOCK) {
    await delay(400);
    // Extraire les données du FormData correctement
    const data = {
      nom: formData.get('nom'),
      prix: formData.get('prix'),
      prixPromo: formData.get('prixPromo'),
      categorieId: formData.get('categorieId'),
      description: formData.get('description'),
    };
    
    // Calculer le prix promo et le pourcentage
    const prix = Number(data.prix) || 0;
    const prixPromo = Number(data.prixPromo) || 0;
    const estEnPromotion = prixPromo > 0;
    const pourcentagePromo = estEnPromotion && prix > 0 ? Math.round(((prix - prixPromo) / prix) * 100) : null;
    
    // Mettre à jour le produit dans le mock
    const index = produitsMock.findIndex(p => p.id === id);
    if (index !== -1) {
      produitsMock[index] = {
        ...produitsMock[index],
        nom: data.nom || produitsMock[index].nom,
        prix: prix || produitsMock[index].prix,
        prixPromo: prixPromo,
        pourcentagePromo: pourcentagePromo,
        description: data.description || produitsMock[index].description,
        categorieId: Number(data.categorieId) || produitsMock[index].categorieId,
        categorie: categoriesMock.find(c => c.id === Number(data.categorieId))?.nom || produitsMock[index].categorie,
        estEnPromotion: estEnPromotion,
      };
    }
    
    return { message: 'Produit mis à jour avec succès' };
  }
  const res = await fetch(`${BASE_URL}/admin/produits/${id}`, {
    method: 'PUT', headers: authHeader(), body: formData,
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour');
  return res.json();
};

export const adminDeleteProduit = async (id) => {
  if (USE_MOCK) { await delay(300); return { message: 'Produit supprimé avec succès' }; }
  const res = await fetch(`${BASE_URL}/admin/produits/${id}`, {
    method: 'DELETE', headers: authHeader(),
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
};

// ── Admin — Slider ───────────────────────────────────────
export const adminAddSlide = async (formData) => {
  if (USE_MOCK) {
    await delay(300);
    const newId = Math.max(...sliderMock.map(s => s.id)) + 1;
    const newSlide = {
      id: newId,
      titre: formData.get('titre') || '',
      sousTitre: formData.get('sousTitre') || '',
      ordre: Number(formData.get('ordre')) || 1,
      imageUrl: 'https://via.placeholder.com/1200x400'
    };
    sliderMock.push(newSlide);
    return { id: newId, message: 'Slide ajouté avec succès', slide: newSlide };
  }
  const res = await fetch(`${BASE_URL}/admin/slider`, {
    method: 'POST', headers: authHeader(),
    body: formData,
  });
  if (!res.ok) throw new Error('Erreur lors de l\'ajout');
  return res.json();
};

export const adminUpdateSlide = async (id, formData) => {
  if (USE_MOCK) {
    await delay(300);
    const index = sliderMock.findIndex(s => s.id === id);
    if (index !== -1) {
      sliderMock[index] = {
        ...sliderMock[index],
        titre: formData.get('titre') !== null ? formData.get('titre') : sliderMock[index].titre,
        sousTitre: formData.get('sousTitre') !== null ? formData.get('sousTitre') : sliderMock[index].sousTitre,
        ordre: formData.get('ordre') !== null ? Number(formData.get('ordre')) : sliderMock[index].ordre,
      };
    }
    return { message: 'Slide mis à jour avec succès' };
  }
  const res = await fetch(`${BASE_URL}/admin/slider/${id}`, {
    method: 'PUT', headers: authHeader(),
    body: formData,
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour');
  return res.json();
};

export const adminDeleteSlide = async (id) => {
  if (USE_MOCK) { 
    await delay(300); 
    const index = sliderMock.findIndex(s => s.id === id);
    if (index !== -1) {
      const deletedOrdre = sliderMock[index].ordre;
      sliderMock.splice(index, 1);
      // Décaler l'ordre des slides suivants
      sliderMock.forEach(s => {
        if (s.ordre > deletedOrdre) {
          s.ordre -= 1;
        }
      });
    }
    return { message: 'Slide supprimé avec succès' }; 
  }
  const res = await fetch(`${BASE_URL}/admin/slider/${id}`, {
    method: 'DELETE', headers: authHeader(),
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
};

// ── Admin — Catégories ───────────────────────────────────
export const adminGetCategories = async () => {
  if (USE_MOCK) { await delay(150); return categoriesMock; }
  const res = await fetch(`${BASE_URL}/admin/categories`, { headers: authHeader() });
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

export const adminAddCategorie = async (data) => {
  if (USE_MOCK) {
    await delay(300);
    const newId = Math.max(...categoriesMock.map(c => c.id)) + 1;
    return { id: newId, message: 'Catégorie ajoutée avec succès' };
  }
  const res = await fetch(`${BASE_URL}/admin/categories`, {
    method: 'POST', headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de l\'ajout');
  return res.json();
};

export const adminUpdateCategorie = async (id, data) => {
  if (USE_MOCK) { await delay(300); return { message: 'Catégorie mise à jour avec succès' }; }
  const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
    method: 'PUT', headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour');
  return res.json();
};

export const adminDeleteCategorie = async (id) => {
  if (USE_MOCK) { await delay(300); return { message: 'Catégorie supprimée avec succès' }; }
  const res = await fetch(`${BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE', headers: authHeader(),
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
};