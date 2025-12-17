import type { CellStyle } from '../../types';
import type { BorderStyleParams } from '../dataProxyTypes';
import { cloneDeep, equals, merge } from '../helper';
import type { Merges } from '../merge';
import type { Rows } from '../row';
import type Selector from '../selector';

/**
 * StyleManager - Handles all style-related operations for cells
 *
 * Responsibilities:
 * - Border style setting (single cell and range)
 * - Cell style management (get/set/add)
 * - Style index management
 */
export class StyleManager {
  private styles: CellStyle[];
  private rows: Rows;
  private merges: Merges;
  private selector: Selector;
  private defaultStyleGetter: () => CellStyle;
  private onStyleChange: () => void;

  constructor(
    styles: CellStyle[],
    rows: Rows,
    merges: Merges,
    selector: Selector,
    defaultStyleGetter: () => CellStyle,
    onStyleChange: () => void = () => {},
  ) {
    this.styles = styles;
    this.rows = rows;
    this.merges = merges;
    this.selector = selector;
    this.defaultStyleGetter = defaultStyleGetter;
    this.onStyleChange = onStyleChange;
  }

  /**
   * Get styles array reference
   */
  getStyles(): CellStyle[] {
    return this.styles;
  }

  /**
   * Set styles array reference
   */
  setStyles(styles: CellStyle[]): void {
    this.styles = styles;
  }

  /**
   * Add a new style or return existing style index if duplicate
   */
  addStyle(nstyle: CellStyle): number {
    const { styles } = this;
    for (let i = 0; i < styles.length; i += 1) {
      const style = styles[i];
      if (
        equals(
          style as Record<string, unknown>,
          nstyle as Record<string, unknown>,
        )
      ) {
        return i;
      }
    }
    styles.push(nstyle);
    return styles.length - 1;
  }

  /**
   * Get default cell style
   */
  defaultStyle(): CellStyle {
    return this.defaultStyleGetter();
  }

  /**
   * Get cell style by row and column index
   */
  getCellStyle(ri: number, ci: number): unknown {
    const cell = this.rows.getCell(ri, ci);
    if (cell && cell.style !== undefined) {
      return this.styles[cell.style];
    }
    return null;
  }

  /**
   * Get cell style or default if not set
   */
  getCellStyleOrDefault(ri: number, ci: number): CellStyle {
    const { styles, rows } = this;
    const cell = rows.getCell(ri, ci);
    const cellStyle =
      cell && cell.style !== undefined ? styles[cell.style] : {};
    return merge(
      this.defaultStyle() as Record<string, unknown>,
      cellStyle as Record<string, unknown>,
    ) as CellStyle;
  }

  /**
   * Get selected cell style
   */
  getSelectedCellStyle(): CellStyle {
    const { ri, ci } = this.selector;
    return this.getCellStyleOrDefault(ri, ci);
  }

  /**
   * Set border style for a single cell
   */
  setStyleBorder(ri: number, ci: number, bss: BorderStyleParams | null): void {
    const { styles, rows } = this;
    const cell = rows.getCellOrNew(ri, ci);
    let cstyle: Record<string, unknown> = {};
    if (cell.style !== undefined) {
      cstyle = cloneDeep(styles[cell.style] as Record<string, unknown>);
    }
    cstyle = merge(cstyle, { border: bss });
    cell.style = this.addStyle(cstyle as CellStyle);
  }

  /**
   * Check if only single cell is selected (including merged cells)
   */
  private isSingleSelected(): boolean {
    const { sri, sci, eri, eci } = this.selector.range;
    const cell = this.rows.getCell(sri, sci);
    if (cell?.merge) {
      const [rn, cn] = cell.merge;
      if (sri + rn === eri && sci + cn === eci) return true;
    }
    return !this.selector.multiple();
  }

  /**
   * Set border styles for selected range based on mode
   */
  setStyleBorders({
    mode,
    style,
    color,
  }: { mode: string; style: unknown; color: unknown }): void {
    const { styles, selector, rows } = this;
    const { sri, sci, eri, eci } = selector.range;
    const multiple = !this.isSingleSelected();

    if (!multiple) {
      if (mode === 'inside' || mode === 'horizontal' || mode === 'vertical') {
        return;
      }
    }

    if (mode === 'outside' && !multiple) {
      this.setStyleBorder(sri, sci, {
        top: [style as string, color as string, ''],
        bottom: [style as string, color as string, ''],
        left: [style as string, color as string, ''],
        right: [style as string, color as string, ''],
      });
    } else if (mode === 'none') {
      selector.range.each((ri, ci) => {
        const cell = rows.getCell(ri, ci);
        if (cell && cell.style !== undefined) {
          const ns = cloneDeep(styles[cell.style]);
          ns.border = undefined;
          cell.style = this.addStyle(ns);
        }
      });
    } else if (
      mode === 'all' ||
      mode === 'inside' ||
      mode === 'outside' ||
      mode === 'horizontal' ||
      mode === 'vertical'
    ) {
      this.applyBordersInRange(
        mode,
        style as string,
        color as string,
        multiple,
      );
    } else if (mode === 'top' || mode === 'bottom') {
      this.applyTopBottomBorders(mode, style as string, color as string);
    } else if (mode === 'left' || mode === 'right') {
      this.applyLeftRightBorders(mode, style as string, color as string);
    }
  }

