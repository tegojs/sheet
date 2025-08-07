import { rangeSum } from './helper';
export class Cols {
  _?: Cols;
  len?: number;
  width?: number;
  indexWidth?: number;
  minWidth?: number;
  constructor({
    len,
    width,
    indexWidth,
    minWidth,
  }: { len: number; width: number; indexWidth: number; minWidth: number }) {
    this._ = {} as Cols;
    this.len = len;
    this.width = width;
    this.indexWidth = indexWidth;
    this.minWidth = minWidth;
  }

  setData(d: Cols) {
    if (d.len) {
      this.len = d.len;
      // biome-ignore lint/performance/noDelete: <explanation>
      delete d.len;
    }
    this._ = d;
  }

  getData() {
    return Object.assign({ len: this.len }, this._);
  }

  getWidth(i) {
    if (this.isHide(i)) return 0;
    const col = this._?.[i as keyof Cols] as Cols;
    if (col?.width) {
      return col.width;
    }
    return this.width;
  }

  getOrNew(ci) {
    this._[ci] = this._[ci] || {};
    return this._[ci];
  }

  setWidth(ci, width) {
    const col = this.getOrNew(ci);
    col.width = width;
  }

  unhide(idx) {
    let index = idx;
    while (index > 0) {
      index -= 1;
      if (this.isHide(index)) {
        this.setHide(index, false);
      } else break;
    }
  }

  isHide(ci) {
    const col = this._[ci];
    return col && col.hide;
  }

  setHide(ci, v) {
    const col = this.getOrNew(ci);
    if (v === true) col.hide = true;
    else delete col.hide;
  }

  setStyle(ci, style) {
    const col = this.getOrNew(ci);
    col.style = style;
  }

  sumWidth(min: number, max: number) {
    return rangeSum(min, max, (i) => this.getWidth(i));
  }

  totalWidth() {
    return this.sumWidth(0, this.len);
  }
}

export default {};
