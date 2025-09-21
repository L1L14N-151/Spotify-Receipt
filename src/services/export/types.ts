export interface IExportService {
  exportAsPNG(canvas: HTMLCanvasElement, filename?: string): Promise<void>;
  copyToClipboard(canvas: HTMLCanvasElement): Promise<boolean>;
  getDataURL(canvas: HTMLCanvasElement): string;
  downloadImage(blob: Blob, filename: string): void;
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp';
  quality?: number;
  filename?: string;
}