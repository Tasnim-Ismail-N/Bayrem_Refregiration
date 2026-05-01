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
  if (USE_MOCK) { await delay(200); return sliderMock; }
  const res = await fetch(`${BASE_URL}/slider`);
  if (!res.ok) throw new Error('Erreur serveur');
  return res.json();
};

// ── Produits ────────────────────────────────────────────
export const getProduits = async (params = {}) => {
  if (USE_MOCK) {
    await delay(300);
    let data = [...produitsMock];
    if (params.search) data = data.filter(p => p.nom.toLowerCase().includes(params.search.toLowerCase()));
    if (params.categorieId) data = data.filter(p => p.categorieId === params.categorieId);
    if (params.promotion) data = data.filter(p => p.estEnPromotion);
    if (params.tri === 'prix_asc') data.sort((a, b) => a.prix - b.prix);
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