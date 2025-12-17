import { t } from '../../locale/locale';

/**
 * Validation Strategy Interface
 *
 * Strategy pattern for validating cell values.
 * Each implementation handles a specific validation operator.
 */
export interface ValidationStrategy {
  /**
   * Validate a value against the comparison value(s)
   * @param value - The value to validate
   * @param compareValue - The comparison value(s)
   * @returns [isValid, errorMessage?]
   */
  validate(value: unknown, compareValue: unknown): [boolean, string?];
}

/**
 * Helper function to return validation result with localized message
 */
function returnMessage(
  flag: boolean,
  key: string,
  ...args: (string | number)[]
): [boolean, string?] {
  if (!flag) {
    return [false, t(`validation.${key}`, ...args)];
  }
  return [true];
}

/**
 * Between validation strategy (be)
 * Value must be between min and max (inclusive)
 */
export class BetweenStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    if (!Array.isArray(compareValue) || compareValue.length < 2) {
      return [true];
    }
    const [min, max] = compareValue;
    return returnMessage(
      (value as number) >= min && (value as number) <= max,
      'between',
      min,
      max,
    );
  }
}

/**
 * Not between validation strategy (nbe)
 * Value must NOT be between min and max
 */
export class NotBetweenStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    if (!Array.isArray(compareValue) || compareValue.length < 2) {
      return [true];
    }
    const [min, max] = compareValue;
    return returnMessage(
      (value as number) < min || (value as number) > max,
      'notBetween',
      min,
      max,
    );
  }
}

/**
 * Equal validation strategy (eq)
 * Value must equal the comparison value
 */
export class EqualStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    const val = Array.isArray(compareValue) ? compareValue[0] : compareValue;
    return returnMessage(value === val, 'equal', String(val));
  }
}

/**
 * Not equal validation strategy (neq)
 * Value must NOT equal the comparison value
 */
export class NotEqualStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    const val = Array.isArray(compareValue) ? compareValue[0] : compareValue;
    return returnMessage(value !== val, 'notEqual', String(val));
  }
}

/**
 * Less than validation strategy (lt)
 * Value must be less than the comparison value
 */
export class LessThanStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    const val = Array.isArray(compareValue) ? compareValue[0] : compareValue;
    return returnMessage(
      (value as number) < (val as number),
      'lessThan',
      String(val),
    );
  }
}

/**
 * Less than or equal validation strategy (lte)
 * Value must be less than or equal to the comparison value
 */
export class LessThanOrEqualStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    const val = Array.isArray(compareValue) ? compareValue[0] : compareValue;
    return returnMessage(
      (value as number) <= (val as number),
      'lessThanEqual',
      String(val),
    );
  }
}

/**
 * Greater than validation strategy (gt)
 * Value must be greater than the comparison value
 */
export class GreaterThanStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    const val = Array.isArray(compareValue) ? compareValue[0] : compareValue;
    return returnMessage(
      (value as number) > (val as number),
      'greaterThan',
      String(val),
    );
  }
}

/**
 * Greater than or equal validation strategy (gte)
 * Value must be greater than or equal to the comparison value
 */
export class GreaterThanOrEqualStrategy implements ValidationStrategy {
  validate(value: unknown, compareValue: unknown): [boolean, string?] {
    const val = Array.isArray(compareValue) ? compareValue[0] : compareValue;
    return returnMessage(
      (value as number) >= (val as number),
      'greaterThanEqual',
      String(val),
    );
  }
}

/**
 * Validation Strategy Factory
 *
 * Creates the appropriate validation strategy based on operator
 */
export class ValidationStrategyFactory {
  private strategies: Map<string, ValidationStrategy>;

  constructor() {
    this.strategies = new Map();
    this.strategies.set('be', new BetweenStrategy());
    this.strategies.set('nbe', new NotBetweenStrategy());
    this.strategies.set('eq', new EqualStrategy());
    this.strategies.set('neq', new NotEqualStrategy());
    this.strategies.set('lt', new LessThanStrategy());
    this.strategies.set('lte', new LessThanOrEqualStrategy());
    this.strategies.set('gt', new GreaterThanStrategy());
    this.strategies.set('gte', new GreaterThanOrEqualStrategy());
  }

  /**
   * Get strategy by operator name
   */
  getStrategy(operator: string): ValidationStrategy | null {
    return this.strategies.get(operator) || null;
  }

  /**
   * Check if operator is valid
   */
  isValidOperator(operator: string): boolean {
    return this.strategies.has(operator);
  }

  /**
   * Get all available operators
   */
  getAvailableOperators(): string[] {
    return Array.from(this.strategies.keys());
  }
}

/**
 * Type-specific validation rules
 */
export const validationRules = {
  phone: /^[1-9]\d{10}$/,
  email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
};

/**
 * Validator using Strategy Pattern
 *
 * Enhanced validator that uses the strategy pattern for operator-based validation
 */
export class StrategyValidator {
  private strategyFactory: ValidationStrategyFactory;
  message = '';

  constructor(
    public type: 'date' | 'number' | 'list' | 'phone' | 'email',
    public required: boolean,
    public value: string | string[],
    public operator: 'be' | 'nbe' | 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte',
  ) {
    this.strategyFactory = new ValidationStrategyFactory();
  }

  /**
   * Parse value based on type
   */
  parseValue(v: string): unknown {
    if (this.type === 'date') {
      return new Date(v);
    }
    if (this.type === 'number') {
      return Number(v);
    }
    return v;
  }

  /**
   * Get list values
   */
  values(): string[] {
    return (this.value as string).split(',');
  }

  /**
   * Validate a cell value
   */
  validate(v: string): [boolean, string?] {
    // Required validation
    if (this.required && /^\s*$/.test(v)) {
      return [false, t('validation.required')];
    }

    // Empty value is valid if not required
    if (/^\s*$/.test(v)) return [true];

    // Regex-based type validation (phone, email)
    const rule = validationRules[this.type as keyof typeof validationRules];
    if (rule && !rule.test(v)) {
      return [false, t('validation.notMatch')];
    }

    // List validation
    if (this.type === 'list') {
      const isInList = this.values().includes(v);
      if (!isInList) {
        return [false, t('validation.notIn')];
      }
      return [true];
    }

    // Operator-based validation using strategy pattern
    if (this.operator) {
      const strategy = this.strategyFactory.getStrategy(this.operator);
      if (strategy) {
        const parsedValue = this.parseValue(v);
        const parsedCompare = Array.isArray(this.value)
          ? this.value.map((val) => this.parseValue(val))
          : this.parseValue(this.value);
        return strategy.validate(parsedValue, parsedCompare);
      }
    }

    return [true];
  }
}
