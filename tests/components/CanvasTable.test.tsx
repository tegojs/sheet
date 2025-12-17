import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CanvasTable } from '../../src/sheet/components/CanvasTable';
import { useSheetStore } from '../../src/sheet/store/useSheetStore';

// Mock useSheetStore
vi.mock('/home/zhanglin/sheet/src/sheet/store/useSheetStore', () => ({
  useSheetStore: vi.fn(),
  useActiveSheet: vi.fn(),
}));

describe('CanvasTable', () => {
  it('应该渲染 canvas 元素', () => {
    const mockData = {
      rows: { len: 100 },
      cols: { len: 26 },
      viewWidth: () => 800,
      viewHeight: () => 600,
    };

    vi.mocked(useSheetStore).mockReturnValue({
      subscribe: vi.fn(() => vi.fn()),
    } as ReturnType<typeof useSheetStore>);

    const {
      useActiveSheet,
    } = require('/home/zhanglin/sheet/src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(mockData);

    const { container } = render(<CanvasTable />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toBeTruthy();
    expect(canvas?.className).toContain('x-spreadsheet-table');
  });

  it('当没有数据时应该显示加载状态', () => {
    const {
      useActiveSheet,
    } = require('/home/zhanglin/sheet/src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(null);

    const { container } = render(<CanvasTable />);

    expect(container.textContent).toContain('Loading');
  });
});
