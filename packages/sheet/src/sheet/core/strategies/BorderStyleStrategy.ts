import type { CellRange } from '../cellRange';
import type { BorderStyleParams } from '../dataProxyTypes';
import type { Rows } from '../row';

/**
 * Border Style Strategy Interface
 *
 * Strategy pattern for applying different border styles to cell ranges.
 * Each implementation handles a specific border mode (all, inside, outside, etc.)
 */
export interface BorderStyleStrategy {
  /**
   * Apply border style to cells in range
   */
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void;
}

/**
 * Apply all borders to each cell
 */
export class AllBordersStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, sci, eri, eci } = range;
    const merges: [number, number, number, number][] = [];

    for (let ri = sri; ri <= eri; ri += 1) {
      for (let ci = sci; ci <= eci; ci += 1) {
        // Skip merged cells
        const [skipCi, _mergeInfo] = this.handleMerges(ri, ci, merges, eci);
        if (skipCi !== null) {
          ci = skipCi;
          if (ci > eci) break;
        }

        const cell = rows.getCell(ri, ci);
        let [rn, cn] = [0, 0];
        if (cell?.merge) {
          [rn, cn] = cell.merge;
          merges.push([ri, ci, rn, cn]);
        }

        setStyleBorder(ri, ci, {
          bottom: [style, color, ''],
          top: [style, color, ''],
          left: [style, color, ''],
          right: [style, color, ''],
        });

        ci += cn;
      }
    }
  }

  private handleMerges(
    ri: number,
    ci: number,
    merges: [number, number, number, number][],
    _eci: number,
  ): [number | null, [number, number, number, number][] | null] {
    const mergeIndexes: number[] = [];
    let newCi = ci;

    for (let ii = 0; ii < merges.length; ii += 1) {
      const [mri, mci, rn, cn] = merges[ii];
      if (ri === mri + rn + 1) mergeIndexes.push(ii);
      if (mri <= ri && ri <= mri + rn) {
        if (newCi === mci) {
          newCi += cn + 1;
          break;
        }
      }
    }
    for (const it of mergeIndexes) {
      merges.splice(it, 1);
    }

    if (newCi !== ci) {
      return [newCi, merges];
    }
    return [null, null];
  }
}

/**
 * Apply borders only inside the range (not on edges)
 */
export class InsideBordersStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, sci, eri, eci } = range;
    const merges: [number, number, number, number][] = [];

    for (let ri = sri; ri <= eri; ri += 1) {
      for (let ci = sci; ci <= eci; ci += 1) {
        const cell = rows.getCell(ri, ci);
        let [rn, cn] = [0, 0];
        if (cell?.merge) {
          [rn, cn] = cell.merge;
          merges.push([ri, ci, rn, cn]);
        }

        const mrl = rn > 0 && ri + rn === eri;
        const mcl = cn > 0 && ci + cn === eci;
        const bss: BorderStyleParams = {};

        if (!mcl && ci < eci) bss.right = [style, color, ''];
        if (!mrl && ri < eri) bss.bottom = [style, color, ''];

        if (Object.keys(bss).length > 0) {
          setStyleBorder(ri, ci, bss);
        }

        ci += cn;
      }
    }
  }
}

/**
 * Apply borders only on the outside of the range
 */
export class OutsideBordersStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, sci, eri, eci } = range;
    const merges: [number, number, number, number][] = [];

    for (let ri = sri; ri <= eri; ri += 1) {
      for (let ci = sci; ci <= eci; ci += 1) {
        const cell = rows.getCell(ri, ci);
        let [rn, cn] = [0, 0];
        if (cell?.merge) {
          [rn, cn] = cell.merge;
          merges.push([ri, ci, rn, cn]);
        }

        const mrl = rn > 0 && ri + rn === eri;
        const mcl = cn > 0 && ci + cn === eci;
        const bss: BorderStyleParams = {};

        if (sri === ri) bss.top = [style, color, ''];
        if (mrl || eri === ri) bss.bottom = [style, color, ''];
        if (sci === ci) bss.left = [style, color, ''];
        if (mcl || eci === ci) bss.right = [style, color, ''];

        if (Object.keys(bss).length > 0) {
          setStyleBorder(ri, ci, bss);
        }

        ci += cn;
      }
    }
  }
}

/**
 * Apply horizontal borders only
 */
export class HorizontalBordersStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, sci, eri, eci } = range;
    const merges: [number, number, number, number][] = [];

    for (let ri = sri; ri <= eri; ri += 1) {
      for (let ci = sci; ci <= eci; ci += 1) {
        const cell = rows.getCell(ri, ci);
        let [rn, cn] = [0, 0];
        if (cell?.merge) {
          [rn, cn] = cell.merge;
          merges.push([ri, ci, rn, cn]);
        }

        const mrl = rn > 0 && ri + rn === eri;
        if (!mrl && ri < eri) {
          setStyleBorder(ri, ci, { bottom: [style, color, ''] });
        }

        ci += cn;
      }
    }
  }
}

