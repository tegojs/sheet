import type { Cell } from '../../types';
import { CellRange } from '../cellRange';
import type { Cols } from '../col';
import { rangeReduceIf } from '../helper';
import type { Merges } from '../merge';
import type { Rows } from '../row';
import type Scroll from '../scroll';
import type Selector from '../selector';

/**
 * SelectionManager - Handles all selection-related operations
 *
 * Responsibilities:
 * - Selection range calculation
 * - Cell position lookup by coordinates
 * - Selection rect calculation
 * - Selected cell management
 */
export class SelectionManager {
  private rows: Rows;
  private cols: Cols;
  private merges: Merges;
  private selector: Selector;
  private scroll: Scroll;
  private exceptRowSet: Set<number>;
  private unsortedRowMap: Map<number, number>;
  private freezeTotalWidth: () => number;
  private freezeTotalHeight: () => number;

  constructor(
    rows: Rows,
    cols: Cols,
    merges: Merges,
    selector: Selector,
    scroll: Scroll,
    exceptRowSet: Set<number>,
    unsortedRowMap: Map<number, number>,
    freezeTotalWidth: () => number,
    freezeTotalHeight: () => number,
  ) {
    this.rows = rows;
    this.cols = cols;
    this.merges = merges;
    this.selector = selector;
    this.scroll = scroll;
    this.exceptRowSet = exceptRowSet;
    this.unsortedRowMap = unsortedRowMap;
    this.freezeTotalWidth = freezeTotalWidth;
    this.freezeTotalHeight = freezeTotalHeight;
  }

  /**
   * Update exceptRowSet reference
   */
  setExceptRowSet(exceptRowSet: Set<number>): void {
    this.exceptRowSet = exceptRowSet;
  }

  /**
   * Update unsortedRowMap reference
   */
  setUnsortedRowMap(unsortedRowMap: Map<number, number>): void {
    this.unsortedRowMap = unsortedRowMap;
  }

  /**
   * Calculate selected range by end position (during drag selection)
   */
  calSelectedRangeByEnd(ri: number, ci: number): CellRange {
    const { selector, rows, cols, merges } = this;
    let { sri, sci, eri, eci } = selector.range;
    const cri = selector.ri;
    const cci = selector.ci;
    let [nri, nci] = [ri, ci];

    if (ri < 0) nri = rows.len - 1;
    if (ci < 0) nci = cols.len - 1;

    if (nri > cri) [sri, eri] = [cri, nri];
    else [sri, eri] = [nri, cri];

    if (nci > cci) [sci, eci] = [cci, nci];
    else [sci, eci] = [nci, cci];

    selector.range = merges.union(new CellRange(sri, sci, eri, eci));
    selector.range = merges.union(selector.range);

    return selector.range;
  }

  /**
   * Calculate selected range by start position (on click)
   */
  calSelectedRangeByStart(ri: number, ci: number): CellRange {
    const { selector, rows, cols, merges } = this;
    let cellRange = merges.getFirstIncludes(ri, ci);

    if (cellRange === null) {
      cellRange = new CellRange(ri, ci, ri, ci);
      if (ri === -1) {
        cellRange.sri = 0;
        cellRange.eri = rows.len - 1;
      }
      if (ci === -1) {
        cellRange.sci = 0;
        cellRange.eci = cols.len - 1;
      }
    }

    selector.range = cellRange;
    return cellRange;
  }

  /**
   * Get selected cell (accounting for sorted rows)
   */
  getSelectedCell(): Cell | null {
    const { ri, ci } = this.selector;
    let nri = ri;
    if (this.unsortedRowMap.has(ri)) {
      nri = this.unsortedRowMap.get(ri) || ri;
    }
    return this.rows.getCell(nri, ci);
  }

  /**
   * Check if XY coordinates are within selected rect
   */
  xyInSelectedRect(x: number, y: number): boolean {
    const { left, top, width, height } = this.getSelectedRect();
    const x1 = x - this.cols.indexWidth;
    const y1 = y - this.rows.height;
    return (
      width !== undefined &&
      height !== undefined &&
      x1 > left &&
      x1 < left + width &&
      y1 > top &&
      y1 < top + height
    );
  }

  /**
   * Get rect for selected range
   */
  getSelectedRect(): {
    l: number;
    t: number;
    left: number;
    top: number;
    height?: number;
    width?: number;
    scroll: Scroll;
  } {
    return this.getRect(this.selector.range);
  }

