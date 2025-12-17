/**
 * Text rendering helper functions
 */

import { npx } from './draw';
import { DrawConfig } from './drawConfig';
import { textMeasureCache } from './textMeasureCache';

/**
 * Font configuration for text rendering
 */
export interface FontConfig {
  name: string;
  size: number;
  bold?: boolean;
  italic?: boolean;
}

/**
 * Text attributes for rendering
 */
export interface TextAttributes {
  align: string;
  valign: string;
  font: FontConfig;
  color: string;
  strike?: boolean;
  underline?: boolean;
}

/**
 * Build a CSS font string from font configuration
 */
export function buildFontString(font: FontConfig): string {
  const italic = font.italic ? 'italic ' : '';
  const bold = font.bold ? 'bold ' : '';
  return `${italic}${bold}${npx(font.size)}px ${font.name}`;
}

/**
 * Wrap a single line of text by character when it exceeds max width
 */
function wrapLineByChar(
  ctx: CanvasRenderingContext2D,
  line: string,
  maxWidth: number,
  font: string,
): string[] {
  const lines: string[] = [];
  const { charSpacingAdjustment } = DrawConfig.text;
  let textLine = { w: 0, len: 0, start: 0 };

  for (let i = 0; i < line.length; i += 1) {
    if (textLine.w >= maxWidth) {
      lines.push(line.substr(textLine.start, textLine.len));
      textLine = { w: 0, len: 0, start: i };
    }
    textLine.len += 1;
    textLine.w +=
      textMeasureCache.measure(ctx, line[i], font) + charSpacingAdjustment;
  }

  if (textLine.len > 0) {
    lines.push(line.substr(textLine.start, textLine.len));
  }

  return lines;
}

/**
 * Wrap text to fit within a maximum width
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string,
): string[] {
  const lines: string[] = [];

  for (const rawLine of text.split('\n')) {
    const lineWidth = textMeasureCache.measure(ctx, rawLine, font);
    if (lineWidth <= maxWidth) {
      lines.push(rawLine);
    } else {
      lines.push(...wrapLineByChar(ctx, rawLine, maxWidth, font));
    }
  }

  return lines;
}

/**
 * Calculate decoration line offset based on alignment
 */
export function calculateDecorationOffset(
  type: 'strike' | 'underline',
  align: string,
  valign: string,
  textHeight: number,
  textWidth: number,
): { x: number; y: number } {
  const offset = { x: 0, y: 0 };

  if (type === 'underline') {
    if (valign === 'bottom') {
      offset.y = 0;
    } else if (valign === 'top') {
      offset.y = -(textHeight + 2);
    } else {
      offset.y = -textHeight / 2;
    }
  } else if (type === 'strike') {
    if (valign === 'bottom') {
      offset.y = textHeight / 2;
    } else if (valign === 'top') {
      offset.y = -(textHeight / 2 + 2);
    }
  }

  if (align === 'center') {
    offset.x = textWidth / 2;
  } else if (align === 'right') {
    offset.x = textWidth;
  }

  return offset;
}

/**
 * Calculate total text height for wrapped lines
 */
export function calculateTextHeight(
  lineCount: number,
  fontSize: number,
): number {
  const { lineSpacing } = DrawConfig.text;
  return (lineCount - 1) * (fontSize + lineSpacing);
}
