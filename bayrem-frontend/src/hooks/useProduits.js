// src/hooks/useProduits.js
import { useState, useEffect } from 'react';
import { getProduits } from '../api/api';

export function useProduits(params = {}) {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    setErreur(null);
    getProduits(params)
      .then(data => { setProduits(data.produits); setTotal(data.total); })
      .catch(err => setErreur(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(params)]);

  return { produits, loading, erreur, total };
}
