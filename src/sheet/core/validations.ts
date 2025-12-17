import type {
  ValidationData,
  ValidationOperator,
  ValidationType,
} from '../types';
import type { CellRange } from './cell_range';
import { Validation } from './validation';
import { Validator } from './validator';

export class Validations {
  _: Validation[];
  errors: Map<string, string>;

  constructor() {
    this._ = [];
    // ri_ci: errMessage
    this.errors = new Map();
  }

  getError(ri: number, ci: number): string | undefined {
    return this.errors.get(`${ri}_${ci}`);
  }

  validate(ri: number, ci: number, text: string): boolean {
    const v = this.get(ri, ci);
    const key = `${ri}_${ci}`;
    const { errors } = this;
    if (v !== null) {
      const [flag, message] = v.validator.validate(text);
      if (!flag) {
        errors.set(key, message);
      } else {
        errors.delete(key);
      }
    } else {
      errors.delete(key);
    }
    return true;
  }

  // type: date|number|phone|email|list
  // validator: { required, value, operator }
  add(
    mode: 'read' | 'edit',
    ref: string | CellRange,
    {
      type,
      required,
      value,
      operator,
    }: {
      type: ValidationType;
      required: boolean;
      value: string | string[];
      operator: ValidationOperator;
    },
  ): void {
    const validator = new Validator(type, required, value, operator);
    const v = this.getByValidator(validator);
    if (v !== null) {
      v.addRef(ref);
    } else {
      this._.push(new Validation(mode, [ref], validator));
    }
  }

  getByValidator(validator: Validator): Validation | null {
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.validator.equals(validator)) {
        return v;
      }
    }
    return null;
  }

  get(ri: number, ci: number): Validation | null {
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.includes(ri, ci)) return v;
    }
    return null;
  }

  remove(cellRange: CellRange): void {
    this.each((it: Validation) => {
      it.remove(cellRange);
    });
  }

  each(cb: (it: Validation) => void): void {
    this._.forEach((it: Validation) => cb(it));
  }

  getData(): ValidationData[] {
    return this._.filter((it: Validation) => it.refs.length > 0).map(
      (it: Validation) => it.getData(),
    );
  }

  setData(d: ValidationData[]): void {
    this._ = d.map((it: ValidationData) => Validation.valueOf(it));
  }
}
