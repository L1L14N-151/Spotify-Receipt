import React from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './SupermarketReceipt.module.css';

interface SupermarketReceiptProps {
  receipt: ReceiptModel;
}

const SupermarketReceipt: React.FC<SupermarketReceiptProps> = ({ receipt }) => {
  const theme = receipt.theme;
  const date = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Format price with proper French formatting
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };

  // Format duration in minutes
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate totals with real Spotify rate (0.003$ = ~0.0028€ per stream)
  const pricePerStream = 0.003 * 0.93; // Convert $ to € (approximate rate)
  let subtotal = 0;
  const items = receipt.items.map(track => {
    const playCount = track.playCount || 1;
    const price = playCount * pricePerStream;
    subtotal += price;
    return { ...track, playCount, price };
  });

  const total = subtotal;

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.header}>
          <div className={styles.logo}>SPOTIFY MARKET</div>
          <div className={styles.storeName}>Votre Supermarché Musical</div>
          <div className={styles.address}>
            Avenue des Playlists<br/>
            75001 PARIS<br/>
            www.spotify.com<br/>
            Service Client: 0 805 08 1234
          </div>
        </div>

        <div className={styles.divider}>****************************************</div>

        <div className={styles.info}>
          <div className={styles.infoLine}>
            <span>Date: {dateStr}</span>
            <span>{timeStr}</span>
          </div>
          <div className={styles.infoLine}>
            <span>Caisse: 003</span>
            <span>Ticket: {receipt.metadata.receiptNumber}</span>
          </div>
          <div className={styles.infoLine}>
            <span>Vendeur: DJ ALGORITHME</span>
          </div>
        </div>

        <div className={styles.divider}>----------------------------------------</div>

        <div className={styles.items}>
          {items.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemName}>{item.name?.toUpperCase() || 'TITRE INCONNU'}</span>
                <span className={styles.itemPrice}>{formatPrice(item.price)} €</span>
              </div>
              <div className={styles.itemDetail}>
                {item.artists ? item.artists.map(a => a.name).join(', ') : 'Artiste inconnu'}
              </div>
              <div className={styles.itemDetail}>
                {item.playCount} stream{item.playCount > 1 ? 's' : ''} x 0,003$ = {formatPrice(item.price)} €
              </div>
              {item.duration_ms && (
                <div className={styles.itemDetail}>
                  Durée: {formatDuration(item.duration_ms)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.divider}>========================================</div>

        <div className={styles.totals}>
          <div className={styles.totalLine}>
            <span>{items.length} TITRE{items.length > 1 ? 'S' : ''}</span>
            <span></span>
          </div>
          <div className={styles.totalLine}>
            <span>TOTAL STREAMS: {items.reduce((sum, item) => sum + item.playCount, 0)}</span>
            <span></span>
          </div>
          <div className={styles.totalLineBold}>
            <span>TOTAL PAYOUT</span>
            <span>{formatPrice(total)} €</span>
          </div>
          <div className={styles.totalLine} style={{marginTop: '10px', fontSize: '10px', color: '#666'}}>
            <span>Coût abonnement mensuel</span>
            <span>9,99 €</span>
          </div>
          <div className={styles.totalLine} style={{fontSize: '10px', color: '#666'}}>
            <span>Économies vs achat CD</span>
            <span>-{(items.length * 15 - 9.99).toFixed(2)} €</span>
          </div>
        </div>

        <div className={styles.divider}>----------------------------------------</div>

        <div className={styles.payment}>
          <div className={styles.paymentLine}>
            <span>PAIEMENT SPOTIFY PREMIUM</span>
            <span>{formatPrice(total)} €</span>
          </div>
          <div className={styles.paymentDetail}>
            Abonnement Premium Family<br/>
            ID: {receipt.metadata.userId || 'USER123456'}<br/>
            Débit automatique mensuel
          </div>
        </div>

        <div className={styles.divider}>----------------------------------------</div>

        <div className={styles.footer}>
          <RickrollQRCode className={styles.qrCode} size={65} />
          <div className={styles.footerText}>
            SPO-{Date.now().toString().slice(-10)}
          </div>
          <div className={styles.thanks}>
            MERCI D'ÉCOUTER SUR SPOTIFY<br/>
            KEEP STREAMING!
          </div>
          <div className={styles.loyalty}>
            Minutes écoutées ce mois: {Math.floor(items.reduce((sum, item) => sum + (item.duration_ms || 0) * item.playCount / 60000, 0))}<br/>
            Wrapped Points: {Math.floor(total * 1000)}
          </div>
        </div>

        <div className={styles.divider}>========================================</div>

        <div className={styles.legal}>
          Spotify Technology S.A.<br/>
          42-44 avenue de la Gare, L-1610 Luxembourg<br/>
          RCS Luxembourg: B 123.052
        </div>

        <div className={styles.eco}>
          🎵 Économisez des données<br/>
          Téléchargez vos titres préférés
        </div>

        <div className={styles.disclaimer}>
          * SIMULATION BASÉE SUR VOS VRAIES DONNÉES *<br/>
          * {receipt.metadata.timeRangeLabel?.toUpperCase()} *<br/>
          * TARIF RÉEL: 0,003$/STREAM *
        </div>
      </div>
    </div>
  );
};

export default SupermarketReceipt;