  /**
   * Get rect for a cell range
   */
  getRect(cellRange: CellRange): {
    l: number;
    t: number;
    left: number;
    top: number;
    height?: number;
    width?: number;
    scroll: Scroll;
  } {
    const { scroll, rows, cols, exceptRowSet } = this;
    const { sri, sci, eri, eci } = cellRange;

    // no selector
    if (sri < 0 && sci < 0) {
      return {
        left: 0,
        l: 0,
        top: 0,
        t: 0,
        scroll,
      };
    }

    const left = cols.sumWidth(0, sci);
    const top = rows.sumHeight(0, sri, exceptRowSet);
    const height = rows.sumHeight(sri, eri + 1, exceptRowSet);
    const width = cols.sumWidth(sci, eci + 1);

    let left0 = left - scroll.x;
    let top0 = top - scroll.y;

    const fsh = this.freezeTotalHeight();
    const fsw = this.freezeTotalWidth();

    if (fsw > 0 && fsw > left) {
      left0 = left;
    }
    if (fsh > 0 && fsh > top) {
      top0 = top;
    }

    return {
      l: left,
      t: top,
      left: left0,
      top: top0,
      height,
      width,
      scroll,
    };
  }

  /**
   * Get cell row by Y coordinate
   */
  private getCellRowByY(
    y: number,
    scrollOffsety: number,
  ): { ri: number; top: number; height: number } {
    const { rows } = this;
    const fsh = this.freezeTotalHeight();

    let inits = rows.height;
    if (fsh + rows.height < y) inits -= scrollOffsety;

    const frset = this.exceptRowSet;

    let ri = 0;
    let top = inits;
    let { height } = rows;

    for (; ri < rows.len; ri += 1) {
      if (top > y) break;
      if (!frset.has(ri)) {
        height = rows.getHeight(ri);
        top += height;
      }
    }

    top -= height;

    if (top <= 0) {
      return { ri: -1, top: 0, height };
    }

    return { ri: ri - 1, top, height };
  }

  /**
   * Get cell column by X coordinate
   */
  private getCellColByX(
    x: number,
    scrollOffsetx: number,
  ): { ci: number; left: number; width: number } {
    const { cols } = this;
    const fsw = this.freezeTotalWidth();

    let inits = cols.indexWidth;
    if (fsw + cols.indexWidth < x) inits -= scrollOffsetx;

    const [ci, left, width] = rangeReduceIf(
      0,
      cols.len,
      inits,
      cols.indexWidth,
      x,
      (i: number) => cols.getWidth(i),
    );

    if (left <= 0) {
      return { ci: -1, left: 0, width: cols.indexWidth };
    }

    return { ci: ci - 1, left, width };
  }

  /**
   * Get cell rect by XY coordinates
   */
  getCellRectByXY(
    x: number,
    y: number,
    cellRect: (
      ri: number,
      ci: number,
    ) => {
      left: number;
      top: number;
      width: number;
      height: number;
      cell: Cell | null;
    },
  ): {
    ri: number;
    ci: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } {
    const { scroll, merges, rows, cols } = this;
    let { ri, top, height } = this.getCellRowByY(y, scroll.y);
    let { ci, left, width } = this.getCellColByX(x, scroll.x);

    if (ci === -1) {
      width = cols.totalWidth();
    }
    if (ri === -1) {
      height = rows.totalHeight();
    }

    if (ri >= 0 || ci >= 0) {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        ri = merge.sri;
        ci = merge.sci;
        ({ left, top, width, height } = cellRect(ri, ci));
      }
    }

    return {
      ri,
      ci,
      left,
      top,
      width,
      height,
    };
  }

  /**
   * Check if only single cell is selected (including merged cells)
   */
  isSingleSelected(): boolean {
    const { sri, sci, eri, eci } = this.selector.range;
    const cell = this.rows.getCell(sri, sci);
    if (cell?.merge) {
      const [rn, cn] = cell.merge;
      if (sri + rn === eri && sci + cn === eci) return true;
    }
    return !this.selector.multiple();
  }

  /**
   * Check if can unmerge (merged cell is selected)
   */
  canUnmerge(): boolean {
    const { sri, sci, eri, eci } = this.selector.range;
    const cell = this.rows.getCell(sri, sci);
    if (cell?.merge) {
      const [rn, cn] = cell.merge;
      if (sri + rn === eri && sci + cn === eci) return true;
    }
    return false;
  }
}
