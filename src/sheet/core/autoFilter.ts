import { CellRange } from './cellRange';
import type { Cell } from './row';

// operator: all|eq|neq|gt|gte|lt|lte|in|be
// value:
//   in => []
//   be => [min, max]
class Filter {
  ci: number;
  operator: string;
  value: string | string[];

  constructor(ci: number, operator: string, value: string | string[]) {
    this.ci = ci;
    this.operator = operator;
    this.value = value;
  }

  set(operator: string, value: string | string[]): void {
    this.operator = operator;
    this.value = value;
  }

  includes(v: string): boolean {
    const { operator, value } = this;
    if (operator === 'all') {
      return true;
    }
    if (operator === 'in' && Array.isArray(value)) {
      return value.includes(v);
    }
    return false;
  }

  vlength(): number {
    const { operator, value } = this;
    if (operator === 'in' && Array.isArray(value)) {
      return value.length;
    }
    return 0;
  }

  getData(): { ci: number; operator: string; value: string | string[] } {
    const { ci, operator, value } = this;
    return { ci, operator, value };
  }
}

class Sort {
  ci: number;
  order: string;

  constructor(ci: number, order: string) {
    this.ci = ci;
    this.order = order;
  }

  asc(): boolean {
    return this.order === 'asc';
  }

  desc(): boolean {
    return this.order === 'desc';
  }
}

export default class AutoFilter {
  ref: string | null;
  filters: Filter[];
  sort: Sort | null;

  constructor() {
    this.ref = null;
    this.filters = [];
    this.sort = null;
  }

  setData({
    ref,
    filters,
    sort,
  }: {
    ref?: string;
    filters?: { ci: number; operator: string; value: string | string[] }[];
    sort?: { ci: number; order: string };
  }): void {
    if (ref != null) {
      this.ref = ref;
      this.filters = (filters || []).map(
        (it) => new Filter(it.ci, it.operator, it.value),
      );
      if (sort) {
        this.sort = new Sort(sort.ci, sort.order);
      }
    }
  }

  getData(): {
    ref?: string;
    filters?: { ci: number; operator: string; value: string | string[] }[];
    sort?: Sort;
  } {
    if (this.active()) {
      const { ref, filters, sort } = this;
      return {
        ref: ref || undefined,
        filters: filters.map((it) => it.getData()),
        sort: sort || undefined,
      };
    }
    return {};
  }

  addFilter(ci: number, operator: string, value: string | string[]): void {
    const filter = this.getFilter(ci);
    if (filter == null) {
      this.filters.push(new Filter(ci, operator, value));
    } else {
      filter.set(operator, value);
    }
  }

  setSort(ci: number, order: string): void {
    this.sort = order ? new Sort(ci, order) : null;
  }

  includes(ri: number, ci: number): boolean {
    if (this.active()) {
      return this.hrange().includes(ri, ci);
    }
    return false;
  }

  getSort(ci: number): Sort | null {
    const { sort } = this;
    if (sort && sort.ci === ci) {
      return sort;
    }
    return null;
  }

  getFilter(ci: number): Filter | null {
    const { filters } = this;
    for (let i = 0; i < filters.length; i += 1) {
      if (filters[i].ci === ci) {
        return filters[i];
      }
    }
    return null;
  }

  filteredRows(getCell: (ri: number, ci: number) => Cell | null): {
    rset: Set<number>;
    fset: Set<number>;
  } {
    // const ary = [];
    // let lastri = 0;
    const rset = new Set<number>();
    const fset = new Set<number>();
    if (this.active()) {
      const { sri, eri } = this.range();
      const { filters } = this;
      for (let ri = sri + 1; ri <= eri; ri += 1) {
        for (let i = 0; i < filters.length; i += 1) {
          const filter = filters[i];
          const cell = getCell(ri, filter.ci);
          const ctext = cell?.text || '';
          if (!filter.includes(ctext)) {
            rset.add(ri);
            break;
          }
          fset.add(ri);
        }
      }
    }
    return { rset, fset };
  }

  items(
    ci: number,
    getCell: (ri: number, ci: number) => Cell | null,
  ): { [key: string]: number } {
    const m: { [key: string]: number } = {};
    if (this.active()) {
      const { sri, eri } = this.range();
      for (let ri = sri + 1; ri <= eri; ri += 1) {
        const cell = getCell(ri, ci);
        if (cell !== null && cell.text && !/^\s*$/.test(cell.text)) {
          const key = cell.text;
          const cnt = (m[key] || 0) + 1;
          m[key] = cnt;
        } else {
          m[''] = (m[''] || 0) + 1;
        }
      }
    }
    return m;
  }

  range(): CellRange {
    return CellRange.valueOf(
      (this.ref ||
        '') as `${Uppercase<string>}${number}:${Uppercase<string>}${number}`,
    );
  }

  hrange(): CellRange {
    const r = this.range();
    r.eri = r.sri;
    return r;
  }

  clear(): void {
    this.ref = null;
    this.filters = [];
    this.sort = null;
  }

  active(): boolean {
    return this.ref !== null;
  }
}
