/**
 * DataProxy 相关类型定义
 */

import type { BorderStyle, CellStyleFull } from '../types';

/**
 * DataProxy 设置接口
 */
export interface DataProxySettings {
  mode: string;
  view: {
    height: () => number;
    width: () => number;
  };
  showGrid: boolean;
  showToolbar: boolean;
  showContextmenu: boolean;
  showBottomBar: boolean;
  row: {
    len: number;
    height: number;
  };
  col: {
    len: number;
    width: number;
    indexWidth: number;
    minWidth: number;
  };
  style: CellStyleFull;
}

/**
 * 边框模式类型
 */
export type BorderMode =
  | 'all'
  | 'inside'
  | 'horizontal'
  | 'vertical'
  | 'outside'
  | 'left'
  | 'top'
  | 'bottom'
  | 'right'
  | 'none';

/**
 * 边框样式参数
 */
export interface BorderStyleParams {
  top?: BorderStyle;
  right?: BorderStyle;
  bottom?: BorderStyle;
  left?: BorderStyle;
}

/**
 * 行回调函数类型
 */
export type RowEachCallback = (ri: number, y: number, height: number) => void;

/**
 * 列回调函数类型
 */
export type ColEachCallback = (ci: number, x: number, width: number) => void;

/**
 * 单元格坐标
 */
export interface CellCoordinate {
  ri: number;
  ci: number;
}

