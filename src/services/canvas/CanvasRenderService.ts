/**
 * Canvas Render Service
 * Handles receipt rendering to canvas
 */

import { ICanvasRenderService, FormattedReceipt, Theme } from './types';

export class CanvasRenderService implements ICanvasRenderService {
  renderReceipt(receipt: FormattedReceipt, theme: Theme, canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get canvas context');
    }

    // Calculate dimensions
    const dimensions = this.calculateCanvasSize(receipt);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas and set background
    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply paper texture
    this.applyPaperTexture(canvas, theme);

    // Set font
    ctx.font = `${theme.fontSize.body}px ${theme.fontFamily}`;
    ctx.fillStyle = theme.colors.text;
    ctx.textBaseline = 'top';

    let y = 20; // Starting Y position
    const lineHeight = theme.fontSize.body * 1.5;
    const x = 20; // Left margin

    // Render header
    ctx.font = `${theme.fontSize.header}px ${theme.fontFamily}`;
    receipt.header.forEach(line => {
      if (line === '------------------------') {
        this.drawDashedLine(ctx, x, y + lineHeight / 2, canvas.width - 40, theme);
      } else if (line.includes(theme.terminology.storeName)) {
        // Center store name
        ctx.textAlign = 'center';
        ctx.fillText(line, canvas.width / 2, y);
        ctx.textAlign = 'left';
      } else {
        ctx.fillText(line, x, y);
      }
      y += lineHeight;
    });

    // Render items
    ctx.font = `${theme.fontSize.body}px ${theme.fontFamily}`;
    y += lineHeight / 2; // Extra spacing
    receipt.items.forEach(line => {
      if (line === '') {
        y += lineHeight / 2;
      } else if (line.includes('€')) {
        // Price line - right align the price
        const parts = line.split('€');
        const price = '€' + parts[1];
        const text = parts[0];
        ctx.fillText(text, x, y);
        ctx.textAlign = 'right';
        ctx.fillText(price, canvas.width - x, y);
        ctx.textAlign = 'left';
      } else {
        // Product name
        ctx.fillText(line, x, y);
      }
      y += lineHeight;
    });

    // Render totals
    y += lineHeight / 2;
    receipt.totals.forEach(line => {
      if (line === '------------------------') {
        this.drawDashedLine(ctx, x, y + lineHeight / 2, canvas.width - 40, theme);
      } else if (line.includes('€')) {
        // Total lines
        const colonIndex = line.indexOf(':');
        const label = line.substring(0, colonIndex + 1);
        const value = line.substring(colonIndex + 1).trim();

        ctx.fillText(label, x, y);
        ctx.textAlign = 'right';
        ctx.fillText(value, canvas.width - x, y);
        ctx.textAlign = 'left';
      } else {
        ctx.fillText(line, x, y);
      }
      y += lineHeight;
    });

    // Render footer
    ctx.font = `${theme.fontSize.footer}px ${theme.fontFamily}`;
    y += lineHeight / 2;
    receipt.footer.forEach(line => {
      if (line === '------------------------') {
        this.drawDashedLine(ctx, x, y + lineHeight / 2, canvas.width - 40, theme);
      } else if (line.includes('SPOTIFY')) {
        // Center store name in footer
        ctx.textAlign = 'center';
        ctx.fillText(line, canvas.width / 2, y);
        ctx.textAlign = 'left';
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(line, canvas.width / 2, y);
        ctx.textAlign = 'left';
      }
      y += lineHeight;
    });

    // Add tear effect at bottom
    this.addTearEffect(canvas);
  }

  calculateCanvasSize(receipt: FormattedReceipt): { width: number; height: number } {
    const baseLineHeight = 18; // Base line height in pixels
    const margin = 40; // Top and bottom margin

    const totalLines =
      receipt.header.length +
      receipt.items.length +
      receipt.totals.length +
      receipt.footer.length;

    // Add extra height for spacing
    const extraSpacing = 8 * baseLineHeight; // Space between sections

    const width = 400; // Fixed width for receipt
    const height = (totalLines * baseLineHeight) + extraSpacing + margin * 2;

    return { width, height: Math.min(height, 1200) }; // Cap max height
  }

  applyPaperTexture(canvas: HTMLCanvasElement, theme: Theme): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create subtle noise texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 10;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
      // Alpha unchanged
    }

    ctx.putImageData(imageData, 0, 0);

    // Add slight gradient overlay for paper effect
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  addTearEffect(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tearHeight = 15;
    const tearY = canvas.height - tearHeight;

    // Create zigzag tear pattern
    ctx.beginPath();
    ctx.moveTo(0, tearY);

    const zigzagWidth = 10;
    for (let x = 0; x <= canvas.width; x += zigzagWidth) {
      const y = tearY + (Math.random() * tearHeight);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    // Clear the tear area
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Add shadow to tear edge
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    ctx.stroke();
    ctx.shadowColor = 'transparent';
  }

  private drawDashedLine(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    theme: Theme
  ): void {
    ctx.save();
    ctx.strokeStyle = theme.colors.text;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    ctx.restore();
  }
}

// Export singleton instance
const canvasRenderService = new CanvasRenderService();
export default canvasRenderService;