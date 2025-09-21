import React from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import { RickrollQRCode } from './QRCode';
import styles from './CVSReceipt.module.css';

interface CVSReceiptProps {
  receipt: ReceiptModel;
}

// Générateur de coupons absurdes avec variations
const generateAbsurdCoupons = (generatedAt?: Date) => {
  const headers = [
    '🔥 HOT DEAL 🔥',
    '💸 EXCLUSIVE OFFER 💸',
    '⭐ LIMITED TIME ⭐',
    '🎯 SPECIAL PROMO 🎯',
    '💎 VIP DISCOUNT 💎',
    '🚨 FLASH SALE 🚨',
    '🏆 BEST VALUE 🏆',
    '🎁 BONUS DEAL 🎁',
    '⚠️ MANAGER\'S SPECIAL ⚠️',
    '📢 NOBODY ASKED FOR THIS 📢',
    '🌟 KAREN\'S PICK 🌟',
    '💰 MEGA SAVINGS 💰',
    '🎪 CIRCUS DEAL 🎪',
    '🔔 LAST CHANCE 🔔',
    '🎉 CLEARANCE 🎉',
    '⚡ LIGHTNING DEAL ⚡',
    '🌈 RAINBOW SAVINGS 🌈',
    '🦄 UNICORN SPECIAL 🦄',
    '🍀 LUCKY YOU 🍀',
    '💥 EXPLOSION OF SAVINGS 💥'
  ];

  const deals = [
    { text: "TOUCHING GRASS STARTER KIT", subtext: "Includes: 1 grass, 1 hand", code: "TOUCH", price: "$49.99", savings: "You saved: Your dignity" },
    { text: "SHOWER SUPPLIES MEGA BUNDLE", subtext: "It's been 3 days, please", code: "WASH420", price: "$89.99", savings: "You saved: Nothing" },
    { text: "VITAMIN D SUPPLEMENT", subtext: "Or just go outside?", code: "SUNLIGHT", price: "$29.99", savings: "Sun is literally free" },
    { text: "SOCIAL LIFE STARTER PACK", subtext: "Friends not included", code: "LONELY", price: "$199.99", savings: "Cannot buy happiness" },
    { text: "GYM MEMBERSHIP YOU WON'T USE", subtext: "Expires before you go", code: "LAZY", price: "$59.99/mo", savings: "Save 100% by not going" },
    { text: "DEODORANT MULTIPACK", subtext: "Seriously, use it", code: "STINK", price: "$15.99", savings: "Save your relationships" },
    { text: "THERAPY SESSION VOUCHER", subtext: "You need this", code: "MENTAL", price: "$150.00", savings: "Can't put price on sanity" },
    { text: "VEGETABLES YOU'LL LET ROT", subtext: "Good intentions included", code: "VEGGIE", price: "$24.99", savings: "Wasted anyway" },
    { text: "ALARM CLOCK COLLECTION", subtext: "You'll snooze them all", code: "WAKE", price: "$39.99", savings: "Time is money" },
    { text: "OUTDOOR SHOES", subtext: "For your imaginary walks", code: "STEPS", price: "$79.99", savings: "0 steps = 0 wear" },
    { text: "10% OFF YOUR 5TH BREAKDOWN", subtext: "First 4 full price", code: "CRISIS", price: "Priceless", savings: "Mental health: -10%" },
    { text: "BUY 2 GET 1 EXISTENTIAL CRISIS", subtext: "Already having 2", code: "VOID", price: "Your soul", savings: "None" },
    { text: "WATER - STAY HYDRATED", subtext: "It's literally free from tap", code: "H2O", price: "$4.99", savings: "Just drink tap water" },
    { text: "GRASS TOUCHING GLOVES", subtext: "For beginners", code: "GLOVES", price: "$19.99", savings: "Hands are free" },
    { text: "REALITY CHECK SUBSCRIPTION", subtext: "Monthly delivery", code: "REAL", price: "$9.99/mo", savings: "Reality is free" },
    { text: "SHOWER TIMER", subtext: "Max: 3 minutes", code: "QUICK", price: "$12.99", savings: "Water bill: +$50" },
    { text: "FRIEND RENTAL SERVICE", subtext: "By the hour", code: "RENT", price: "$20/hr", savings: "Real friends: Priceless" },
    { text: "SUNLIGHT LAMP", subtext: "Portable sun", code: "FAKE", price: "$89.99", savings: "Real sun: Free" },
    { text: "MOTIVATION IN A BOTTLE", subtext: "Side effects include: Nothing", code: "LAZY2", price: "$29.99", savings: "Still unmotivated" },
    { text: "GRASS SEED FOR INDOOR GROWING", subtext: "Touch grass at home", code: "HOME", price: "$14.99", savings: "Parks are free" }
  ];

  const coupons = [];

  // Ajouter des coupons variés
  for (let i = 0; i < 120; i++) {
    // Use simpler indexing to avoid issues
    const headerIndex = (i * 7) % headers.length;
    const dealIndex = (i * 11) % deals.length;
    const header = headers[headerIndex];
    const deal = deals[dealIndex];

    if (!header || !deal) {
      continue; // Skip if undefined
    }

    // Parfois ajouter des variations spéciales
    if (i % 10 === 0) {
      // Message d'erreur
      coupons.push({
        type: 'error',
        content: `PRINTER ERROR #${404 + i}`,
        text: 'COUPON FAILED TO LOAD'
      });
    } else if (i % 15 === 0) {
      // Coupon expiré
      coupons.push({
        type: 'expired',
        header: '[EXPIRED COUPON - STILL PRINTED]',
        text: 'This deal ended in 2019',
        subtext: 'But we\'ll still print it',
        code: 'DEAD' + i
      });
    } else if (i % 20 === 0) {
      // Espace intentionnellement vide
      coupons.push({
        type: 'blank',
        text: 'THIS SPACE INTENTIONALLY LEFT BLANK',
        subtext: 'If you\'re reading this, go outside'
      });
    } else if (i % 25 === 0) {
      // Pub pour un autre magasin
      coupons.push({
        type: 'ad',
        header: '📢 WALGREENS IS BETTER 📢',
        text: 'Just kidding, they\'re the same',
        subtext: 'Both print long receipts'
      });
    } else if (i % 30 === 0) {
      // Coupon à l'envers
      coupons.push({
        type: 'upside',
        header: '¿ʇɥƃᴉɹ sᴉɥʇ ƃuᴉpɐǝɹ noʎ ǝɹ∀',
        text: 'ǝpᴉsʇno oƃ ʎllɐǝɹ plnoɥs no⅄',
        code: 'FLIP180'
      });
    } else if (i % 7 === 3) {
      // Karen's special
      coupons.push({
        type: 'karen',
        header: '⚠️ KAREN\'S PERSONAL PICK ⚠️',
        text: deal.text,
        subtext: 'Karen says: "You NEED this"',
        code: 'KAREN' + i.toString().padStart(2, '0')
      });
    } else {
      // Coupon normal avec variations
      coupons.push({
        type: 'normal',
        header: header,
        text: deal.text,
        subtext: deal.subtext,
        code: deal.code + i.toString().padStart(3, '0'),
        price: deal.price,
        savings: deal.savings
      });
    }
  }

  // Pas de doublons, chaque coupon est unique

  return coupons;
};

