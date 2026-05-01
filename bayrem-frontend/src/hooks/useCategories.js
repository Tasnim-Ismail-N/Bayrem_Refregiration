// src/hooks/useCategories.js
import { useState, useEffect } from 'react';
import { getCategories } from '../api/api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .catch(err => setErreur(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, erreur };
}
