/**
 * 共享类型定义
 * 用于消除代码库中的 any 类型
 */

// ============================================================================
// Store 相关类型
// ============================================================================

/**
 * 单元格样式值类型
 * 可以是字符串、数字、布尔值或对象
 */
export type StyleValue = string | number | boolean | Record<string, unknown>;

/**
 * 表格数据输入类型
 * 用于 loadData 方法
 */
export interface SheetDataInput {
  name?: string;
  freeze?: string;
  styles?: CellStyle[];
  merges?: string[];
  cols?: {
    len?: number;
    [key: number]: { width?: number };
  };
  rows?: {
    [key: number]: {
      cells: {
        [key: number]: {
          text: string;
          style?: number;
          merge?: [number, number];
        };
      };
    };
  };
}

/**
 * 变更监听器类型
 */
export type ChangeListener = (data: SheetDataInput | SheetDataInput[]) => void;

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

// ============================================================================
// Canvas 绘制相关类型
// ============================================================================

/**
 * 边框样式 [线型, 颜色, 宽度]
 */
export type BorderStyle = [string, string, string];

/**
 * 绘制框选项
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
 * 绘制框参数
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
 * Canvas 渲染上下文选项
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
 * 绘制回调函数类型
 */
export type DrawTextCallback = (text: string) => void;

// ============================================================================
// 视图渲染相关类型
// ============================================================================

/**
 * 视图范围
 * 定义可见区域的行列范围
 */
export interface ViewRange {
  sri: number; // start row index
  sci: number; // start column index
  eri: number; // end row index
  eci: number; // end column index
  w: number; // width
  h: number; // height
  each?: (
    cb: (ri: number, ci: number) => void,
    filteredCb?: (ri: number) => boolean,
  ) => void;
  intersects?: (
    other: ViewRange | { sri: number; sci: number; eri: number; eci: number },
  ) => boolean;
  clone?: () => ViewRange;
}

/**
 * 合并单元格信息
 */
export interface MergeInfo {
  sri: number; // start row index
  sci: number; // start column index
  eri: number; // end row index
  eci: number; // end column index
}

/**
 * 单元格矩形信息
 */
export interface CellRect {
  ri: number; // row index
  ci: number; // column index
  left: number;
  top: number;
  width: number;
  height: number;
}

// ============================================================================
// 验证相关类型
// ============================================================================

/**
 * 验证类型
 */
export type ValidationType =
  | 'number'
  | 'email'
  | 'phone'
  | 'list'
  | 'date'
  | 'custom';

/**
 * 验证操作符
 */
export type ValidationOperator =
  | 'be' // between
  | 'nbe' // not between
  | 'eq' // equal
  | 'neq' // not equal
  | 'lt' // less than
  | 'lte' // less than or equal
  | 'gt' // greater than
  | 'gte'; // greater than or equal

/**
 * 验证规则
 */
export interface ValidationRule {
  type: ValidationType;
  required: boolean;
  value: string | string[];
  operator: ValidationOperator;
}

/**
 * 验证模式
 */
export type ValidationMode = 'stop' | 'alert' | 'hint';

/**
 * 验证数据
 */
export interface ValidationData {
  refs: string[]; // 单元格引用，如 ['A1', 'B2:C3']
  mode: ValidationMode; // 验证模式
  type: ValidationType;
  required: boolean;
  operator: ValidationOperator;
  value: string | string[];
}

/**
 * 验证错误信息
 */
export interface ValidationError {
  ri: number;
  ci: number;
  message: string;
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * 范围选择器回调
 */
export type RangeCallback<T = unknown> = (value: T) => void;

/**
 * 事件监听器
 */
export type EventListener<T = unknown> = (event: T) => void;

/**
 * 公式映射类型
 */
export interface FormulaMap {
  [key: string]: {
    render: (params: unknown[]) => unknown;
  };
}

/**
 * 单元格渲染函数类型
 */
export type CellRenderFn = (x: number, y: number) => string | number;

/**
 * 格式化映射类型
 */
export interface FormatMap {
  [key: string]: {
    render: (value: string) => string;
  };
}

/**
 * 消息映射类型
 */
export interface Messages {
  [key: string]: string | Messages;
}

/**
 * 绘制框类型（完整版）
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
