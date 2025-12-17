import { describe, expect, it } from 'vitest';
import { TegoSheet } from '../src/sheet';

// These tests check basic component exports since full rendering
// requires extensive mocking of internal dependencies
describe('TegoSheet', () => {
  it('TegoSheet component should exist', () => {
    expect(TegoSheet).toBeDefined();
    expect(typeof TegoSheet).toBe('function');
  });
});
