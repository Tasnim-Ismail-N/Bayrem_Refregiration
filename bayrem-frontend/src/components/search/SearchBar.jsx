// src/components/search/SearchBar.jsx
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useProduits } from '../../hooks/useProduits';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  // Récupérer les résultats
  const { produits } = useProduits(
    debouncedQuery.length >= 2 ? { search: debouncedQuery, limite: 5 } : {}
  );

  // Focus l'input au ouverture
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Fermer au Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSelectProduct = (id) => {
    navigate(`/produits/${id}`);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container} ref={containerRef}>
        {/* Input */}
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un produit..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
            autoComplete="off"
          />
          {query && (
            <button
              className={styles.btnClear}
              onClick={() => setQuery('')}
              aria-label="Effacer"
            >
              <X size={20} />
            </button>
          )}
          <button className={styles.btnClose} onClick={onClose} aria-label="Fermer">
            <X size={24} />
          </button>
        </div>

        {/* Résultats */}
        {query.length >= 2 ? (
          <div className={styles.results}>
            {produits.length > 0 ? (
              <ul className={styles.resultsList}>
                {produits.map(produit => (
                  <li key={produit.id}>
                    <button
                      className={styles.resultItem}
                      onClick={() => handleSelectProduct(produit.id)}
                    >
                      <img
                        src={produit.imageUrl}
                        alt={produit.nom}
                        className={styles.resultImage}
                        loading="lazy"
                      />
                      <div className={styles.resultInfo}>
                        <p className={styles.resultNom}>{produit.nom}</p>
                        <p className={styles.resultCategorie}>
                          {produit.categorieId === 1 && 'Armoires réfrigérées'}
                          {produit.categorieId === 2 && 'Comptoirs réfrigérés'}
                          {produit.categorieId === 3 && 'Congélateurs'}
                          {produit.categorieId === 4 && 'Équipements de cuisine'}
                        </p>
                      </div>
                      {produit.estEnPromotion && (
                        <span className={styles.badgePromo}>Promo</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.noResults}>
                <p>Aucun produit trouvé pour « {query} »</p>
              </div>
            )}
          </div>
        ) : query.length > 0 && query.length < 2 ? (
          <div className={styles.hint}>
            <p>Tapez au moins 2 caractères pour rechercher</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
