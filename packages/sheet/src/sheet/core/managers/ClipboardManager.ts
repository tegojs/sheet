import { t } from '../../locale/locale';
import type { Cell } from '../../types/index';
import { CellRange } from '../cellRange';
import type Clipboard from '../clipboard';
import type { Merges } from '../merge';
import type { Rows } from '../row';
import type Selector from '../selector';

/**
 * ClipboardManager - Handles all clipboard-related operations
 *
 * Responsibilities:
 * - Copy/Cut/Paste operations (internal clipboard)
 * - System clipboard integration
 * - Autofill functionality
 * - Clipboard content parsing
 */
export class ClipboardManager {
  private clipboard: Clipboard;
  private rows: Rows;
  private merges: Merges;
  private selector: Selector;
  private getCell: (ri: number, ci: number) => Cell | null;
  private setCellText: (
    ri: number,
    ci: number,
    text: string,
    state?: string,
  ) => void;
  private changeData: (cb: () => void) => void;

  constructor(
    clipboard: Clipboard,
    rows: Rows,
    merges: Merges,
    selector: Selector,
    getCell: (ri: number, ci: number) => Cell | null,
    setCellText: (ri: number, ci: number, text: string, state?: string) => void,
    changeData: (cb: () => void) => void,
  ) {
    this.clipboard = clipboard;
    this.rows = rows;
    this.merges = merges;
    this.selector = selector;
    this.getCell = getCell;
    this.setCellText = setCellText;
    this.changeData = changeData;
  }

  /**
   * Copy selected cells to internal clipboard
   */
  copy(): void {
    this.clipboard.copy(this.selector.range);
  }

  /**
   * Cut selected cells to internal clipboard
   */
  cut(): void {
    this.clipboard.cut(this.selector.range);
  }

  /**
   * Clear internal clipboard
   */
  clearClipboard(): void {
    this.clipboard.clear();
  }

  /**
   * Check if paste operation is valid
   */
  private canPaste(
    src: CellRange,
    dst: CellRange,
    error: (msg: string) => void = () => {},
  ): boolean {
    const { merges } = this;
    const cellRange = dst.clone();
    const [srn, scn] = src.size();
    const [drn, dcn] = dst.size();
    if (srn > drn) {
      cellRange.eri = dst.sri + srn - 1;
    }
    if (scn > dcn) {
      cellRange.eci = dst.sci + scn - 1;
    }
    if (merges.intersects(cellRange)) {
      error(t('error.pasteForMergedCell'));
      return false;
    }
    return true;
  }

  /**
   * Copy and paste cells from source to destination
   */
  private copyPaste(
    srcCellRange: CellRange,
    dstCellRange: CellRange,
    what: string,
    autofill = false,
  ): void {
    const { rows, merges } = this;
    // delete dest merge
    if (what === 'all' || what === 'format') {
      rows.deleteCells(dstCellRange, what);
      merges.deleteWithin(dstCellRange);
    }
    rows.copyPaste(
      srcCellRange,
      dstCellRange,
      what,
      autofill,
      (ri: number, ci: number, cell: import('../row').Cell) => {
        if (cell?.merge) {
          const [rn, cn] = cell.merge;
          if (rn <= 0 && cn <= 0) return;
          merges.add(new CellRange(ri, ci, ri + rn, ci + cn));
        }
      },
    );
  }

  /**
   * Cut and paste cells from source to destination
   */
  private cutPaste(srcCellRange: CellRange, dstCellRange: CellRange): void {
    const { clipboard, rows, merges } = this;
    rows.cutPaste(srcCellRange, dstCellRange);
    merges.move(
      srcCellRange,
      dstCellRange.sri - srcCellRange.sri,
      dstCellRange.sci - srcCellRange.sci,
    );
    clipboard.clear();
  }

