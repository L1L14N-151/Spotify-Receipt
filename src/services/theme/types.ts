import { Theme } from '../receipt/types';

export interface IThemeService {
  getAvailableThemes(): Theme[];
  getTheme(themeId: string): Theme | null;
  getDefaultTheme(): Theme;
  applyTheme(receipt: any, themeId: string): any;
}

export type { Theme } from '../receipt/types';