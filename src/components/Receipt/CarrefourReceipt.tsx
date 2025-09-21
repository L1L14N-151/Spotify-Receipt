import React from 'react';
import { SpotifyReceipt } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './CarrefourReceipt.module.css';

interface CarrefourReceiptProps {
  receipt: SpotifyReceipt;
}

const CarrefourReceipt: React.FC<CarrefourReceiptProps> = ({ receipt }) => {
  const tracks = receipt.items || [];
  const currentDate = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());

  // Calculate prices based on real streaming rate
  const STREAM_RATE = 0.003; // Real Spotify rate per stream
  const tracksWithPrices = tracks.map(track => ({
    ...track,
    unitPrice: STREAM_RATE,
    totalPrice: (track.playCount || 0) * STREAM_RATE
  }));

  const subtotal = tracksWithPrices.reduce((sum, track) => sum + track.totalPrice, 0);
  const totalStreams = tracks.reduce((sum, track) => sum + (track.playCount || 0), 0);

  // Format date DD/MM/YYYY HH:MM
  const dateStr = currentDate.toLocaleDateString('fr-FR');
  const timeStr = currentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <img
                src="https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Logo_Carrefour.svg/1178px-Logo_Carrefour.svg.png?20140607064500"
                alt="Carrefour"
                className={styles.logo}
              />
            </div>
            <div className={styles.address}>
              Centre Commercial<br/>
              75001 PARIS<br/>
              Tel: 01 42 00 00 00
            </div>
          </div>

          <div className={styles.separator}>--------------------------------</div>

          {/* Date and cashier */}
          <div className={styles.info}>
            <div>{dateStr} {timeStr}</div>
            <div>Caisse 04 - Opérateur: 0234</div>
            <div>Ticket: 0000045</div>
          </div>

          <div className={styles.separator}>--------------------------------</div>

          {/* Items */}
          <div className={styles.items}>
            {tracksWithPrices.map((track, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemName}>
                  {(track.name || 'Article').toUpperCase().substring(0, 24)}
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.quantity}>Streams: {(track.playCount || 0).toLocaleString('fr-FR')}</span>
                  <span className={styles.price}>Valeur: {track.totalPrice.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.separator}>--------------------------------</div>

          {/* Totals */}
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>TOTAL STREAMS</span>
              <span>{totalStreams.toLocaleString('fr-FR')}</span>
            </div>
            <div className={styles.separator}>--------------------------------</div>
            <div className={styles.totalFinal}>
              <span>TOTAL</span>
              <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>

          <div className={styles.separator}>--------------------------------</div>

          {/* Payment */}
          <div className={styles.payment}>
            <div>CB EMV ************4242</div>
            <div>MONTANT: {subtotal.toFixed(2).replace('.', ',')} €</div>
            <div>AUTORISATION: 123456</div>
          </div>

          <div className={styles.separator}>--------------------------------</div>

          {/* Footer */}
          <div className={styles.footer}>
            <div>Merci de votre visite</div>
            <div>A bientôt</div>
            <div className={styles.separator}>--------------------------------</div>
            <RickrollQRCode className={styles.qrCode} size={60} />
            <div>0000045-04-{currentDate.getTime().toString().slice(-6)}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CarrefourReceipt;