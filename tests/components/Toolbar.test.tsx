import { describe, expect, it } from 'vitest';
import { Toolbar } from '../../src/sheet/components/Toolbar/Toolbar';

// These tests check basic component exports since full rendering
// requires extensive mocking of DataProxy methods (canUndo, canRedo, canAutofilter, freezeIsActive, etc.)
describe('Toolbar', () => {
  it('Toolbar 组件应该存在', () => {
    expect(Toolbar).toBeDefined();
    expect(typeof Toolbar).toBe('function');
  });
});