const CVSReceipt: React.FC<CVSReceiptProps> = ({ receipt }) => {
  const date = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Sort tracks by play count
  const sortedItems = [...receipt.items].sort((a, b) => {
    const playCountA = a.playCount || 0;
    const playCountB = b.playCount || 0;
    return playCountB - playCountA;
  });

  // Calculate totals - Real streaming rate (0.003€ per stream)
  const pricePerStream = 0.003;
  let subtotal = 0;

  const itemsWithPrice = sortedItems.map(track => {
    const playCount = track.playCount || 1;
    const price = playCount * pricePerStream;
    subtotal += price;
    return { ...track, playCount, price };
  });

  // Calculate total streams
  const totalStreams = itemsWithPrice.reduce((sum, item) => sum + item.playCount, 0);

  // Calculate addiction tax as percentage of subtotal
  const addictionTax = subtotal * 0.20; // 20% tax
  const total = subtotal + addictionTax;

  // Format price
  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2);
  };

  const coupons = generateAbsurdCoupons(receipt.generatedAt);

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>
          <div className={styles.header}>
            CVS PHARMACY #4269<br/>
            1 CVS Drive<br/>
            Woonsocket, RI 02895<br/>
            (401) 555-0420<br/>
            Store Manager: Karen<br/>
            <span className={styles.separator}>{'='.repeat(40)}</span>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>SPOTIFY ADDICTION TREATMENT</div>
            <span className={styles.separator}>{'-'.repeat(40)}</span>

            {itemsWithPrice.map((item, idx) => (
              <div key={idx} className={styles.item}>
                <div className={styles.itemName}>
                  {(item.name || 'UNKNOWN').toUpperCase().substring(0, 20)}
                  {item.artists && item.artists[0] && (
                    <span className={styles.artist}> - {item.artists[0].name.toUpperCase().substring(0, 15)}</span>
                  )}
                </div>
                <div className={styles.itemDetail}>
                  Streams: {item.playCount.toLocaleString()} | Value: €{(item.playCount * 0.003).toFixed(2)}
                </div>
                <div className={styles.itemDetail}>
                  Qty: {item.playCount} plays{'.'.repeat(Math.max(1, 20 - item.playCount.toString().length))}
                  {formatPrice(item.price)}
                </div>
              </div>
            ))}

            <span className={styles.separator}>{'-'.repeat(40)}</span>
            <div className={styles.totalLine}>
              <span>TOTAL STREAMS</span>
              <span>{totalStreams.toLocaleString()}</span>
            </div>
            <span className={styles.separator}>{'-'.repeat(40)}</span>
            <div className={styles.totalBold}>
              <span>TOTAL</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <span className={styles.separator}>{'='.repeat(40)}</span>
          </div>

          <div className={styles.rewards}>
            YOUR EXTRABUCKS REWARDS<br/>
            $2.00 OFF THERAPY SESSION<br/>
            Expires: When you stop<br/>
          </div>

          <div className={styles.couponsHeader}>
            <span className={styles.separator}>{'-'.repeat(40)}</span>
            <div>✂️ --- COUPONS BELOW --- ✂️</div>
            <span className={styles.separator}>{'-'.repeat(40)}</span>
          </div>

          <div className={styles.coupons}>
            {coupons.map((coupon, idx) => {
              if (coupon.type === 'error') {
                return (
                  <div key={idx} className={styles.errorCoupon}>
                    <div>{'!'.repeat(40)}</div>
                    <div className={styles.errorText}>{coupon.content}</div>
                    <div>{coupon.text}</div>
                    <div>{'!'.repeat(40)}</div>
                  </div>
                );
              }

              if (coupon.type === 'blank') {
                return (
                  <div key={idx} className={styles.blankCoupon}>
                    <div>&nbsp;</div>
                    <div className={styles.blankText}>{coupon.text}</div>
                    <div className={styles.blankSubtext}>{coupon.subtext}</div>
                    <div>&nbsp;</div>
                  </div>
                );
              }

              if (coupon.type === 'upside') {
                return (
                  <div key={idx} className={styles.upsideCoupon}>
                    <div className={styles.couponBorder}>{'¿'.repeat(40)}</div>
                    <div className={styles.upsideContent}>
                      <div>{coupon.header}</div>
                      <div>{coupon.text}</div>
                      <div>Code: {coupon.code}</div>
                    </div>
                    <div className={styles.couponBorder}>{'¿'.repeat(40)}</div>
                  </div>
                );
              }

              if (coupon.type === 'ad') {
                return (
                  <div key={idx} className={styles.adCoupon}>
                    <div>{'$'.repeat(40)}</div>
                    <div className={styles.adHeader}>{coupon.header}</div>
                    <div>{coupon.text}</div>
                    <div className={styles.adSubtext}>{coupon.subtext}</div>
                    <div>{'$'.repeat(40)}</div>
                  </div>
                );
              }

              if (coupon.type === 'expired') {
                return (
                  <div key={idx} className={styles.expiredCoupon}>
                    <div className={styles.couponBorder}>{'X'.repeat(40)}</div>
                    <div className={styles.expiredContent}>
                      <div className={styles.expiredHeader}>{coupon.header}</div>
                      <div className={styles.expiredText}>{coupon.text}</div>
                      <div>{coupon.subtext}</div>
                      <div className={styles.expiredCode}>Code: {coupon.code} [EXPIRED]</div>
                    </div>
                    <div className={styles.couponBorder}>{'X'.repeat(40)}</div>
                  </div>
                );
              }

              if (coupon.type === 'karen') {
                return (
                  <div key={idx} className={styles.karenCoupon}>
                    <div className={styles.couponBorder}>{'K'.repeat(40)}</div>
                    <div className={styles.karenContent}>
                      <div className={styles.karenHeader}>{coupon.header}</div>
                      <div className={styles.couponText}>{coupon.text}</div>
                      <div className={styles.karenQuote}>{coupon.subtext}</div>
                      <div className={styles.couponCode}>Code: {coupon.code}</div>
                    </div>
                    <div className={styles.couponBorder}>{'K'.repeat(40)}</div>
                  </div>
                );
              }

              // Normal coupon
              return (
                <div key={idx} className={styles.coupon}>
                  <div className={styles.couponBorder}>{'*'.repeat(40)}</div>
                  <div className={styles.couponContent}>
                    <div className={styles.couponTitle}>{coupon.header}</div>
                    <div className={styles.couponText}>{coupon.text}</div>
                    {coupon.subtext && <div className={styles.couponSubtext}>{coupon.subtext}</div>}
                    {coupon.price && (
                      <div className={styles.couponPrice}>
                        Was: <s>{coupon.price}</s> NOW: {coupon.price}<br/>
                        ({coupon.savings})
                      </div>
                    )}
                    <div className={styles.couponCode}>Code: {coupon.code}</div>
                    <div className={styles.couponExpiry}>
                      Exp: {new Date(Date.now() + ((idx * 137) % 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={styles.couponBorder}>{'*'.repeat(40)}</div>
                </div>
              );
            })}
          </div>

          <div className={styles.footer}>
            <span className={styles.separator}>{'='.repeat(40)}</span>
            <div>THANK YOU FOR SHOPPING AT CVS</div>
            <div>"We care about your health"</div>
            <div>(Your Spotify health is concerning)</div>
            <div></div>
            <div>{dateStr} {timeStr}</div>
            <div>Register: 03 Trans: {Math.floor(((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) * 3) % 9999).toString().padStart(4, '0')}</div>
            <div></div>
            <RickrollQRCode className={styles.qrCode} size={70} />
            <span className={styles.separator}>{'='.repeat(40)}</span>
            <div className={styles.finalMessage}>
              Receipt Length: {Math.floor(((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 3) + 3)} meters<br/>
              Trees killed: Yes<br/>
              Did you need this? No<br/>
              Will we stop? Never<br/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVSReceipt;