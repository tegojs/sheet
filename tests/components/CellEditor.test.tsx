import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CellEditor } from '../../src/sheet/components/Editor/CellEditor';
import { useSheetStore } from '../../src/sheet/store/useSheetStore';

// Mock useSheetStore
vi.mock('/home/zhanglin/sheet/src/sheet/store/useSheetStore', () => ({
  useSheetStore: vi.fn(),
  useActiveSheet: vi.fn(),
  useIsEditing: vi.fn(),
}));

describe('CellEditor', () => {
  it('当不在编辑状态时不应该显示', () => {
    const mockData = {
      rows: { len: 100, height: 25 },
      cols: { len: 26, indexWidth: 60 },
      getSelectedRect: () => ({ left: 100, top: 50, width: 100, height: 25 }),
      getSelectedCell: () => ({ text: 'Test' }),
      selector: { ri: 0, ci: 0 },
    };

    vi.mocked(useSheetStore).mockReturnValue({
      setCellText: vi.fn(),
      stopEditing: vi.fn(),
    } as ReturnType<typeof useSheetStore>);

    const {
      useActiveSheet,
      useIsEditing,
    } = require('/home/zhanglin/sheet/src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(mockData);
    vi.mocked(useIsEditing).mockReturnValue(false);

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

    vi.mocked(useSheetStore).mockReturnValue({
      setCellText: vi.fn(),
      stopEditing: vi.fn(),
    } as ReturnType<typeof useSheetStore>);

    const {
      useActiveSheet,
      useIsEditing,
    } = require('/home/zhanglin/sheet/src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(mockData);
    vi.mocked(useIsEditing).mockReturnValue(true);

    const { container } = render(<CellEditor />);
    const textarea = container.querySelector('textarea');

    expect(textarea).toBeTruthy();
    expect(textarea?.value).toBe('Test');
  });
});
