import { t } from '../locale/locale';
import { arrayEquals } from './helper';

const rules = {
  phone: /^[1-9]\d{10}$/,
  email: /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/,
};

function returnMessage(
  flag: boolean,
  key: string,
  ...arg: (string | number)[]
): [boolean, string] {
  let message = '';
  if (!flag) {
    message = t(`validation.${key}`, ...arg);
  }
  return [flag, message];
}

export default class Validator {
  message = '';
  // operator: b|nb|eq|neq|lt|lte|gt|gte
  // type: date|number|list|phone|email
  constructor(
    public type: 'date' | 'number' | 'list' | 'phone' | 'email',
    public required: boolean,
    public value: string | string[],
    public operator: 'be' | 'nbe' | 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte',
  ) {}

  parseValue(v: string) {
    if (this.type === 'date') {
      return new Date(v);
    }
    if (this.type === 'number') {
      return Number(v);
    }
    return v;
  }

  equals(other: Validator) {
    let flag =
      this.type === other.type &&
      this.required === other.required &&
      this.operator === other.operator;
    if (flag) {
      if (Array.isArray(this.value) && Array.isArray(other.value)) {
        flag = arrayEquals(this.value, other.value);
      } else {
        flag = this.value === other.value;
      }
    }
    return flag;
  }

  values() {
    return (this.value as string).split(',');
  }

  validate(v: string): [boolean, string?] {
    if (this.required && /^\s*$/.test(v)) {
      return returnMessage(false, 'required');
    }
    if (/^\s*$/.test(v)) return [true];
    if (
      rules[this.type as keyof typeof rules] &&
      !rules[this.type as keyof typeof rules].test(v)
    ) {
      return returnMessage(false, 'notMatch');
    }
    if (this.type === 'list') {
      return returnMessage(this.values().includes(v), 'notIn');
    }
    if (this.operator) {
      const v1 = this.parseValue(v);
      if (this.operator === 'be') {
        if (Array.isArray(this.value) && this.value.length >= 2) {
          const [min, max] = this.value;
          return returnMessage(
            v1 >= this.parseValue(min) && v1 <= this.parseValue(max),
            'between',
            min,
            max,
          );
        }
      }
      if (this.operator === 'nbe') {
        if (Array.isArray(this.value) && this.value.length >= 2) {
          const [min, max] = this.value;
          return returnMessage(
            v1 < this.parseValue(min) || v1 > this.parseValue(max),
            'notBetween',
            min,
            max,
          );
        }
      }
      if (this.operator === 'eq') {
        const val = Array.isArray(this.value) ? this.value[0] : this.value;
        return returnMessage(v1 === this.parseValue(val), 'equal', val);
      }
      if (this.operator === 'neq') {
        const val = Array.isArray(this.value) ? this.value[0] : this.value;
        return returnMessage(v1 !== this.parseValue(val), 'notEqual', val);
      }
      if (this.operator === 'lt') {
        const val = Array.isArray(this.value) ? this.value[0] : this.value;
        return returnMessage(v1 < this.parseValue(val), 'lessThan', val);
      }
      if (this.operator === 'lte') {
        const val = Array.isArray(this.value) ? this.value[0] : this.value;
        return returnMessage(v1 <= this.parseValue(val), 'lessThanEqual', val);
      }
      if (this.operator === 'gt') {
        const val = Array.isArray(this.value) ? this.value[0] : this.value;
        return returnMessage(v1 > this.parseValue(val), 'greaterThan', val);
      }
      if (this.operator === 'gte') {
        const val = Array.isArray(this.value) ? this.value[0] : this.value;
        return returnMessage(
          v1 >= this.parseValue(val),
          'greaterThanEqual',
          val,
        );
      }
    }
    return [true];
  }
}
