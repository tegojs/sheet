/* eslint-disable @typescript-eslint/no-empty-object-type */
import { locale } from './locale/locale';
import { useSheetStore } from './store/useSheetStore';
import type {
  Cell,
  CellStyle,
  ChangeListener,
  Messages,
  SheetDataInput,
} from './types/index';

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
    format?: string;
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

// Re-export Cell and CellStyle from types
export type { Cell, CellStyle } from './types/index';

export type Editor = Record<string, unknown>;
export type Element = Record<string, unknown>;
export type Row = Record<string, unknown>;
export type Table = Record<string, unknown>;
export type Sheet = Record<string, unknown>;

/**
 * TegoSheet - React-based Spreadsheet API
 * @tego/sheet
 */
export default class Spreadsheet {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private constructor(_targetEl: HTMLElement, _options: Options = {}) {
    // TODO: 使用 ReactDOM 渲染 ReactSheet 组件到 targetEl
    // 这需要在实际使用时通过 ReactDOM.render 或 createRoot 来实现
  }

  on(eventName: string, func: ChangeListener): this {
    if (eventName === 'change') {
      useSheetStore.getState().addChangeListener(func);
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
  cell(rowIndex: number, colIndex: number, sheetIndex = 0): Cell | null {
    const sheets = useSheetStore.getState().sheets;
    return sheets[sheetIndex]?.getCell(rowIndex, colIndex) || null;
  }

  /**
   * retrieve cell style
   */
  cellStyle(
    rowIndex: number,
    colIndex: number,
    sheetIndex = 0,
  ): CellStyle | null {
    const sheets = useSheetStore.getState().sheets;
    return sheets[sheetIndex]?.getCellStyle(rowIndex, colIndex) || null;
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
  loadData(data: SheetDataInput | SheetDataInput[]): this {
    useSheetStore.getState().loadData(data);
    return this;
  }

  /**
   * get data
   */
  getData(): SheetDataInput[] {
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
  change(callback: ChangeListener): this {
    useSheetStore.getState().addChangeListener(callback);
    return this;
  }

  /**
   * set locale
   */
  static locale(lang: string, message: Messages): void {
    locale(lang, message);
  }

  addSheet(name?: string, active = true) {
    useSheetStore.getState().addSheet(name, active);
  }
}

export * from './components';
export * from './hooks';
// Export store and hooks
export {
  useActiveSheet,
  useIsEditing,
  useSelection,
  useSheetStore,
} from './store/useSheetStore';
// Export TegoSheet React component (ReactSheet alias for backward compatibility)
export { default as TegoSheet, ReactSheet } from './TegoSheet';