  /**
   * Paste from internal clipboard
   * @param what - what to paste: 'all' | 'text' | 'format'
   * @param error - error callback
   * @returns true if paste was successful
   */
  paste(what = 'all', error: (msg: string) => void = () => {}): boolean {
    const { clipboard, selector } = this;
    if (clipboard.isClear() || clipboard.range === null) return false;
    if (!this.canPaste(clipboard.range, selector.range, error)) return false;

    this.changeData(() => {
      if (clipboard.range === null) return;
      if (clipboard.isCopy()) {
        this.copyPaste(clipboard.range, selector.range, what);
      } else if (clipboard.isCut()) {
        this.cutPaste(clipboard.range, selector.range);
      }
    });
    return true;
  }

  /**
   * Copy selected cells to system clipboard
   */
  copyToSystemClipboard(evt: ClipboardEvent): void {
    const copyRows: string[][] = [];
    const { sri, eri, sci, eci } = this.selector.range;

    for (let ri = sri; ri <= eri; ri += 1) {
      const row: string[] = [];
      for (let ci = sci; ci <= eci; ci += 1) {
        const cell = this.getCell(ri, ci);
        row.push(cell?.text || '');
      }
      copyRows.push(row);
    }

    // Adding \n (not \r\n) for compatibility with online office and MS Office/WPS
    const copyText = copyRows.map((row) => row.join('\t')).join('\n');

    // Use event clipboardData for HTTP protocol
    if (evt?.clipboardData) {
      evt.clipboardData.clearData();
      evt.clipboardData.setData('text/plain', copyText);
      evt.preventDefault();
    }

    // Use navigator.clipboard for HTTPS protocol
    if (navigator.clipboard) {
      navigator.clipboard.writeText(copyText).then(
        () => {},
        (err) => {
          console.log('text copy to the system clipboard error', copyText, err);
        },
      );
    }
  }

  /**
   * Paste from system clipboard
   */
  pasteFromSystemClipboard(
    resetSheet: () => void,
    eventTrigger: (data: unknown) => void,
  ): void {
    const { selector } = this;
    navigator.clipboard.readText().then((content) => {
      const contentToPaste = this.parseClipboardContent(content);
      let startRow = selector.ri;
      contentToPaste.forEach((row: string[]) => {
        let startColumn = selector.ci;
        row.forEach((cellContent: string) => {
          this.setCellText(startRow, startColumn, cellContent, 'input');
          startColumn += 1;
        });
        startRow += 1;
      });
      resetSheet();
      eventTrigger(this.rows.getData());
    });
  }

  /**
   * Parse clipboard content into 2D array
   */
  parseClipboardContent(clipboardContent: string): string[][] {
    const parsedData: string[][] = [];
    const rows = clipboardContent.split('\n');

    let i = 0;
    rows.forEach((row: string) => {
      parsedData[i] = row.split('\t');
      i += 1;
    });
    return parsedData;
  }

  /**
   * Paste from text string
   */
  pasteFromText(txt: string): void {
    let lines: string[][] = [];

    if (/\r\n/.test(txt)) {
      lines = txt
        .split('\r\n')
        .map((it: string) => it.replace(/"/g, '').split('\t'));
    } else {
      lines = txt
        .split('\n')
        .map((it: string) => it.replace(/"/g, '').split('\t'));
    }

    if (lines.length) {
      const { rows, selector } = this;
      this.changeData(() => {
        rows.paste(lines, selector.range);
      });
    }
  }

  /**
   * Autofill cells in range
   */
  autofill(
    cellRange: CellRange,
    what: string,
    error: (msg: string) => void = () => {},
  ): boolean {
    const srcRange = this.selector.range;
    if (!this.canPaste(srcRange, cellRange, error)) return false;
    this.changeData(() => {
      this.copyPaste(srcRange, cellRange, what, true);
    });
    return true;
  }

  /**
   * Get clipboard rect for rendering
   */
  getClipboardRect(
    getRect: (range: CellRange) => {
      left: number;
      top: number;
      width?: number;
      height?: number;
    },
  ): { left: number; top: number; width?: number; height?: number } {
    const { clipboard } = this;
    if (!clipboard.isClear() && clipboard.range !== null) {
      return getRect(clipboard.range);
    }
    return { left: -100, top: -100 };
  }
}
