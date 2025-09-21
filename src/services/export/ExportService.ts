/**
 * Export Service
 * Handles image export functionality
 */

import { IExportService, ExportOptions } from './types';

export class ExportService implements IExportService {
  async exportAsPNG(canvas: HTMLCanvasElement, filename?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create image blob'));
            return;
          }

          const defaultFilename = this.generateFilename('png');
          this.downloadImage(blob, filename || defaultFilename);
          resolve();
        },
        'image/png',
        1.0
      );
    });
  }

  async copyToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
    try {
      // Check if Clipboard API is available
      if (!navigator.clipboard || !window.ClipboardItem) {
        console.warn('Clipboard API not available');
        return false;
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) {
        return false;
      }

      // Create clipboard item and write
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);

      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  getDataURL(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }

  downloadImage(blob: Blob, filename: string): void {
    // Create temporary URL for blob
    const url = URL.createObjectURL(blob);

    // Create hidden download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL after short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }

  private generateFilename(extension: string): string {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    return `spotify-receipt-${dateStr}-${timeStr}.${extension}`;
  }

  // Extended functionality for different formats
  async exportAsFormat(canvas: HTMLCanvasElement, options: ExportOptions): Promise<void> {
    const format = options.format || 'png';
    const quality = options.quality || 1.0;
    const filename = options.filename || this.generateFilename(format);

    const mimeType = `image/${format}`;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(`Failed to create ${format} blob`));
            return;
          }

          this.downloadImage(blob, filename);
          resolve();
        },
        mimeType,
        quality
      );
    });
  }

  // Get blob for custom handling
  async getBlob(canvas: HTMLCanvasElement, format: string = 'png'): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          resolve(blob);
        },
        `image/${format}`
      );
    });
  }

  // Check if export is supported
  isExportSupported(): boolean {
    const canvas = document.createElement('canvas');
    return typeof canvas.toBlob === 'function';
  }

  // Get file size estimate
  async getFileSizeEstimate(canvas: HTMLCanvasElement, format: string = 'png'): Promise<number> {
    const blob = await this.getBlob(canvas, format);
    return blob.size;
  }
}

// Export singleton instance
const exportService = new ExportService();
export default exportService;