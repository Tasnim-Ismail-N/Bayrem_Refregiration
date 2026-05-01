// src/pages/Contact/Contact.jsx
import { useMagasin } from '../../hooks/useMagasin';
import styles from './Contact.module.css';

export default function Contact() {
  const { magasin, loading, erreur } = useMagasin();

  if (loading) return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.skeleton} />
      </div>
    </main>
  );

  if (erreur || !magasin) return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.erreur}>Impossible de charger les informations du magasin.</p>
      </div>
    </main>
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.titrePage}>Contact & Localisation</h1>

        <div className={styles.disposition}>
          {/* ── Infos contact ── */}
          <div className={styles.infos}>
            <h2 className={styles.nomMagasin}>{magasin.nom}</h2>

            <ul className={styles.listeInfos}>
              <li className={styles.infoItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icone}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <p className={styles.infoLabel}>Adresse</p>
                  <p className={styles.infoValeur}>{magasin.adresse}</p>
                </div>
              </li>

              <li className={styles.infoItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icone}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div>
                  <p className={styles.infoLabel}>Téléphone</p>
                  <a href={`tel:${magasin.telephone1.replace(/\s/g, '')}`} className={styles.lienTel}>
                    {magasin.telephone1}
                  </a>
                  {magasin.telephone2 && (
                    <a href={`tel:${magasin.telephone2.replace(/\s/g, '')}`} className={styles.lienTel}>
                      {magasin.telephone2}
                    </a>
                  )}
                </div>
              </li>

              <li className={styles.infoItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icone}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <a href={`mailto:${magasin.email}`} className={styles.lienEmail}>
                    {magasin.email}
                  </a>
                </div>
              </li>

              <li className={styles.infoItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icone}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <p className={styles.infoLabel}>Horaires</p>
                  <p className={styles.infoValeur}>Lun – Sam : 8h00 – 18h00</p>
                  <p className={styles.infoValeur}>Dimanche : Fermé</p>
                </div>
              </li>
            </ul>

            <a
              href={magasin.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnMaps}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Ouvrir dans Google Maps
            </a>
          </div>

          {/* ── Carte Google Maps ── */}
          <div className={styles.carteWrapper}>
            <iframe
              title="Localisation Bayrem Réfrigération"
              className={styles.iframe}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${magasin.latitude},${magasin.longitude}&z=15&output=embed`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
