/**
 * Theme Service
 * Manages receipt themes
 */

import { IThemeService, Theme } from './types';
import { THEMES, getAllThemes, getTheme as getThemeById, getDefaultTheme as getDefault } from '../../models/Theme';

export class ThemeService implements IThemeService {
  getAvailableThemes(): Theme[] {
    return getAllThemes();
  }

  getTheme(themeId: string): Theme | null {
    return getThemeById(themeId);
  }

  getDefaultTheme(): Theme {
    return getDefault();
  }

  applyTheme(receipt: any, themeId: string): any {
    const theme = this.getTheme(themeId);
    if (!theme) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    return {
      ...receipt,
      theme: theme
    };
  }
}

// Export singleton instance
const themeService = new ThemeService();
export default themeService;