import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WEIGHT,
  GRID_BG_COLOR,
  GRID_LINE_COLOR,
  getHeaderFont,
  HEADER_BG_COLOR,
  HEADER_HIDDEN_LINE_COLOR,
  HEADER_TEXT_COLOR,
  RenderConfig,
  SELECTION_BG,
  SELECTION_COLOR,
  SELECTION_FREEZE_LINE,
  SELECTION_HIGHLIGHT,
} from '../../src/sheet/core/renderConfig';

describe('RenderConfig', () => {
  describe('Color Constants', () => {
    it('should have correct selection color', () => {
      expect(SELECTION_COLOR).toBe('rgb(75, 137, 255)');
    });

    it('should have correct selection background', () => {
      expect(SELECTION_BG).toBe('rgba(75, 137, 255, 0.1)');
    });

    it('should have correct selection highlight', () => {
      expect(SELECTION_HIGHLIGHT).toBe('rgba(75, 137, 255, 0.08)');
    });

    it('should have correct selection freeze line color', () => {
      expect(SELECTION_FREEZE_LINE).toBe('rgba(75, 137, 255, 0.6)');
    });

    it('should have correct grid line color', () => {
      expect(GRID_LINE_COLOR).toBe('#e6e6e6');
    });

    it('should have correct grid background color', () => {
      expect(GRID_BG_COLOR).toBe('#ffffff');
    });

    it('should have correct header background color', () => {
      expect(HEADER_BG_COLOR).toBe('#f4f5f8');
    });

    it('should have correct header text color', () => {
      expect(HEADER_TEXT_COLOR).toBe('#585757');
    });

    it('should have correct header hidden line color', () => {
      expect(HEADER_HIDDEN_LINE_COLOR).toBe('#c6c6c6');
    });
  });

  describe('Font Constants', () => {
    it('should have correct default font family', () => {
      expect(DEFAULT_FONT_FAMILY).toBe('Source Sans Pro');
    });

    it('should have correct default font size', () => {
      expect(DEFAULT_FONT_SIZE).toBe(12);
    });

    it('should have correct default font weight', () => {
      expect(DEFAULT_FONT_WEIGHT).toBe(500);
    });
  });

  describe('getHeaderFont', () => {
    it('should return correct font string with dpr=1', () => {
      const font = getHeaderFont(1);
      expect(font).toBe('500 12px Source Sans Pro');
    });

    it('should return correct font string with dpr=2', () => {
      const font = getHeaderFont(2);
      expect(font).toBe('500 24px Source Sans Pro');
    });

    it('should handle fractional dpr', () => {
      const font = getHeaderFont(1.5);
      expect(font).toBe('500 18px Source Sans Pro');
    });
  });

  describe('RenderConfig Object', () => {
    it('should have selection colors', () => {
      expect(RenderConfig.selection.color).toBe(SELECTION_COLOR);
      expect(RenderConfig.selection.background).toBe(SELECTION_BG);
      expect(RenderConfig.selection.highlight).toBe(SELECTION_HIGHLIGHT);
      expect(RenderConfig.selection.freezeLine).toBe(SELECTION_FREEZE_LINE);
    });

    it('should have grid colors', () => {
      expect(RenderConfig.grid.lineColor).toBe(GRID_LINE_COLOR);
      expect(RenderConfig.grid.backgroundColor).toBe(GRID_BG_COLOR);
    });

    it('should have header colors', () => {
      expect(RenderConfig.header.backgroundColor).toBe(HEADER_BG_COLOR);
      expect(RenderConfig.header.textColor).toBe(HEADER_TEXT_COLOR);
      expect(RenderConfig.header.hiddenLineColor).toBe(
        HEADER_HIDDEN_LINE_COLOR,
      );
    });

    it('should have font config', () => {
      expect(RenderConfig.font.family).toBe(DEFAULT_FONT_FAMILY);
      expect(RenderConfig.font.size).toBe(DEFAULT_FONT_SIZE);
      expect(RenderConfig.font.weight).toBe(DEFAULT_FONT_WEIGHT);
      expect(typeof RenderConfig.font.getHeaderFont).toBe('function');
    });
  });
});
