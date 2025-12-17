import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SelectionOverlay } from '../../src/sheet/components/Selection/SelectionOverlay';
import { useSheetStore } from '../../src/sheet/store/useSheetStore';

// Mock useSheetStore
vi.mock('/home/zhanglin/sheet/src/sheet/store/useSheetStore', () => ({
  useActiveSheet: vi.fn(),
  useSelection: vi.fn(),
}));

describe('SelectionOverlay', () => {
  it('应该渲染选区覆盖层', () => {
    const mockData = {
      rows: { len: 100, height: 25 },
      cols: { len: 26, indexWidth: 60 },
      getSelectedRect: () => ({ left: 100, top: 50, width: 100, height: 25 }),
      selector: { range: { sri: 0, sci: 0, eri: 0, eci: 0 } },
    };

    const {
      useActiveSheet,
      useSelection,
    } = require('/home/zhanglin/sheet/src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(mockData);
    vi.mocked(useSelection).mockReturnValue({ sri: 0, sci: 0, eri: 0, eci: 0 });

    const { container } = render(<SelectionOverlay />);

    // 选区覆盖层应该存在
    expect(container.firstChild).toBeTruthy();
  });

  it('当没有数据时不应该渲染', () => {
    const {
      useActiveSheet,
      useSelection,
    } = require('/home/zhanglin/sheet/src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(null);
    vi.mocked(useSelection).mockReturnValue(null);

    const { container } = render(<SelectionOverlay />);

    expect(container.firstChild).toBeNull();
  });
});
