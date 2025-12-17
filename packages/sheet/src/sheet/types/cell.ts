/**
 * Cell and Style Types
 */

import type { BorderStyle } from './canvas';

/**
 * 单元格样式值类型
 */
export type StyleValue = string | number | boolean | Record<string, unknown>;

/**
 * 单元格样式
 */
export interface CellStyle {
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  font?: {
    bold?: boolean;
    italic?: boolean;
    name?: string;
    size?: number;
  };
  bgcolor?: string;
  textwrap?: boolean;
  color?: string;
  strike?: boolean;
  underline?: boolean;
  border?: {
    top?: BorderStyle;
    right?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
  };
  format?: string;
}

/**
 * 完整的单元格样式（用于默认样式）
 */
export interface CellStyleFull {
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
  font: {
    bold: boolean;
    italic: boolean;
    name: string;
    size: number;
  };
  bgcolor: string;
  textwrap: boolean;
  color: string;
  strike: boolean;
  underline: boolean;
  format: string;
}

/**
 * 单元格数据
 */
export interface Cell {
  text?: string;
  style?: number;
  merge?: [number, number];
  editable?: boolean;
  [key: string]: unknown;
}

/**
 * 单元格合并
 */
export type CellMerge = [number, number];

/**
 * 单元格矩形信息
 */
export interface CellRect {
  ri: number;
  ci: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * 合并单元格信息
 */
export interface MergeInfo {
  sri: number;
  sci: number;
  eri: number;
  eci: number;
}
