/* eslint-disable @typescript-eslint/no-empty-object-type */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
import Bottombar from './component/bottombar';
import { cssPrefix } from './configs';
import { locale } from './locale/locale';

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
export interface Editor {}
export interface Element {}

export interface Row {}
export interface Table {}
export interface Cell {}
export interface Sheet {}

export default class Spreadsheet {
  #options: Options;
  #sheetIndex: number = 1;
  #datas: any;
  #data: any;
  #sheet: any;

  static targets = new WeakMap<HTMLElement, Spreadsheet>();

  #bottomBar;

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
  }

  private constructor(targetEl: HTMLElement, options: Options = {}) {
    this.#options = { showBottomBar: true, ...options };
    this.#datas = [];
    this.#bottomBar = this.#options.showBottomBar
      ? new Bottombar(
          () => {
            if (this.#options.mode === 'read') return;
            const d = this.addSheet();
            this.#sheet.resetData(d);
          },
          (index: number) => {
            const d = this.#datas[index];
            this.#sheet.resetData(d);
          },
          () => {
            this.deleteSheet();
          },
          (index: number, value: string) => {
            this.#datas[index].name = value;
            this.#sheet.trigger('change');
          },
        )
      : null;
    this.#data = this.addSheet();
    const rootEl = h('div', `${cssPrefix}`).on('contextmenu', (evt: Event) =>
      evt.preventDefault(),
    );
    // create canvas element
    targetEl.appendChild(rootEl.el);
    this.#sheet = new Sheet(rootEl, this.#data);
    if (this.#bottomBar !== null) {
      rootEl.child(this.#bottomBar.el);
    }
  }
  on(eventName: string, func: Function) {
    this.#sheet.on(eventName, func);
    return this;
  }
  reRender() {
    this.#sheet.table.render();
    return this;
  }
  /**
   * retrieve cell
   * @param rowIndex {number} row index
   * @param colIndex {number} column index
   * @param sheetIndex {number} sheet iindex
   */
  cell(rowIndex: number, colIndex: number, sheetIndex: number = 0): Cell {
    return this.#datas[sheetIndex].getCell(rowIndex, colIndex);
  }
  /**
   * retrieve cell style
   * @param rowIndex
   * @param colIndex
   * @param sheetIndex
   */
  cellStyle(
    rowIndex: number,
    colIndex: number,
    sheetIndex: number = 0,
  ): CellStyle {
    return this.#datas[sheetIndex].getCellStyle(rowIndex, colIndex);
  }
  /**
   * get/set cell text
   * @param rowIndex
   * @param colIndex
   * @param text
   * @param sheetIndex
   */
  cellText(
    rowIndex: number,
    colIndex: number,
    text: string,
    sheetIndex: number = 0,
  ): this {
    this.#datas[sheetIndex].setCellText(rowIndex, colIndex, text, 'finished');
    return this;
  }
  /**
   * remove current sheet
   */
  deleteSheet(): void {
    if (this.#bottomBar === null) return;

    const [oldIndex, nindex] = this.#bottomBar.deleteItem();
    if (oldIndex >= 0) {
      this.#datas.splice(oldIndex, 1);
      if (nindex >= 0) this.#sheet.resetData(this.#datas[nindex]);
      this.#sheet.trigger('change');
    }
  }

  /**s
   * load data
   * @param data
   */
  loadData(data: Record<string, any>): this {
    const ds = Array.isArray(data) ? data : [data];
    if (this.#bottomBar !== null) {
      this.#bottomBar.clear();
    }
    this.#datas = [];
    if (ds.length > 0) {
      for (let i = 0; i < ds.length; i += 1) {
        const it = ds[i];
        const nd = this.addSheet(it.name, i === 0);
        nd.setData(it);
        if (i === 0) {
          this.#sheet.resetData(nd);
        }
      }
    }
    return this;
  }
  /**
   * get data
   */
  getData(): Record<string, any> {
    return this.#datas.map((it) => it.getData());
  }

  validate() {
    const { validations } = this.#data;
    return validations.errors.size <= 0;
  }

  /**
   * bind handler to change event, including data change and user actions
   * @param callback
   */
  change(callback: (json: Record<string, any>) => void): this {
    this.#sheet.on('change', callback);
    return this;
  }
  /**
   * set locale
   * @param lang
   * @param message
   */
  static locale(lang: string, message: object): void {
    locale(lang, message);
  }

  addSheet(name?: string, active = true) {
    const n = name || `sheet${this.#sheetIndex}`;
    const d = new DataProxy(n, this.#options);
    d.change = (...args) => {
      this.#sheet.trigger('change', ...args);
    };
    this.#datas.push(d);
    // console.log('d:', n, d, this.datas);
    if (this.#bottomBar !== null) {
      this.#bottomBar.addItem(n, active, this.#options);
    }
    this.#sheetIndex += 1;
    return d;
  }
}

export { default as ReactSheet } from './ReactSheet';
