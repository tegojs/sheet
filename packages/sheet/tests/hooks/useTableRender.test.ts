import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DataProxy from '../../src/sheet/core/dataProxy';
import { useTableRender } from '../../src/sheet/hooks/useTableRender';

describe('useTableRender', () => {
  it('应该初始化 canvas ref', () => {
    const data = new DataProxy('test');
    const { result } = renderHook(() => useTableRender(data));

    expect(result.current.canvasRef).toBeDefined();
    expect(result.current.canvasRef.current).toBeNull();
  });

  it('应该提供 render 函数', () => {
    const data = new DataProxy('test');
    const { result } = renderHook(() => useTableRender(data));

    expect(result.current.render).toBeInstanceOf(Function);
  });

  it('render 函数应该可以被调用', () => {
    const data = new DataProxy('test');
    const { result } = renderHook(() => useTableRender(data));

    // 创建一个 mock canvas 元素
    const mockCanvas = document.createElement('canvas');
    const mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 50 })),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      setLineDash: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
    };

    mockCanvas.getContext = vi.fn(
      () => mockContext as unknown as CanvasRenderingContext2D,
    ) as unknown as typeof mockCanvas.getContext;
    Object.defineProperty(result.current.canvasRef, 'current', {
      writable: true,
      value: mockCanvas,
    });

    // 调用 render 不应该抛出错误
    expect(() => result.current.render()).not.toThrow();
  });
});
