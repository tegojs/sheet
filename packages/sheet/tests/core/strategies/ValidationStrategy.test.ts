import { describe, expect, it } from 'vitest';
import {
  BetweenStrategy,
  EqualStrategy,
  GreaterThanOrEqualStrategy,
  GreaterThanStrategy,
  LessThanOrEqualStrategy,
  LessThanStrategy,
  NotBetweenStrategy,
  NotEqualStrategy,
  ValidationStrategyFactory,
} from '../../../src/sheet/core/strategies/ValidationStrategy';

describe('ValidationStrategy', () => {
  describe('BetweenStrategy', () => {
    const strategy = new BetweenStrategy();

    it('should return true when value is between min and max', () => {
      const [result] = strategy.validate(5, [1, 10]);
      expect(result).toBe(true);
    });

    it('should return true when value equals min', () => {
      const [result] = strategy.validate(1, [1, 10]);
      expect(result).toBe(true);
    });

    it('should return true when value equals max', () => {
      const [result] = strategy.validate(10, [1, 10]);
      expect(result).toBe(true);
    });

    it('should return false when value is less than min', () => {
      const [result] = strategy.validate(0, [1, 10]);
      expect(result).toBe(false);
    });

    it('should return false when value is greater than max', () => {
      const [result] = strategy.validate(11, [1, 10]);
      expect(result).toBe(false);
    });

    it('should return true when compareValue is invalid', () => {
      const [result] = strategy.validate(5, [1]);
      expect(result).toBe(true);
    });
  });

  describe('NotBetweenStrategy', () => {
    const strategy = new NotBetweenStrategy();

    it('should return false when value is between min and max', () => {
      const [result] = strategy.validate(5, [1, 10]);
      expect(result).toBe(false);
    });

    it('should return true when value is less than min', () => {
      const [result] = strategy.validate(0, [1, 10]);
      expect(result).toBe(true);
    });

    it('should return true when value is greater than max', () => {
      const [result] = strategy.validate(11, [1, 10]);
      expect(result).toBe(true);
    });
  });

  describe('EqualStrategy', () => {
    const strategy = new EqualStrategy();

    it('should return true when values are equal', () => {
      const [result] = strategy.validate(5, 5);
      expect(result).toBe(true);
    });

    it('should return false when values are not equal', () => {
      const [result] = strategy.validate(5, 10);
      expect(result).toBe(false);
    });

    it('should handle array compareValue', () => {
      const [result] = strategy.validate(5, [5, 10]);
      expect(result).toBe(true);
    });
  });

  describe('NotEqualStrategy', () => {
    const strategy = new NotEqualStrategy();

    it('should return false when values are equal', () => {
      const [result] = strategy.validate(5, 5);
      expect(result).toBe(false);
    });

    it('should return true when values are not equal', () => {
      const [result] = strategy.validate(5, 10);
      expect(result).toBe(true);
    });
  });

  describe('LessThanStrategy', () => {
    const strategy = new LessThanStrategy();

    it('should return true when value is less than compareValue', () => {
      const [result] = strategy.validate(5, 10);
      expect(result).toBe(true);
    });

    it('should return false when value equals compareValue', () => {
      const [result] = strategy.validate(10, 10);
      expect(result).toBe(false);
    });

    it('should return false when value is greater than compareValue', () => {
      const [result] = strategy.validate(15, 10);
      expect(result).toBe(false);
    });
  });

  describe('LessThanOrEqualStrategy', () => {
    const strategy = new LessThanOrEqualStrategy();

    it('should return true when value is less than compareValue', () => {
      const [result] = strategy.validate(5, 10);
      expect(result).toBe(true);
    });

    it('should return true when value equals compareValue', () => {
      const [result] = strategy.validate(10, 10);
      expect(result).toBe(true);
    });

    it('should return false when value is greater than compareValue', () => {
      const [result] = strategy.validate(15, 10);
      expect(result).toBe(false);
    });
  });

  describe('GreaterThanStrategy', () => {
    const strategy = new GreaterThanStrategy();

    it('should return true when value is greater than compareValue', () => {
      const [result] = strategy.validate(15, 10);
      expect(result).toBe(true);
    });

    it('should return false when value equals compareValue', () => {
      const [result] = strategy.validate(10, 10);
      expect(result).toBe(false);
    });

    it('should return false when value is less than compareValue', () => {
      const [result] = strategy.validate(5, 10);
      expect(result).toBe(false);
    });
  });

  describe('GreaterThanOrEqualStrategy', () => {
    const strategy = new GreaterThanOrEqualStrategy();

    it('should return true when value is greater than compareValue', () => {
      const [result] = strategy.validate(15, 10);
      expect(result).toBe(true);
    });

    it('should return true when value equals compareValue', () => {
      const [result] = strategy.validate(10, 10);
      expect(result).toBe(true);
    });

    it('should return false when value is less than compareValue', () => {
      const [result] = strategy.validate(5, 10);
      expect(result).toBe(false);
    });
  });

  describe('ValidationStrategyFactory', () => {
    const factory = new ValidationStrategyFactory();

    it('should return correct strategy for "be"', () => {
      const strategy = factory.getStrategy('be');
      expect(strategy).toBeInstanceOf(BetweenStrategy);
    });

    it('should return correct strategy for "nbe"', () => {
      const strategy = factory.getStrategy('nbe');
      expect(strategy).toBeInstanceOf(NotBetweenStrategy);
    });

    it('should return correct strategy for "eq"', () => {
      const strategy = factory.getStrategy('eq');
      expect(strategy).toBeInstanceOf(EqualStrategy);
    });

    it('should return correct strategy for "neq"', () => {
      const strategy = factory.getStrategy('neq');
      expect(strategy).toBeInstanceOf(NotEqualStrategy);
    });

    it('should return correct strategy for "lt"', () => {
      const strategy = factory.getStrategy('lt');
      expect(strategy).toBeInstanceOf(LessThanStrategy);
    });

    it('should return correct strategy for "lte"', () => {
      const strategy = factory.getStrategy('lte');
      expect(strategy).toBeInstanceOf(LessThanOrEqualStrategy);
    });

    it('should return correct strategy for "gt"', () => {
      const strategy = factory.getStrategy('gt');
      expect(strategy).toBeInstanceOf(GreaterThanStrategy);
    });

    it('should return correct strategy for "gte"', () => {
      const strategy = factory.getStrategy('gte');
      expect(strategy).toBeInstanceOf(GreaterThanOrEqualStrategy);
    });

    it('should return null for unknown operator', () => {
      const strategy = factory.getStrategy('unknown');
      expect(strategy).toBe(null);
    });

    it('should validate operator correctly', () => {
      expect(factory.isValidOperator('be')).toBe(true);
      expect(factory.isValidOperator('unknown')).toBe(false);
    });

    it('should return all available operators', () => {
      const operators = factory.getAvailableOperators();
      expect(operators).toContain('be');
      expect(operators).toContain('nbe');
      expect(operators).toContain('eq');
      expect(operators).toContain('neq');
      expect(operators).toContain('lt');
      expect(operators).toContain('lte');
      expect(operators).toContain('gt');
      expect(operators).toContain('gte');
    });
  });
});
