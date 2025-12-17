import { describe, expect, it, vi } from 'vitest';
import {
  AllBordersStrategy,
  InsideBordersStrategy,
  OutsideBordersStrategy,
  HorizontalBordersStrategy,
  VerticalBordersStrategy,
  TopBorderStrategy,
  BottomBorderStrategy,
  LeftBorderStrategy,
  RightBorderStrategy,
  BorderStrategyFactory,
} from '../../../src/sheet/core/strategies/BorderStyleStrategy';
import { CellRange } from '../../../src/sheet/core/cellRange';

// Mock Rows
const createMockRows = () => ({
  getCell: vi.fn().mockReturnValue(null),
  getCellMerge: vi.fn().mockReturnValue([0, 0]),
});

describe('BorderStyleStrategy', () => {
  describe('AllBordersStrategy', () => {
    it('should apply all borders to cells', () => {
      const strategy = new AllBordersStrategy();
      const range = new CellRange(0, 0, 1, 1);
      const mockRows = createMockRows();
      const setStyleBorder = vi.fn();

      strategy.apply(range, 'thin', '#000', mockRows as any, setStyleBorder);

      // Should be called for each cell in range
      expect(setStyleBorder).toHaveBeenCalled();
      // Check that borders include all sides
      const calls = setStyleBorder.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const firstBorder = calls[0][2];
      expect(firstBorder).toHaveProperty('top');
      expect(firstBorder).toHaveProperty('bottom');
      expect(firstBorder).toHaveProperty('left');
      expect(firstBorder).toHaveProperty('right');
    });
  });

  describe('TopBorderStrategy', () => {
    it('should apply top border only', () => {
      const strategy = new TopBorderStrategy();
      const range = new CellRange(0, 0, 2, 2);
      const mockRows = createMockRows();
      const setStyleBorder = vi.fn();

      strategy.apply(range, 'thin', '#000', mockRows as any, setStyleBorder);

      // Should apply top border to first row cells
      expect(setStyleBorder).toHaveBeenCalled();
      const calls = setStyleBorder.mock.calls;
      calls.forEach((call) => {
        const [ri, , bss] = call;
        expect(ri).toBe(0); // Only first row
        expect(bss).toHaveProperty('top');
        expect(bss.top).toEqual(['thin', '#000', '']);
      });
    });
  });

  describe('BottomBorderStrategy', () => {
    it('should apply bottom border only', () => {
      const strategy = new BottomBorderStrategy();
      const range = new CellRange(0, 0, 2, 2);
      const mockRows = createMockRows();
      const setStyleBorder = vi.fn();

      strategy.apply(range, 'thin', '#000', mockRows as any, setStyleBorder);

      // Should apply bottom border to last row cells
      expect(setStyleBorder).toHaveBeenCalled();
      const calls = setStyleBorder.mock.calls;
      calls.forEach((call) => {
        const [ri, , bss] = call;
        expect(ri).toBe(2); // Only last row (eri)
        expect(bss).toHaveProperty('bottom');
        expect(bss.bottom).toEqual(['thin', '#000', '']);
      });
    });
  });

  describe('LeftBorderStrategy', () => {
    it('should apply left border only', () => {
      const strategy = new LeftBorderStrategy();
      const range = new CellRange(0, 0, 2, 2);
      const mockRows = createMockRows();
      const setStyleBorder = vi.fn();

      strategy.apply(range, 'thin', '#000', mockRows as any, setStyleBorder);

      // Should apply left border to first column cells
      expect(setStyleBorder).toHaveBeenCalled();
      const calls = setStyleBorder.mock.calls;
      calls.forEach((call) => {
        const [, ci, bss] = call;
        expect(ci).toBe(0); // Only first column
        expect(bss).toHaveProperty('left');
        expect(bss.left).toEqual(['thin', '#000', '']);
      });
    });
  });

  describe('RightBorderStrategy', () => {
    it('should apply right border only', () => {
      const strategy = new RightBorderStrategy();
      const range = new CellRange(0, 0, 2, 2);
      const mockRows = createMockRows();
      const setStyleBorder = vi.fn();

      strategy.apply(range, 'thin', '#000', mockRows as any, setStyleBorder);

      // Should apply right border to last column cells
      expect(setStyleBorder).toHaveBeenCalled();
      const calls = setStyleBorder.mock.calls;
      calls.forEach((call) => {
        const [, ci, bss] = call;
        expect(ci).toBe(2); // Only last column (eci)
        expect(bss).toHaveProperty('right');
        expect(bss.right).toEqual(['thin', '#000', '']);
      });
    });
  });

  describe('HorizontalBordersStrategy', () => {
    it('should apply horizontal borders between rows', () => {
      const strategy = new HorizontalBordersStrategy();
      const range = new CellRange(0, 0, 2, 2);
      const mockRows = createMockRows();
      const setStyleBorder = vi.fn();

      strategy.apply(range, 'thin', '#000', mockRows as any, setStyleBorder);

      // Should apply bottom borders to all but the last row
      expect(setStyleBorder).toHaveBeenCalled();
      const calls = setStyleBorder.mock.calls;
      calls.forEach((call) => {
        const [ri, , bss] = call;
        expect(ri).toBeLessThan(2); // Not the last row
        expect(bss).toHaveProperty('bottom');
      });
    });
  });

  describe('VerticalBordersStrategy', () => {
    it('should apply vertical borders between columns', () => {
      const strategy = new VerticalBordersStrategy();
      const range = new CellRange(0, 0, 2, 2);
      const mockRows = createMockRows();
      const setStyleBorder = vi.fn();

      strategy.apply(range, 'thin', '#000', mockRows as any, setStyleBorder);

      // Should apply right borders to all but the last column
      expect(setStyleBorder).toHaveBeenCalled();
      const calls = setStyleBorder.mock.calls;
      calls.forEach((call) => {
        const [, ci, bss] = call;
        expect(ci).toBeLessThan(2); // Not the last column
        expect(bss).toHaveProperty('right');
      });
    });
  });

  describe('BorderStrategyFactory', () => {
    it('should return correct strategy for each mode', () => {
      const factory = new BorderStrategyFactory();

      expect(factory.getStrategy('all')).toBeInstanceOf(AllBordersStrategy);
      expect(factory.getStrategy('inside')).toBeInstanceOf(InsideBordersStrategy);
      expect(factory.getStrategy('outside')).toBeInstanceOf(OutsideBordersStrategy);
      expect(factory.getStrategy('horizontal')).toBeInstanceOf(HorizontalBordersStrategy);
      expect(factory.getStrategy('vertical')).toBeInstanceOf(VerticalBordersStrategy);
      expect(factory.getStrategy('top')).toBeInstanceOf(TopBorderStrategy);
      expect(factory.getStrategy('bottom')).toBeInstanceOf(BottomBorderStrategy);
      expect(factory.getStrategy('left')).toBeInstanceOf(LeftBorderStrategy);
      expect(factory.getStrategy('right')).toBeInstanceOf(RightBorderStrategy);
    });

    it('should return null for unknown mode', () => {
      const factory = new BorderStrategyFactory();
      expect(factory.getStrategy('unknown')).toBe(null);
    });

    it('should validate mode correctly', () => {
      const factory = new BorderStrategyFactory();
      expect(factory.isValidMode('all')).toBe(true);
      expect(factory.isValidMode('unknown')).toBe(false);
    });

    it('should return all available modes', () => {
      const factory = new BorderStrategyFactory();
      const modes = factory.getAvailableModes();

      expect(modes).toContain('all');
      expect(modes).toContain('inside');
      expect(modes).toContain('outside');
      expect(modes).toContain('horizontal');
      expect(modes).toContain('vertical');
      expect(modes).toContain('top');
      expect(modes).toContain('bottom');
      expect(modes).toContain('left');
      expect(modes).toContain('right');
    });
  });
});
