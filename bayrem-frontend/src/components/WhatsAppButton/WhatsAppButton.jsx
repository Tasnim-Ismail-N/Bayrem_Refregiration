// src/components/WhatsAppButton/WhatsAppButton.jsx
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useProduitDetail } from '../../hooks/useProduitDetail';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  const location = useLocation();
  const isProductPage = /^\/produits\/\d+$/.test(location.pathname);
  const produitId = isProductPage ? location.pathname.split('/').pop() : null;
  const { produit } = useProduitDetail(produitId);

  const getMessage = () => {
    if (produit && /^\/produits\/\d+$/.test(location.pathname)) {
      return `Bonjour Bayrem Réfrigération, j'aimerais plus d'infos sur le produit : ${produit.nom}`;
    }
    return 'Bonjour Bayrem Réfrigération, j\'aimerais des informations sur vos produits réfrigérés.';
  };

  const whatsappUrl = `https://wa.me/21322465343?text=${encodeURIComponent(getMessage())}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      title="Nous contacter sur WhatsApp"
      aria-label="Ouvrir WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
