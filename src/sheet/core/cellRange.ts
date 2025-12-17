import { type TagA1, type TagA1Range, expr2xy, xy2expr } from './alphabet';

export class CellRange {
  constructor(
    public sri: number,
    public sci: number,
    public eri: number,
    public eci: number,
    public w = 0,
    public h = 0,
  ) {}

  set(sri: number, sci: number, eri: number, eci: number) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
  }

  multiple() {
    return this.eri - this.sri > 0 || this.eci - this.sci > 0;
  }

  // cell-index: ri, ci
  // cell-ref: A10
  includes(...args: (string | number)[]) {
    let [ri, ci] = [0, 0];
    if (args.length === 1) {
      [ci, ri] = expr2xy(args[0] as TagA1);
    } else if (args.length === 2) {
      [ri, ci] = args as [number, number];
    }
    return this.sri <= ri && ri <= this.eri && this.sci <= ci && ci <= this.eci;
  }

  each(
    cb: (ri: number, ci: number) => void,
    rowFilter: (i: number) => boolean = () => true,
  ) {
    for (let i = this.sri; i <= this.eri; i += 1) {
      if (rowFilter(i)) {
        for (let j = this.sci; j <= this.eci; j += 1) {
          cb(i, j);
        }
      }
    }
  }

  contains(other: CellRange) {
    return (
      this.sri <= other.sri &&
      this.sci <= other.sci &&
      this.eri >= other.eri &&
      this.eci >= other.eci
    );
  }

  // within
  within(other: CellRange) {
    return (
      this.sri >= other.sri &&
      this.sci >= other.sci &&
      this.eri <= other.eri &&
      this.eci <= other.eci
    );
  }

  // disjoint
  disjoint(other: CellRange) {
    return (
      this.sri > other.eri ||
      this.sci > other.eci ||
      other.sri > this.eri ||
      other.sci > this.eci
    );
  }

  // intersects
  intersects(other: CellRange) {
    return (
      this.sri <= other.eri &&
      this.sci <= other.eci &&
      other.sri <= this.eri &&
      other.sci <= this.eci
    );
  }

  // union
  union(other: CellRange) {
    return new CellRange(
      other.sri < this.sri ? other.sri : this.sri,
      other.sci < this.sci ? other.sci : this.sci,
      other.eri > this.eri ? other.eri : this.eri,
      other.eci > this.eci ? other.eci : this.eci,
    );
  }

  // Returns Array<CellRange> that represents that part of this that does not intersect with other
  // difference
  difference(other: CellRange) {
    const ret: CellRange[] = [];
    const addRet = (sri: number, sci: number, eri: number, eci: number) => {
      ret.push(new CellRange(sri, sci, eri, eci));
    };
    const dsr = other.sri - this.sri;
    const dsc = other.sci - this.sci;
    const der = this.eri - other.eri;
    const dec = this.eci - other.eci;
    if (dsr > 0) {
      addRet(this.sri, this.sci, other.sri - 1, this.eci);
      if (der > 0) {
        addRet(other.eri + 1, this.sci, this.eri, this.eci);
        if (dsc > 0) {
          addRet(other.sri, this.sci, other.eri, other.sci - 1);
        }
        if (dec > 0) {
          addRet(other.sri, other.eci + 1, other.eri, this.eci);
        }
      } else {
        if (dsc > 0) {
          addRet(other.sri, this.sci, this.eri, other.sci - 1);
        }
        if (dec > 0) {
          addRet(other.sri, other.eci + 1, this.eri, this.eci);
        }
      }
    } else if (der > 0) {
      addRet(other.eri + 1, this.sci, this.eri, this.eci);
      if (dsc > 0) {
        addRet(this.sri, this.sci, other.eri, other.sci - 1);
      }
      if (dec > 0) {
        addRet(this.sri, other.eci + 1, other.eri, this.eci);
      }
    }
    if (dsc > 0) {
      addRet(this.sri, this.sci, this.eri, other.sci - 1);
      if (dec > 0) {
        addRet(this.sri, other.eri + 1, this.eri, this.eci);
        if (dsr > 0) {
          addRet(this.sri, other.sci, other.sri - 1, other.eci);
        }
        if (der > 0) {
          addRet(other.sri + 1, other.sci, this.eri, other.eci);
        }
      } else {
        if (dsr > 0) {
          addRet(this.sri, other.sci, other.sri - 1, this.eci);
        }
        if (der > 0) {
          addRet(other.sri + 1, other.sci, this.eri, this.eci);
        }
      }
    } else if (dec > 0) {
      addRet(this.eri, other.eci + 1, this.eri, this.eci);
      if (dsr > 0) {
        addRet(this.sri, this.sci, other.sri - 1, other.eci);
      }
      if (der > 0) {
        addRet(other.eri + 1, this.sci, this.eri, other.eci);
      }
    }
    return ret;
  }

  size() {
    return [this.eri - this.sri + 1, this.eci - this.sci + 1];
  }

  toString() {
    let ref = xy2expr(this.sci, this.sri);
    if (this.multiple()) {
      ref = `${ref}:${xy2expr(this.eci, this.eri)}` as unknown as TagA1;
    }
    return ref;
  }

  clone() {
    return new CellRange(
      this.sri,
      this.sci,
      this.eri,
      this.eci,
      this.w,
      this.h,
    );
  }

  equals(other: CellRange) {
    return (
      this.eri === other.eri &&
      this.eci === other.eci &&
      this.sri === other.sri &&
      this.sci === other.sci
    );
  }

  static valueOf(ref: TagA1 | TagA1Range) {
    // B1:B8, B1 => 1 x 1 cell range
    const refs = ref.split(':');
    const [sci, sri] = expr2xy(refs[0] as TagA1);
    let [eri, eci] = [sri, sci];
    if (refs.length > 1) {
      [eci, eri] = expr2xy(refs[1] as TagA1);
    }
    return new CellRange(sri, sci, eri, eci);
  }
}

export default CellRange;