  /**
   * Apply borders to cells in range (all, inside, outside, horizontal, vertical)
   */
  private applyBordersInRange(
    mode: string,
    style: string,
    color: string,
    multiple: boolean,
  ): void {
    const { selector, rows } = this;
    const { sri, sci, eri, eci } = selector.range;
    const merges: [number, number, number, number][] = [];

    for (let ri = sri; ri <= eri; ri += 1) {
      for (let ci = sci; ci <= eci; ci += 1) {
        // jump merges -- start
        const mergeIndexes: number[] = [];
        for (let ii = 0; ii < merges.length; ii += 1) {
          const [mri, mci, rn, cn] = merges[ii];
          if (ri === mri + rn + 1) mergeIndexes.push(ii);
          if (mri <= ri && ri <= mri + rn) {
            if (ci === mci) {
              ci += cn + 1;
              break;
            }
          }
        }
        mergeIndexes.forEach((it) => merges.splice(it, 1));
        if (ci > eci) break;
        // jump merges -- end

        const cell = rows.getCell(ri, ci);
        let [rn, cn] = [0, 0];
        if (cell?.merge) {
          [rn, cn] = cell.merge;
          merges.push([ri, ci, rn, cn]);
        }
        const mrl = rn > 0 && ri + rn === eri;
        const mcl = cn > 0 && ci + cn === eci;
        const bss: BorderStyleParams = {};

        if (mode === 'all') {
          bss.bottom = [style, color, ''];
          bss.top = [style, color, ''];
          bss.left = [style, color, ''];
          bss.right = [style, color, ''];
        } else if (mode === 'inside') {
          if (!mcl && ci < eci) bss.right = [style, color, ''];
          if (!mrl && ri < eri) bss.bottom = [style, color, ''];
        } else if (mode === 'horizontal') {
          if (!mrl && ri < eri) bss.bottom = [style, color, ''];
        } else if (mode === 'vertical') {
          if (!mcl && ci < eci) bss.right = [style, color, ''];
        } else if (mode === 'outside' && multiple) {
          if (sri === ri) bss.top = [style, color, ''];
          if (mrl || eri === ri) bss.bottom = [style, color, ''];
          if (sci === ci) bss.left = [style, color, ''];
          if (mcl || eci === ci) bss.right = [style, color, ''];
        }

        if (Object.keys(bss).length > 0) {
          this.setStyleBorder(ri, ci, bss);
        }
        ci += cn;
      }
    }
  }

  /**
   * Apply top or bottom border
   */
  private applyTopBottomBorders(
    mode: string,
    style: string,
    color: string,
  ): void {
    const { selector, rows } = this;
    const { sri, sci, eri, eci } = selector.range;

    for (let ci = sci; ci <= eci; ci += 1) {
      if (mode === 'top') {
        this.setStyleBorder(sri, ci, { top: [style, color, ''] });
        ci += rows.getCellMerge(sri, ci)[1];
      }
      if (mode === 'bottom') {
        this.setStyleBorder(eri, ci, { bottom: [style, color, ''] });
        ci += rows.getCellMerge(eri, ci)[1];
      }
    }
  }

  /**
   * Apply left or right border
   */
  private applyLeftRightBorders(
    mode: string,
    style: string,
    color: string,
  ): void {
    const { selector, rows } = this;
    const { sri, sci, eri, eci } = selector.range;

    for (let ri = sri; ri <= eri; ri += 1) {
      if (mode === 'left') {
        this.setStyleBorder(ri, sci, { left: [style, color, ''] });
        ri += rows.getCellMerge(ri, sci)[0];
      }
      if (mode === 'right') {
        this.setStyleBorder(ri, eci, { right: [style, color, ''] });
        ri += rows.getCellMerge(ri, eci)[0];
      }
    }
  }

  /**
   * Set cell attribute for selected range
   */
  setCellStyleAttr(property: string, value: unknown): void {
    const { selector, styles, rows } = this;

    selector.range.each((ri, ci) => {
      const cell = rows.getCellOrNew(ri, ci);
      let cstyle: Record<string, unknown> = {};
      if (cell.style !== undefined) {
        cstyle = cloneDeep(styles[cell.style] as Record<string, unknown>);
      }

      if (property === 'format') {
        cstyle.format = value;
        cell.style = this.addStyle(cstyle as CellStyle);
      } else if (
        property === 'font-bold' ||
        property === 'font-italic' ||
        property === 'font-name' ||
        property === 'font-size'
      ) {
        const nfont: Record<string, unknown> = {};
        nfont[property.split('-')[1]] = value;
        cstyle.font = Object.assign(cstyle.font || {}, nfont);
        cell.style = this.addStyle(cstyle as CellStyle);
      } else if (
        property === 'strike' ||
        property === 'textwrap' ||
        property === 'underline' ||
        property === 'align' ||
        property === 'valign' ||
        property === 'color' ||
        property === 'bgcolor'
      ) {
        cstyle[property] = value;
        cell.style = this.addStyle(cstyle as CellStyle);
      }
    });
  }
}
