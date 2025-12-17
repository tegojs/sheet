import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DataProxy from '../../src/sheet/core/dataProxy';
import { useMouseInteraction } from '../../src/sheet/hooks/useMouseInteraction';

describe('useMouseInteraction', () => {
  it('应该初始化鼠标交互状态', () => {
    const data = new DataProxy('test');
    const mockHandlers = {
      onCellClick: vi.fn(),
      onCellDoubleClick: vi.fn(),
      onSelectionChange: vi.fn(),
      onContextMenu: vi.fn(),
    };

    const { result } = renderHook(() =>
      useMouseInteraction(data, mockHandlers),
    );

    expect(result.current.handleMouseDown).toBeInstanceOf(Function);
    expect(result.current.handleMouseMove).toBeInstanceOf(Function);
    expect(result.current.handleMouseUp).toBeInstanceOf(Function);
    expect(result.current.handleContextMenu).toBeInstanceOf(Function);
  });

  it('应该提供所有必需的事件处理器', () => {
    const data = new DataProxy('test');
    const mockHandlers = {
      onCellClick: vi.fn(),
      onCellDoubleClick: vi.fn(),
      onSelectionChange: vi.fn(),
      onContextMenu: vi.fn(),
    };

    const { result } = renderHook(() =>
      useMouseInteraction(data, mockHandlers),
    );

    expect(result.current).toHaveProperty('handleMouseDown');
    expect(result.current).toHaveProperty('handleMouseMove');
    expect(result.current).toHaveProperty('handleMouseUp');
    expect(result.current).toHaveProperty('handleContextMenu');
  });
});
