import html2canvas from 'html2canvas';

interface ExportOptions {
  format?: 'png' | 'jpeg' | 'webp';
  filename?: string;
  scale?: number;
  quality?: number;
}

class HtmlExportService {
  async exportAsImage(element: HTMLElement, options: ExportOptions = {}): Promise<void> {
    const {
      format = 'png',
      filename = `spotify-receipt.${format}`,
      scale = 2,
      quality = 0.92
    } = options;

    return this.exportWithOptions(element, filename, format, scale, quality);
  }

  async exportAsPNG(element: HTMLElement, filename: string = 'spotify-receipt.png'): Promise<void> {
    return this.exportWithOptions(element, filename, 'png', 2, 1);
  }

  private async exportWithOptions(
    element: HTMLElement,
    filename: string,
    format: 'png' | 'jpeg' | 'webp',
    scale: number,
    quality: number
  ): Promise<void> {
    try {
      // Check if html2canvas is available
      if (!html2canvas) {
        throw new Error('html2canvas library is not available');
      }

      // Clone the element to avoid any side effects
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      container.appendChild(clonedElement);

      // Get the computed style to preserve the background
      const computedStyle = window.getComputedStyle(element);

      // Configure html2canvas options for better quality with fallback
      let canvas;
      try {
        canvas = await html2canvas(clonedElement, {
          backgroundColor: format === 'jpeg' ? '#ffffff' : null,
          scale: scale,
          useCORS: true,
          logging: false,
          imageTimeout: 15000,
          allowTaint: true,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        });
      } catch (canvasError) {
        // Fallback with simpler options
        console.warn('Failed with advanced options, trying fallback:', canvasError);
        canvas = await html2canvas(element, {
          backgroundColor: computedStyle.backgroundColor || '#ffffff',
          scale: 1,
          logging: false
        });
      }

      // Remove temporary container
      document.body.removeChild(container);

      // Convert canvas to blob with appropriate format
      const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, mimeType, quality);
      });

      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }
}

export default new HtmlExportService();