import { t } from '../locale/locale';
import { arrayEquals } from './helper';

const rules = {
  phone: /^[1-9]\d{10}$/,
  email: /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/,
};

function returnMessage(flag, key, ...arg) {
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

  validate(v: string) {
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
        const [min, max] = this.value;
        return returnMessage(
          v1 >= this.parseValue(min) && v1 <= this.parseValue(max),
          'between',
          min,
          max,
        );
      }
      if (this.operator === 'nbe') {
        const [min, max] = this.value;
        return returnMessage(
          v1 < this.parseValue(min) || v1 > this.parseValue(max),
          'notBetween',
          min,
          max,
        );
      }
      if (this.operator === 'eq') {
        return returnMessage(
          v1 === this.parseValue(this.value),
          'equal',
          this.value,
        );
      }
      if (this.operator === 'neq') {
        return returnMessage(
          v1 !== this.parseValue(this.value),
          'notEqual',
          this.value,
        );
      }
      if (this.operator === 'lt') {
        return returnMessage(
          v1 < this.parseValue(this.value),
          'lessThan',
          this.value,
        );
      }
      if (this.operator === 'lte') {
        return returnMessage(
          v1 <= this.parseValue(this.value),
          'lessThanEqual',
          this.value,
        );
      }
      if (this.operator === 'gt') {
        return returnMessage(
          v1 > this.parseValue(this.value),
          'greaterThan',
          this.value,
        );
      }
      if (this.operator === 'gte') {
        return returnMessage(
          v1 >= this.parseValue(this.value),
          'greaterThanEqual',
          this.value,
        );
      }
    }
    return [true];
  }
}
