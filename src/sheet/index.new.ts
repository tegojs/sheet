import type { CellRange } from './core/cell_range';
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { useSheetStore } from './store/useSheetStore';

export interface ExtendToolbarOption {
  tip?: string;
  el?: HTMLElement;
  icon?: string;
  onClick?: (data: object, sheet: object) => void;
}

export interface Options {
  mode?: 'edit' | 'read';
  showToolbar?: boolean;
  showGrid?: boolean;
  showContextmenu?: boolean;
  showBottomBar?: boolean;
  extendToolbar?: {
    left?: ExtendToolbarOption[];
    right?: ExtendToolbarOption[];
  };
  autoFocus?: boolean;
  view?: {
    height: () => number;
    width: () => number;
  };
  row?: {
    len: number;
    height: number;
  };
  col?: {
    len: number;
    width: number;
    indexWidth: number;
    minWidth: number;
  };
  style?: {
    bgcolor: string;
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    textwrap: boolean;
    strike: boolean;
    underline: boolean;
    color: string;
    font: {
      name: 'Helvetica';
      size: number;
      bold: boolean;
      italic: false;
    };
  };
}

export type CELL_SELECTED = 'cell-selected';
export type CELLS_SELECTED = 'cells-selected';
export type CELL_EDITED = 'cell-edited';

export type CellMerge = [number, number];

export interface SpreadsheetEventHandler {
  (
    envt: CELL_SELECTED,
    callback: (cell: Cell, rowIndex: number, colIndex: number) => void,
  ): void;
  (
    envt: CELLS_SELECTED,
    callback: (
      cell: Cell,
      parameters: { sri: number; sci: number; eri: number; eci: number },
    ) => void,
  ): void;
  (
    evnt: CELL_EDITED,
    callback: (text: string, rowIndex: number, colIndex: number) => void,
  ): void;
}

export interface ColProperties {
  width?: number;
}

/**
 * Data for representing a cell
 */
export interface CellData {
  text: string;
  style?: number;
  merge?: CellMerge;
}

/**
 * Data for representing a row
 */
export interface RowData {
  cells: {
    [key: number]: CellData;
  };
}

/**
 * Data for representing a sheet
 */
export interface SheetData {
  name?: string;
  freeze?: string;
  styles?: CellStyle[];
  merges?: string[];
  cols?: {
    len?: number;
    [key: number]: ColProperties;
  };
  rows?: {
    [key: number]: RowData;
  };
}

/**
 * Data for representing a spreadsheet
 */
export interface SpreadsheetData {
  [index: number]: SheetData;
}

export interface CellStyle {
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  font?: {
    bold?: boolean;
  };
  bgcolor?: string;
  textwrap?: boolean;
  color?: string;
  border?: {
    top?: string[];
    right?: string[];
    bottom?: string[];
    left?: string[];
  };
}

export type Editor = {};
export type Element = {};
export type Row = {};
export type Table = {};
export type Cell = {};
export type Sheet = {};

/**
 * React-based Spreadsheet API
 * 兼容旧版 API，但使用新的 React + Zustand 架构
 */
export default class Spreadsheet {
  #options: Options;
  #container: HTMLElement;

  static targets = new WeakMap<HTMLElement, Spreadsheet>();

  static makeSheet(el: HTMLElement, options: Options = {}) {
    // 防止同一个 DOM 上面挂载多次
    if (Spreadsheet.targets.has(el)) {
      const sheet = Spreadsheet.targets.get(el);
      if (sheet) {
        return sheet;
      }
    }
    const sheet = new Spreadsheet(el, options);
    Spreadsheet.targets.set(el, sheet);
    return sheet;
  }

  private constructor(targetEl: HTMLElement, options: Options = {}) {
    this.#options = { showBottomBar: true, ...options };
    this.#container = targetEl;

    // TODO: 使用 ReactDOM 渲染 ReactSheet 组件到 targetEl
    // 这需要在实际使用时通过 ReactDOM.render 或 createRoot 来实现
  }

  on(eventName: string, func: Function) {
    if (eventName === 'change') {
      useSheetStore.getState().addChangeListener(func as any);
    }
    return this;
  }

  reRender() {
    // React 会自动重新渲染
    return this;
  }

  /**
   * retrieve cell
   */
  cell(rowIndex: number, colIndex: number, sheetIndex = 0): Cell {
    const sheets = useSheetStore.getState().sheets;
    return sheets[sheetIndex]?.getCell(rowIndex, colIndex);
  }

  /**
   * retrieve cell style
   */
  cellStyle(rowIndex: number, colIndex: number, sheetIndex = 0): CellStyle {
    const sheets = useSheetStore.getState().sheets;
    return sheets[sheetIndex]?.getCellStyle(rowIndex, colIndex);
  }

  /**
   * get/set cell text
   */
  cellText(
    rowIndex: number,
    colIndex: number,
    text: string,
    sheetIndex = 0,
  ): this {
    const sheets = useSheetStore.getState().sheets;
    sheets[sheetIndex]?.setCellText(rowIndex, colIndex, text, 'finished');
    return this;
  }

  /**
   * remove current sheet
   */
  deleteSheet(): void {
    const { activeSheetIndex, deleteSheet } = useSheetStore.getState();
    deleteSheet(activeSheetIndex);
  }

  /**
   * load data
   */
  loadData(data: Record<string, any>): this {
    useSheetStore.getState().loadData(data);
    return this;
  }

  /**
   * get data
   */
  getData(): Record<string, any> {
    return useSheetStore.getState().getData();
  }

  validate() {
    const data = useSheetStore.getState().getActiveSheet();
    const { validations } = data;
    return validations.errors.size <= 0;
  }

  /**
   * bind handler to change event
   */
  change(callback: (json: Record<string, any>) => void): this {
    useSheetStore.getState().addChangeListener(callback);
    return this;
  }

  /**
   * set locale
   */
  static locale(lang: string, message: object): void {
    // TODO: 实现国际化
  }

  addSheet(name?: string, active = true) {
    useSheetStore.getState().addSheet(name, active);
  }
}

// 导出新的 React 组件
export { default as ReactSheet } from './ReactSheet.new';

// 导出 store 和 hooks
export {
  useSheetStore,
  useActiveSheet,
  useSelection,
  useIsEditing,
} from './store/useSheetStore';
export * from './hooks';
export * from './components';
