import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectionOverlay } from '../../src/sheet/components/Selection/SelectionOverlay';

// Mock useSheetStore
const mockUseActiveSheet = vi.fn();
const mockUseSelection = vi.fn();

vi.mock('../../src/sheet/store/useSheetStore', () => ({
  useActiveSheet: () => mockUseActiveSheet(),
  useSelection: () => mockUseSelection(),
  useSheetStore: {
    subscribe: (_callback: () => void) => {
      // Return unsubscribe function
      return () => {};
    },
  },
}));

describe('SelectionOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染选区覆盖层', () => {
    const mockData = {
      rows: { len: 100, height: 25 },
      cols: { len: 26, indexWidth: 60 },
      getSelectedRect: () => ({ left: 100, top: 50, width: 100, height: 25 }),
      getClipboardRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
      selector: { range: { sri: 0, sci: 0, eri: 0, eci: 0 } },
    };

    mockUseActiveSheet.mockReturnValue(mockData);
    mockUseSelection.mockReturnValue({ sri: 0, sci: 0, eri: 0, eci: 0 });

    const { container } = render(<SelectionOverlay />);

    // 选区覆盖层应该存在
    expect(container.firstChild).toBeTruthy();
  });

  it('当没有数据时不应该渲染', () => {
    mockUseActiveSheet.mockReturnValue(null);
    mockUseSelection.mockReturnValue(null);

    const { container } = render(<SelectionOverlay />);

    expect(container.firstChild).toBeNull();
  });
});
