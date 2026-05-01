// src/hooks/useMagasin.js
import { useState, useEffect } from 'react';
import { getMagasin } from '../api/api';

export function useMagasin() {
  const [magasin, setMagasin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getMagasin()
      .then(data => setMagasin(data))
      .catch(err => setErreur(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { magasin, loading, erreur };
}
