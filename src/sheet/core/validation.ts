import { CellRange } from './cellRange';
import Validator from './validator';

export class Validation {
  constructor(
    public mode: 'read' | 'edit',
    public refs: string[],
    public validator: Validator,
  ) {}

  includes(ri: string | number, ci: string | number) {
    for (let i = 0; i < this.refs.length; i += 1) {
      const cr = CellRange.valueOf(
        this.refs[i] as `${Uppercase<string>}${number}`,
      );
      if (cr.includes(ri, ci)) return true;
    }
    return false;
  }

  addRef(ref: string) {
    this.remove(CellRange.valueOf(ref as `${Uppercase<string>}${number}`));
    this.refs.push(ref);
  }

  remove(cellRange: CellRange) {
    const nrefs: string[] = [];
    for (const it of this.refs) {
      const cr = CellRange.valueOf(it as `${Uppercase<string>}${number}`);
      if (cr.intersects(cellRange)) {
        const crs = cr.difference(cellRange);
        for (const it1 of crs) {
          nrefs.push(it1.toString());
        }
      } else {
        nrefs.push(it);
      }
    }
    this.refs = nrefs;
  }

  getData() {
    const { type, required, operator, value } = this.validator;
    return {
      refs: this.refs,
      mode: this.mode,
      type,
      required,
      operator,
      value,
    };
  }

  static valueOf({
    refs,
    mode,
    type,
    required,
    operator,
    value,
  }: {
    refs: string[];
    mode: 'read' | 'edit';
    type: 'date' | 'number' | 'list' | 'phone' | 'email';
    required: boolean;
    operator: 'be' | 'nbe' | 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte';
    value: string | string[];
  }) {
    return new Validation(
      mode,
      refs,
      new Validator(type, required, value, operator),
    );
  }
}