/**
 * Apply vertical borders only
 */
export class VerticalBordersStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, sci, eri, eci } = range;
    const merges: [number, number, number, number][] = [];

    for (let ri = sri; ri <= eri; ri += 1) {
      for (let ci = sci; ci <= eci; ci += 1) {
        const cell = rows.getCell(ri, ci);
        let [rn, cn] = [0, 0];
        if (cell?.merge) {
          [rn, cn] = cell.merge;
          merges.push([ri, ci, rn, cn]);
        }

        const mcl = cn > 0 && ci + cn === eci;
        if (!mcl && ci < eci) {
          setStyleBorder(ri, ci, { right: [style, color, ''] });
        }

        ci += cn;
      }
    }
  }
}

/**
 * Remove all borders
 */
export class NoneBordersStrategy implements BorderStyleStrategy {
  constructor(styles: unknown[], addStyle: (style: unknown) => number) {
    this.styles = styles;
    this.addStyle = addStyle;
  }

  apply(
    range: CellRange,
    _style: string,
    _color: string,
    rows: Rows,
    _setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { styles, addStyle } = this;

    range.each((ri, ci) => {
      const cell = rows.getCell(ri, ci);
      if (cell && cell.style !== undefined) {
        const ns = { ...(styles[cell.style] as Record<string, unknown>) };
        ns.border = undefined;
        cell.style = addStyle(ns);
      }
    });
  }
}

/**
 * Apply top border only
 */
export class TopBorderStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, sci, eci } = range;

    for (let ci = sci; ci <= eci; ci += 1) {
      setStyleBorder(sri, ci, { top: [style, color, ''] });
      ci += rows.getCellMerge(sri, ci)[1];
    }
  }
}

/**
 * Apply bottom border only
 */
export class BottomBorderStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sci, eri, eci } = range;

    for (let ci = sci; ci <= eci; ci += 1) {
      setStyleBorder(eri, ci, { bottom: [style, color, ''] });
      ci += rows.getCellMerge(eri, ci)[1];
    }
  }
}

/**
 * Apply left border only
 */
export class LeftBorderStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, sci, eri } = range;

    for (let ri = sri; ri <= eri; ri += 1) {
      setStyleBorder(ri, sci, { left: [style, color, ''] });
      ri += rows.getCellMerge(ri, sci)[0];
    }
  }
}

/**
 * Apply right border only
 */
export class RightBorderStrategy implements BorderStyleStrategy {
  apply(
    range: CellRange,
    style: string,
    color: string,
    rows: Rows,
    setStyleBorder: (
      ri: number,
      ci: number,
      bss: BorderStyleParams | null,
    ) => void,
  ): void {
    const { sri, eri, eci } = range;

    for (let ri = sri; ri <= eri; ri += 1) {
      setStyleBorder(ri, eci, { right: [style, color, ''] });
      ri += rows.getCellMerge(ri, eci)[0];
    }
  }
}

/**
 * Border Strategy Factory
 *
 * Creates the appropriate border strategy based on mode
 */
export class BorderStrategyFactory {
  private strategies: Map<string, BorderStyleStrategy>;
  private noneStrategy: NoneBordersStrategy | null = null;

  constructor(styles?: unknown[], addStyle?: (style: unknown) => number) {
    this.strategies = new Map();
    this.strategies.set('all', new AllBordersStrategy());
    this.strategies.set('inside', new InsideBordersStrategy());
    this.strategies.set('outside', new OutsideBordersStrategy());
    this.strategies.set('horizontal', new HorizontalBordersStrategy());
    this.strategies.set('vertical', new VerticalBordersStrategy());
    this.strategies.set('top', new TopBorderStrategy());
    this.strategies.set('bottom', new BottomBorderStrategy());
    this.strategies.set('left', new LeftBorderStrategy());
    this.strategies.set('right', new RightBorderStrategy());

    if (styles && addStyle) {
      this.noneStrategy = new NoneBordersStrategy(styles, addStyle);
      this.strategies.set('none', this.noneStrategy);
    }
  }

  /**
   * Get strategy by mode name
   */
  getStrategy(mode: string): BorderStyleStrategy | null {
    return this.strategies.get(mode) || null;
  }

  /**
   * Check if mode is valid
   */
  isValidMode(mode: string): boolean {
    return this.strategies.has(mode);
  }

  /**
   * Get all available modes
   */
  getAvailableModes(): string[] {
    return Array.from(this.strategies.keys());
  }
}
