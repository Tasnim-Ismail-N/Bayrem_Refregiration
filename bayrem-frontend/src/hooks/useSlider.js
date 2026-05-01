// src/hooks/useSlider.js
import { useState, useEffect } from 'react';
import { getSlider } from '../api/api';

export function useSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getSlider()
      .then(data => setSlides(data))
      .catch(err => setErreur(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { slides, loading, erreur };
}
