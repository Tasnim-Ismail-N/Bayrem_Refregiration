// src/hooks/useProduitsVedette.js
import { useState, useEffect } from 'react';
import { getProduitsVedette } from '../api/api';

export function useProduitsVedette() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getProduitsVedette()
      .then(data => setProduits(data))
      .catch(err => setErreur(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { produits, loading, erreur };
}
