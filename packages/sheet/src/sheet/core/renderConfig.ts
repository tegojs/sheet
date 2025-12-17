/**
 * Render Configuration
 *
 * Centralized configuration for rendering colors and styles.
 * These values should match the LESS variables in sheet.less
 */

// Selection colors
export const SELECTION_COLOR = 'rgb(75, 137, 255)';
export const SELECTION_BG = 'rgba(75, 137, 255, 0.1)';
export const SELECTION_HIGHLIGHT = 'rgba(75, 137, 255, 0.08)';
export const SELECTION_FREEZE_LINE = 'rgba(75, 137, 255, 0.6)';

// Grid colors
export const GRID_LINE_COLOR = '#e6e6e6';
export const GRID_BG_COLOR = '#ffffff';

// Header colors
export const HEADER_BG_COLOR = '#f4f5f8';
export const HEADER_TEXT_COLOR = '#585757';
export const HEADER_HIDDEN_LINE_COLOR = '#c6c6c6';

// Font configuration
export const DEFAULT_FONT_FAMILY = 'Source Sans Pro';
export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_WEIGHT = 500;

/**
 * Get header font style string
 */
export function getHeaderFont(dpr = 1): string {
  return `${DEFAULT_FONT_WEIGHT} ${Math.floor(DEFAULT_FONT_SIZE * dpr)}px ${DEFAULT_FONT_FAMILY}`;
}

/**
 * Render configuration object for easy access
 */
export const RenderConfig = {
  selection: {
    color: SELECTION_COLOR,
    background: SELECTION_BG,
    highlight: SELECTION_HIGHLIGHT,
    freezeLine: SELECTION_FREEZE_LINE,
  },
  grid: {
    lineColor: GRID_LINE_COLOR,
    backgroundColor: GRID_BG_COLOR,
  },
  header: {
    backgroundColor: HEADER_BG_COLOR,
    textColor: HEADER_TEXT_COLOR,
    hiddenLineColor: HEADER_HIDDEN_LINE_COLOR,
  },
  font: {
    family: DEFAULT_FONT_FAMILY,
    size: DEFAULT_FONT_SIZE,
    weight: DEFAULT_FONT_WEIGHT,
    getHeaderFont,
  },
} as const;
