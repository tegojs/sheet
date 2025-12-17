/**
 * Canvas Drawing Types
 */

/**
 * Border style [line type, color, width]
 */
export type BorderStyle = [string, string, string];

/**
 * Draw box options
 */
export interface DrawBoxOptions {
  bgcolor?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  font?: string;
  color?: string;
  strike?: boolean;
  underline?: boolean;
  textwrap?: boolean;
}

/**
 * Draw box parameters
 */
export interface DrawBoxParams {
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: number;
  bgcolor?: string;
  borderTop?: BorderStyle | null;
  borderRight?: BorderStyle | null;
  borderBottom?: BorderStyle | null;
  borderLeft?: BorderStyle | null;
}

/**
 * Canvas rendering context options
 */
export interface CanvasRenderingOptions {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  font?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

/**
 * Draw text callback type
 */
export type DrawTextCallback = (text: string) => void;

/**
 * Draw box type (full version)
 */
export interface DrawBox {
  x: number;
  y: number;
  width: number;
  height: number;
  padding: number;
  bgcolor?: string;
  borderTop?: BorderStyle | null;
  borderRight?: BorderStyle | null;
  borderBottom?: BorderStyle | null;
  borderLeft?: BorderStyle | null;
  textx: (align: string) => number;
  texty: (valign: string, txtHeight: number) => number;
  innerWidth: () => number;
  innerHeight: () => number;
  topxys: () => [number, number][];
  rightxys: () => [number, number][];
  bottomxys: () => [number, number][];
  leftxys: () => [number, number][];
  setBorders: (
    borders: {
      top?: BorderStyle;
      right?: BorderStyle;
      bottom?: BorderStyle;
      left?: BorderStyle;
    } | null,
  ) => void;
}
