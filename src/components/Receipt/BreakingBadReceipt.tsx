import React, { useMemo } from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './BreakingBadReceipt.module.css';

interface BreakingBadReceiptProps {
  receipt: ReceiptModel;
}

const BreakingBadReceipt: React.FC<BreakingBadReceiptProps> = ({ receipt }) => {
  const date = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Sort tracks by play count (highest purity first)
  const sortedItems = [...receipt.items].sort((a, b) => {
    const playCountA = a.playCount || 0;
    const playCountB = b.playCount || 0;
    return playCountB - playCountA;
  });

  // Use all tracks as "products"
  const products = sortedItems;

  // Memoize purity calculations to avoid re-renders
  const productPurities = useMemo(() => {
    const maxPlays = Math.max(...sortedItems.map(t => t.playCount || 0));

    return products.map(track => {
      if (maxPlays === 0) return 75.0;

      // Scale from 70% to 99.1% based on relative play count
      const ratio = (track.playCount || 0) / maxPlays;
      const basePurity = 70.0 + (ratio * 29.1); // 29.1 = 99.1 - 70

      // Add some variance for realism (seeded by track name for consistency)
      const seed = (track.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const variance = ((seed % 200) / 100 - 1) * 2; // ±2% based on track name
      return Math.min(99.1, Math.max(70.0, basePurity + variance));
    });
  }, [products, sortedItems]);

  // Generate batch numbers
  const generateBatchNumber = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = letters[index % 26] + letters[(index * 3) % 26];
    const num = (index * 137 + 2008) % 9999;
    return `${prefix}-${num.toString().padStart(4, '0')}`;
  };

  // Territory codes
  const territories = [
    { name: 'ALBUQUERQUE', code: 'ABQ-505' },
    { name: 'SANTA FE', code: 'SF-505' },
    { name: 'LOS POLLOS', code: 'LP-505' },
    { name: 'EL PASO', code: 'EP-915' },
    { name: 'PRAGUE', code: 'CZ-420' }
  ];

  // Total calculations with real streaming price
  const pricePerStream = 0.003; // Real Spotify rate
  const totalBatches = products.length;
  const totalWeight = products.reduce((sum, track) => sum + (track.playCount || 0) * 3.5, 0);
  const avgPurity = productPurities.reduce((sum, purity) => sum + purity, 0) / totalBatches;
  const totalStreams = products.reduce((sum, track) => sum + (track.playCount || 0), 0);
  const streetValue = totalStreams * pricePerStream;

  // Famous quotes
  const quotes = [
    { text: "I am the one who knocks.", author: "W.W." },
    { text: "Say my name.", author: "Heisenberg" },
    { text: "Yeah, science!", author: "J.P." },
    { text: "This is my product.", author: "W.W." },
    { text: "No more half measures.", author: "M.E." }
  ];
  // Use a stable quote selection based on receipt generation time
  const quoteIndex = useMemo(() => {
    const time = typeof receipt.generatedAt === 'number' ? receipt.generatedAt : Date.now();
    return time % quotes.length;
  }, [receipt.generatedAt])
  const selectedQuote = quotes[quoteIndex];

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logo}>
              <span>Br</span><span>Ba</span>
            </div>
            <div className={styles.tagline}>Los Pollos Hermanos Distribution Co.</div>
            <div className={styles.hazardSymbol}>☢️ ⚗️ ☣️</div>
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* Lab Information */}
          <div className={styles.labInfo}>
            <div className={styles.labTitle}>Laboratory Certificate</div>
            <div className={styles.labDetail}>
              <span>Cook:</span>
              <span>HEISENBERG</span>
            </div>
            <div className={styles.labDetail}>
              <span>Lab Location:</span>
              <span>UNDISCLOSED</span>
            </div>
            <div className={styles.labDetail}>
              <span>Batch Date:</span>
              <span>{dateStr}</span>
            </div>
            <div className={styles.labDetail}>
              <span>Time:</span>
              <span>{timeStr}</span>
            </div>
            <div className={styles.labDetail}>
              <span>Lab ID:</span>
              <span>RV-{Math.floor(((typeof receipt.generatedAt === 'number' ? receipt.generatedAt : Date.now()) * 13) % 999)}</span>
            </div>
          </div>

          <div className={styles.divider}>{'─'.repeat(50)}</div>

          {/* Products Section */}
          <div className={styles.productsSection}>
            <div className={styles.sectionTitle}>Product Manifest</div>

            {products.map((track, idx) => {
              const purity = productPurities[idx];
              const batchNumber = generateBatchNumber(idx);
              const weight = (track.playCount || 0) * 3.5;
              const trackName = (track.name || 'UNKNOWN').toUpperCase().substring(0, 25);
              const artistName = track.artists?.[0]?.name?.toUpperCase().substring(0, 20) || 'UNKNOWN';

              return (
                <div key={idx} className={styles.product}>
                  <div className={styles.productHeader}>
                    <span className={styles.batchNumber}>Batch #{batchNumber}</span>
                    <span className={`${styles.purityBadge} ${
                      purity > 90 ? styles.purityHigh :
                      purity > 80 ? styles.purityMid :
                      styles.purityLow
                    }`}>
                      {purity}% PURE
                    </span>
                  </div>

                  <div className={styles.productName}>{trackName}</div>
                  <div className={styles.formula}>Formula: C₈H₁₀N₄O₂ · {artistName}</div>
                  <div className={styles.clientCode}>Client Code: "Blue Sky"</div>

                  <div className={styles.metrics}>
                    <div className={styles.metricItem}>
                      <div className={styles.metricLabel}>STREAMS</div>
                      <div className={styles.metricValue}>{(track.playCount || 0).toLocaleString()}</div>
                    </div>
                    <div className={styles.metricItem}>
                      <div className={styles.metricLabel}>WEIGHT</div>
                      <div className={styles.metricValue}>{weight.toFixed(1)}g</div>
                    </div>
                    <div className={styles.metricItem}>
                      <div className={styles.metricLabel}>VALUE</div>
                      <div className={styles.metricValue}>€{((track.playCount || 0) * 0.003).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* Quality Control */}
          <div className={styles.qualitySection}>
            <div className={styles.warningTitle}>⚠️ Quality Control Report ⚠️</div>

            <div className={styles.qualityMetrics}>
              <div className={styles.qualityRow}>
                <span className={styles.qualityLabel}>Average Purity:</span>
                <span className={`${styles.qualityValue} ${
                  avgPurity > 85 ? styles.qualityExcellent :
                  avgPurity > 75 ? styles.qualityGood :
                  styles.qualityPoor
                }`}>
                  {avgPurity.toFixed(1)}%
                </span>
              </div>

              <div className={styles.qualityRow}>
                <span className={styles.qualityLabel}>Contamination:</span>
                <span className={styles.qualityValue}>NONE DETECTED</span>
              </div>

              <div className={styles.qualityRow}>
                <span className={styles.qualityLabel}>Blue Color:</span>
                <span className={styles.qualityExcellent}>SIGNATURE BLUE</span>
              </div>

              <div className={styles.qualityRow}>
                <span className={styles.qualityLabel}>Crystal Formation:</span>
                <span className={styles.qualityExcellent}>PERFECT</span>
              </div>
            </div>
          </div>

          <div className={styles.divider}>{'─'.repeat(50)}</div>

          {/* Distribution */}
          <div className={styles.distributionSection}>
            <div className={styles.distributionTitle}>Distribution Network</div>

            {territories.map((territory, idx) => (
              <div key={idx} className={styles.territory}>
                <span className={styles.territoryName}>{territory.name}</span>
                <span className={styles.territoryCode}>[{territory.code}]</span>
              </div>
            ))}
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* Cooking Instructions */}
          <div className={styles.cookingInstructions}>
            <div className={styles.instructionsTitle}>Standard Operating Procedure</div>
            <div className={styles.instruction}>Maintain lab temperature at 70°F</div>
            <div className={styles.instruction}>Use only Grade A precursors</div>
            <div className={styles.instruction}>Follow proper safety protocols</div>
            <div className={styles.instruction}>No contamination tolerated</div>
            <div className={styles.instruction}>Respect the chemistry</div>
          </div>

          {/* Totals */}
          <div className={styles.totalsSection}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Batches:</span>
              <span className={styles.totalValue}>{totalBatches}</span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Weight:</span>
              <span className={styles.totalValue}>{totalWeight.toFixed(1)}g</span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Average Purity:</span>
              <span className={styles.totalValue}>{avgPurity.toFixed(1)}%</span>
            </div>

            <div className={styles.grandTotal}>
              <span className={styles.grandTotalLabel}>STREET VALUE:</span>
              <span className={styles.grandTotalValue}>€{streetValue.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.divider}>{'═'.repeat(50)}</div>

          {/* Legal Disclaimer */}
          <div className={styles.legalSection}>
            <div className={styles.legalTitle}>Legal Notice</div>
            <div className={styles.legalText}>
              This document is for entertainment purposes only. Any resemblance to actual
              methamphetamine production or distribution is purely coincidental. Los Pollos
              Hermanos is a legitimate restaurant chain. We do not condone illegal activities.
              Better Call Saul for legal advice. This receipt tracks music, not drugs.
              Spotify is the only addiction here. Stay in school. Don't do drugs.
              Listen to music instead.
            </div>
          </div>

          {/* Signatures */}
          <div className={styles.signatureSection}>
            <div>
              <span className={styles.signatureLine}></span>
              <div className={styles.signatureLabel}>Cook Signature</div>
            </div>
            <div>
              <span className={styles.signatureLine}></span>
              <div className={styles.signatureLabel}>Quality Control</div>
            </div>
          </div>

          {/* Heisenberg Quote */}
          <div className={styles.heisenbergQuote}>
            <div className={styles.quote}>"{selectedQuote.text}"</div>
            <div className={styles.quoteAuthor}>- {selectedQuote.author}</div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.divider}>{'═'.repeat(50)}</div>
            <div className={styles.footerText}>
              HEISENBERG ENTERPRISES<br/>
              Albuquerque, NM 87101<br/>
              <br/>
              "The purest product on the market"<br/>
              99.1% Customer Satisfaction<br/>
              <br/>
              Cook ID: WW-{Math.floor(((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 999))}<br/>
              Lab: Mobile Unit #{Math.floor(((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 99))}<br/>
            </div>
            <RickrollQRCode className={styles.qrCode} size={70} inverted={true} />
            <div className={styles.disclaimer}>
              WARNING: This receipt may contain traces of humor.<br/>
              Side effects may include: binge watching, obsessive rewatching,<br/>
              quoting dialogue, and wearing pork pie hats.<br/>
              If symptoms persist, watch Better Call Saul.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BreakingBadReceipt;