// src/pages/admin/Login/AdminLogin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../api/api';
import logo from '../../../assets/logo.jpg';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/admin/dashboard', { replace: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const data = await login(form.email, form.motDePasse);
      localStorage.setItem('token', data.token);
      localStorage.setItem('adminNom', data.nom);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.carte}>
        <div className={styles.entete}>
          <img src={logo} alt="Bayrem Réfrigération" className={styles.logoImg} />
          <h1 className={styles.titre}>Espace Administrateur</h1>
          <p className={styles.sousTitre}>Bayrem Réfrigération</p>
        </div>

        <form className={styles.formulaire} onSubmit={handleSubmit}>
          <div className={styles.champGroupe}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@bayrem.com"
              className={styles.input}
              required
              autoFocus
            />
          </div>

          <div className={styles.champGroupe}>
            <label className={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={form.motDePasse}
              onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))}
              placeholder="Entrez votre mot de passe"
              className={styles.input}
              required
            />
          </div>

          {erreur && <p className={styles.erreur}>{erreur}</p>}

          <button type="submit" className={styles.btnConnexion} disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className={styles.hint}>Mode mock : admin@bayrem.com / admin123</p>
      </div>
    </main>
  );
}
