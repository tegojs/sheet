import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CellEditor } from '../../src/sheet/components/Editor/CellEditor';

// Mock useSheetStore
const mockUseSheetStore = vi.fn();
const mockUseActiveSheet = vi.fn();
const mockUseIsEditing = vi.fn();

vi.mock('../../src/sheet/store/useSheetStore', () => ({
  useSheetStore: () => mockUseSheetStore(),
  useActiveSheet: () => mockUseActiveSheet(),
  useIsEditing: () => mockUseIsEditing(),
}));

describe('CellEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSheetStore.mockReturnValue({
      setCellText: vi.fn(),
      stopEditing: vi.fn(),
    });
  });

  it('当不在编辑状态时不应该显示', () => {
    const mockData = {
      rows: { len: 100, height: 25 },
      cols: { len: 26, indexWidth: 60 },
      getSelectedRect: () => ({ left: 100, top: 50, width: 100, height: 25 }),
      getSelectedCell: () => ({ text: 'Test' }),
      selector: { ri: 0, ci: 0 },
    };

    mockUseActiveSheet.mockReturnValue(mockData);
    mockUseIsEditing.mockReturnValue(false);

    const { container } = render(<CellEditor />);

    expect(container.querySelector('textarea')).toBeNull();
  });

  it('当在编辑状态时应该显示编辑器', () => {
    const mockData = {
      rows: { len: 100, height: 25 },
      cols: { len: 26, indexWidth: 60 },
      getSelectedRect: () => ({ left: 100, top: 50, width: 100, height: 25 }),
      getSelectedCell: () => ({ text: 'Test' }),
      selector: { ri: 0, ci: 0 },
    };

    mockUseActiveSheet.mockReturnValue(mockData);
    mockUseIsEditing.mockReturnValue(true);

    const { container } = render(<CellEditor />);
    const textarea = container.querySelector('textarea');

    expect(textarea).toBeTruthy();
    expect(textarea?.value).toBe('Test');
  });
});
