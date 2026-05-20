// src/components/ui/Breadcrumb.jsx
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Chemin de navigation">
      <ol className={styles.list}>
        <li className={styles.item}>
          <NavLink to="/" className={styles.link}>
            Accueil
          </NavLink>
        </li>

        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <ChevronRight size={14} className={styles.separator} />
            {item.to ? (
              <NavLink to={item.to} className={styles.link}>
                {item.label}
              </NavLink>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
