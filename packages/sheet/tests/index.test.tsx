import { describe, expect, it } from 'vitest';
import { ReactSheet } from '../src/sheet';

// These tests check basic component exports since full rendering
// requires extensive mocking of internal dependencies
describe('ReactSheet', () => {
  it('ReactSheet 组件应该存在', () => {
    expect(ReactSheet).toBeDefined();
    expect(typeof ReactSheet).toBe('function');
  });
});
