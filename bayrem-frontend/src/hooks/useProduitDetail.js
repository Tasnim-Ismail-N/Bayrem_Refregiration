// src/hooks/useProduitDetail.js
import { useState, useEffect } from 'react';
import { getProduitById } from '../api/api';

export function useProduitDetail(id) {
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErreur(null);
    getProduitById(id)
      .then(data => setProduit(data))
      .catch(err => setErreur(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { produit, loading, erreur };
}
