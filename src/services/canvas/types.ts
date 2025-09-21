import { FormattedReceipt, Theme } from '../receipt/types';

export interface ICanvasRenderService {
  renderReceipt(receipt: FormattedReceipt, theme: Theme, canvas: HTMLCanvasElement): void;
  calculateCanvasSize(receipt: FormattedReceipt): { width: number; height: number };
  applyPaperTexture(canvas: HTMLCanvasElement, theme: Theme): void;
  addTearEffect(canvas: HTMLCanvasElement): void;
}

export type { FormattedReceipt, Theme } from '../receipt/types';