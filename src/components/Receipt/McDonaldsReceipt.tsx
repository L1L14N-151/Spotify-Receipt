import React, { useMemo } from 'react';
import { SpotifyReceipt } from '../../models/SpotifyReceipt';
import { formatDuration, formatCurrency } from '../../utils/formatters';
import { RickrollQRCode } from './QRCode';
import styles from './McDonaldsReceipt.module.css';

interface McDonaldsReceiptProps {
  receipt: SpotifyReceipt;
}

export const McDonaldsReceipt: React.FC<McDonaldsReceiptProps> = ({ receipt }) => {
  const topTracks = receipt.topTracks || [];
  // Calculate real total based on streaming revenue
  const totalAmount = topTracks.reduce((sum, track) => sum + ((track.playCount || 0) * 0.003), 0);
  const totalTime = receipt.totalDuration || 0;
  const currentDate = new Date(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now());
  const orderNumber = ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 9999).toString().padStart(4, '0');
  const storeNumber = ((typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % 999).toString().padStart(3, '0');
  
  // Generate meal combinations based on tracks
  const mealItems = useMemo(() => {
    return topTracks.map((track, index) => {
      const seed = (typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) + index;
      const mealType = seed % 5;
      const size = (seed % 3) === 0 ? 'Large' : (seed % 3) === 1 ? 'Medium' : 'Small';
      
      // Determine meal based on play count
      const playCount = track.playCount || 0;
      let mealName = '';
      let extras: string[] = [];

      if (playCount > 100) {
        // Heavy listeners get full meals
        mealName = ['Big Mac Menu', 'Quarter Pounder Menu', 'McNuggets 20pc', 'Double Quarter Pounder', 'McChicken Deluxe'][mealType];
        extras = ['Extra Fries', 'Apple Pie', 'McFlurry'];
      } else if (playCount > 50) {
        // Medium listeners
        mealName = ['McChicken Menu', 'Cheeseburger Menu', 'McNuggets 10pc', 'Filet-O-Fish', 'Big Mac'][mealType];
        extras = ['Extra Sauce', 'Cookie'];
      } else {
        // Light listeners
        mealName = ['Hamburger', 'McNuggets 6pc', 'Fries', 'Apple Slices', 'Side Salad'][mealType];
        extras = ['Ketchup'];
      }
      
      // Real price based on Spotify streaming rate (€0.003 per stream)
      const realPrice = playCount * 0.003;
      const itemExtras = extras.slice(0, Math.min(seed % 3, extras.length));

      return {
        name: mealName,
        customization: track.name || 'Unknown Track',
        artist: track.artists?.[0]?.name || 'Unknown Artist',
        size,
        extras: itemExtras,
        price: realPrice,
        plays: playCount,
        duration: track.duration || 0
      };
    });
  }, [topTracks, receipt.generatedAt]);
  
  const happyMealToys = [
    'Sonic the Hedgehog Figure',
    'Pokemon Card',
    'Disney Princess',
    'Hot Wheels Car',
    'Minecraft Creeper',
    'Marvel Hero',
    'Star Wars Mini',
    'Nintendo Character'
  ];
  
  const currentToy = happyMealToys[(typeof receipt.generatedAt === "number" ? receipt.generatedAt : Date.now()) % happyMealToys.length];
  
  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.content}>
          <div className={styles.header}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png"
              alt="McDonald's"
              className={styles.mcdonaldsLogo}
            />
            <div className={styles.restaurantName}>McDonald's</div>
            <div className={styles.tagline}>i'm lovin' it™</div>
            <div className={styles.orderNumber}>ORDER #{orderNumber}</div>
          </div>
          
          <div className={styles.separator}>================================</div>
          
          <div className={styles.orderType}>*** DINE IN ***</div>

          <div className={styles.separator}>================================</div>

          <div className={styles.sectionTitle}>YOUR MUSIC MEAL ORDER</div>
          
          <div className={styles.items}>
            {mealItems.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemNumber}>#{index + 1}</span>
                  <span className={styles.itemName}>{item.customization} - €{item.price.toFixed(2)}</span>
                </div>
                <div className={styles.itemArtist}>by {item.artist}</div>
                <div className={styles.mealComponents}>
                  <div className={styles.mealItem}>🎵 Total Streams: {item.plays.toLocaleString()}</div>
                  <div className={styles.mealItem}>💰 Stream Value: €{item.price.toFixed(2)}</div>
                  <div className={styles.mealItem}>⏱️ Duration: {formatDuration(item.duration)}</div>
                  {item.extras.map((extra, i) => (
                    <div key={i} className={styles.mealItem}>➕ {extra}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.separator}>--------------------------------</div>
          
          <div className={styles.nutritionSection}>
            <div className={styles.nutritionTitle}>NUTRITIONAL INFORMATION</div>
            <div className={styles.nutritionInfo}>
              <div className={styles.nutritionItem}>
                <span>Total Calories:</span>
                <span>{topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0) * 2} cal</span>
              </div>
              <div className={styles.nutritionItem}>
                <span>Listening Time:</span>
                <span>{formatDuration(totalTime)}</span>
              </div>
              <div className={styles.nutritionItem}>
                <span>Replay Value:</span>
                <span>{Math.round(topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0) / topTracks.length)}g</span>
              </div>
            </div>
          </div>
          
          <div className={styles.separator}>--------------------------------</div>
          
          <div className={styles.happyMeal}>
            <div className={styles.happyMealTitle}>🎁 HAPPY MEAL TOY INSIDE! 🎁</div>
            <div className={styles.toyName}>Today's Toy: {currentToy}</div>
            <div className={styles.toyMessage}>Collect them all!</div>
          </div>
          
          <div className={styles.separator}>--------------------------------</div>
          
          <div className={styles.totals}>
            <div className={styles.totalLine}>
              <span>Total Streams:</span>
              <span>{topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0).toLocaleString()}</span>
            </div>
            <div className={styles.grandTotal}>
              <span>TOTAL VALUE:</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.separator}>================================</div>
          
          <div className={styles.mobileOrder}>
            <div className={styles.mobileTitle}>📱 EARN POINTS!</div>
            <div className={styles.mobileText}>Download the McDonald's App</div>
            <div className={styles.mobileCode}>Code: MUSIC{orderNumber}</div>
          </div>
          
          <div className={styles.separator}>--------------------------------</div>
          
          <div className={styles.survey}>
            <div className={styles.surveyTitle}>Tell us about your visit!</div>
            <div className={styles.surveyText}>www.mcdvoice.com</div>
            <div className={styles.surveyCode}>Survey Code: {storeNumber}-{orderNumber}</div>
            <div className={styles.surveyReward}>Get a FREE Big Mac!</div>
          </div>
          
          <div className={styles.separator}>--------------------------------</div>
          
          <div className={styles.footer}>
            <div className={styles.dateTime}>
              {currentDate.toLocaleDateString()} {currentDate.toLocaleTimeString()}
            </div>
            <div className={styles.cashier}>Cashier: SPOTIFYBOT</div>
            <div className={styles.register}>Register: 01</div>
            <RickrollQRCode className={styles.qrCode} size={60} />
            <div className={styles.slogan}>Over {topTracks.reduce((sum, t) => sum + (t.playCount || 0), 0)} Billion Served!</div>
            <div className={styles.thankyou}>THANK YOU!</div>
            <div className={styles.seeYouSoon}>"Would you like therapy with that?"</div>
          </div>
        </div>
      </div>
    </div>
  );
};