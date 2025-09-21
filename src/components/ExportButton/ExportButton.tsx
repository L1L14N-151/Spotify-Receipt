import React, { useState, useEffect } from 'react';
import htmlExportService from '../../services/export/HtmlExportService';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  receiptElementId?: string;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: string) => void;
}

type ExportFormat = 'png' | 'jpeg' | 'webp';
type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

const ExportButton: React.FC<ExportButtonProps> = ({
  receiptElementId = 'receipt-container',
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showModal]);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [selectedQuality, setSelectedQuality] = useState<ExportQuality>('high');
  const [showSuccess, setShowSuccess] = useState(false);

  const qualitySettings = {
    low: { scale: 1, quality: 0.6 },
    medium: { scale: 1.5, quality: 0.8 },
    high: { scale: 2, quality: 0.92 },
    ultra: { scale: 3, quality: 1 }
  };

  const handleExport = async (format: ExportFormat = selectedFormat, quality: ExportQuality = selectedQuality) => {
    if (isExporting) return;
    setShowModal(false);

    // Try multiple selectors to find the receipt element
    const selectors = [
      '[class*="receiptWrapper"]',
      '[class*="receipt-wrapper"]',
      '[data-receipt]',
      '#receipt-container',
      '.receipt-container'
    ];

    let wrapperElement: HTMLElement | null = null;
    for (const selector of selectors) {
      wrapperElement = document.querySelector(selector) as HTMLElement;
      if (wrapperElement) break;
    }

    if (!wrapperElement) {
      console.error('Could not find receipt element with any of these selectors:', selectors);
      if (onExportError) onExportError('Receipt element not found. Please ensure a receipt is visible.');
      return;
    }

    await exportReceipt(wrapperElement, format, quality);
  };

  const exportReceipt = async (element: HTMLElement, format: ExportFormat, quality: ExportQuality) => {
    setIsExporting(true);
    if (onExportStart) onExportStart();

    try {
      const settings = qualitySettings[quality];
      const filename = `spotify-receipt-${Date.now()}.${format}`;

      await htmlExportService.exportAsImage(element, {
        format,
        filename,
        scale: settings.scale,
        quality: settings.quality
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      if (onExportComplete) onExportComplete();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      if (onExportError) onExportError(message);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = () => {
    handleExport('png', 'high');
  };

  return (
    <>
      <button
        className={styles.exportButton}
        onClick={() => setShowModal(true)}
        disabled={isExporting}
        aria-label="Export receipt"
      >
        {isExporting ? (
          <>
            <span className={styles.spinner}></span>
            Exporting...
          </>
        ) : (
          <>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Receipt
          </>
        )}
      </button>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
          onWheel={(e) => e.preventDefault()}
        >
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Export Receipt</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Choose Format</label>
                <div className={styles.formatOptions}>
                  {(['png', 'jpeg', 'webp'] as ExportFormat[]).map(format => (
                    <button
                      key={format}
                      className={`${styles.formatButton} ${selectedFormat === format ? styles.active : ''}`}
                      onClick={() => setSelectedFormat(format)}
                    >
                      <span className={styles.formatName}>{format.toUpperCase()}</span>
                      <span className={styles.formatDesc}>
                        {format === 'png' && 'Best quality, transparency'}
                        {format === 'jpeg' && 'Smaller size, no transparency'}
                        {format === 'webp' && 'Modern format, good compression'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>Select Quality</label>
                <div className={styles.qualityOptions}>
                  {(['low', 'medium', 'high', 'ultra'] as ExportQuality[]).map(quality => (
                    <button
                      key={quality}
                      className={`${styles.qualityButton} ${selectedQuality === quality ? styles.active : ''}`}
                      onClick={() => setSelectedQuality(quality)}
                    >
                      <span className={styles.qualityName}>
                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        {quality === 'ultra' && <span className={styles.badge}>4K</span>}
                      </span>
                      <span className={styles.qualityDesc}>
                        {quality === 'low' && '720p'}
                        {quality === 'medium' && '1080p'}
                        {quality === 'high' && '2K'}
                        {quality === 'ultra' && '4K'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.downloadButton}
                  onClick={() => handleExport(selectedFormat, selectedQuality)}
                >
                  Download {selectedFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className={styles.toast}>
          <svg className={styles.toastIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
          </svg>
          <span>Receipt downloaded successfully!</span>
        </div>
      )}
    </>
  );
};

export default ExportButton;