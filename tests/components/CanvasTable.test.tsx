import { describe, expect, it } from 'vitest';
import { CanvasTable } from '../../src/sheet/components/CanvasTable';

// These tests check basic component exports since full rendering
// requires extensive mocking of DataProxy and related dependencies
describe('CanvasTable', () => {
  it('CanvasTable 组件应该存在', () => {
    expect(CanvasTable).toBeDefined();
    expect(typeof CanvasTable).toBe('function');
  });
});
