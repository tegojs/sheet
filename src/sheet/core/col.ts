import { rangeSum } from './helper';

export interface Col {
  width?: number;
  hide?: boolean;
  style?: number;
}

export class Cols {
  _: { [key: number]: Col };
  len: number;
  width: number;
  indexWidth: number;
  minWidth: number;

  constructor({
    len,
    width,
    indexWidth,
    minWidth,
  }: { len: number; width: number; indexWidth: number; minWidth: number }) {
    this._ = {};
    this.len = len;
    this.width = width;
    this.indexWidth = indexWidth;
    this.minWidth = minWidth;
  }

  setData(d: { len?: number; [key: number]: Col | number | undefined }): void {
    if (d.len) {
      this.len = d.len;
      d.len = undefined;
    }
    this._ = d as { [key: number]: Col };
  }

  getData(): { len: number; [key: number]: Col } {
    return Object.assign({ len: this.len }, this._);
  }

  getWidth(i: number): number {
    if (this.isHide(i)) return 0;
    const col = this._[i];
    if (col?.width) {
      return col.width;
    }
    return this.width;
  }

  getOrNew(ci: number): Col {
    this._[ci] = this._[ci] || {};
    return this._[ci];
  }

  setWidth(ci: number, width: number): void {
    const col = this.getOrNew(ci);
    col.width = width;
  }

  unhide(idx: number): void {
    let index = idx;
    while (index > 0) {
      index -= 1;
      if (this.isHide(index)) {
        this.setHide(index, false);
      } else break;
    }
  }

  isHide(ci: number): boolean {
    const col = this._[ci];
    return !!col?.hide;
  }

  setHide(ci: number, v: boolean): void {
    const col = this.getOrNew(ci);
    if (v === true) col.hide = true;
    else col.hide = undefined;
  }

  setStyle(ci: number, style: number): void {
    const col = this.getOrNew(ci);
    col.style = style;
  }

  sumWidth(min: number, max: number): number {
    return rangeSum(min, max, (i: number) => this.getWidth(i));
  }

  totalWidth(): number {
    return this.sumWidth(0, this.len);
  }
}

export default {};
