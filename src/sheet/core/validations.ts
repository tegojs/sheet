export class Validations {
  constructor() {
    this._ = [];
    // ri_ci: errMessage
    this.errors = new Map();
  }

  getError(ri: any, ci: any) {
    return this.errors.get(`${ri}_${ci}`);
  }

  validate(ri: any, ci: any, text: any) {
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
    ref: any,
    { type, required, value, operator }: any,
  ) {
    const validator = new Validator(type, required, value, operator);
    const v = this.getByValidator(validator);
    if (v !== null) {
      v.addRef(ref);
    } else {
      this._.push(new Validation(mode, [ref], validator));
    }
  }

  getByValidator(validator: Validator) {
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.validator.equals(validator)) {
        return v;
      }
    }
    return null;
  }

  get(ri: any, ci: any) {
    for (let i = 0; i < this._.length; i += 1) {
      const v = this._[i];
      if (v.includes(ri, ci)) return v;
    }
    return null;
  }

  remove(cellRange: any) {
    this.each((it: { remove: (arg0: any) => void }) => {
      it.remove(cellRange);
    });
  }

  each(cb: { (it: any): void; (arg0: any): any }) {
    this._.forEach((it: any) => cb(it));
  }

  getData() {
    return this._.filter(
      (it: { refs: string | any[] }) => it.refs.length > 0,
    ).map((it: { getData: () => any }) => it.getData());
  }

  setData(d: any[]) {
    this._ = d.map(
      (it: {
        refs: any;
        mode: any;
        type: any;
        required: any;
        operator: any;
        value: any;
      }) => Validation.valueOf(it),
    );
  }
}
