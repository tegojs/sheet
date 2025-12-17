import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ReactSheet } from '../src/sheet';

describe('ReactSheet', () => {
  it('应该正确渲染', () => {
    const { container } = render(<ReactSheet />);
    expect(container).toBeTruthy();
  });

  it('应该渲染 canvas 元素', () => {
    render(<ReactSheet />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('应该有正确的 CSS 类名', () => {
    const { container } = render(<ReactSheet />);
    const sheetElement = container.querySelector('.x-spreadsheet');
    expect(sheetElement).toBeTruthy();
  });
});
