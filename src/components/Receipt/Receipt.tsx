import React, { useRef, useEffect, useState } from 'react';
import { SpotifyReceipt as ReceiptModel } from '../../models/SpotifyReceipt';
import canvasRenderService from '../../services/canvas/CanvasRenderService';
import receiptService from '../../services/receipt/ReceiptService';
import styles from './Receipt.module.css';

interface ReceiptProps {
  receipt: ReceiptModel;
  onExport?: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ receipt, onExport }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !receipt) return;

    try {
      // Format receipt for display
      const formattedReceipt = receiptService.formatReceipt(receipt);

      // Render to canvas
      canvasRenderService.renderReceipt(
        formattedReceipt,
        receipt.theme,
        canvasRef.current
      );

      setIsRendered(true);
    } catch (error) {
      console.error('Failed to render receipt:', error);
      setIsRendered(false);
    }
  }, [receipt]);

  return (
    <div className={styles.receiptContainer}>
      <canvas
        ref={canvasRef}
        className={styles.receiptCanvas}
        style={{
          display: isRendered ? 'block' : 'none'
        }}
      />
      {!isRendered && (
        <div className={styles.loadingMessage}>
          Rendering receipt...
        </div>
      )}
    </div>
  );
};

export default Receipt;