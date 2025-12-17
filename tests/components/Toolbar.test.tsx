import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Toolbar } from '../../src/sheet/components/Toolbar/Toolbar';
import { useSheetStore } from '../../src/sheet/store/useSheetStore';

// Mock useSheetStore
vi.mock('../../src/sheet/store/useSheetStore', () => ({
  useSheetStore: vi.fn(),
  useActiveSheet: vi.fn(),
}));

describe('Toolbar', () => {
  it('应该渲染工具栏', () => {
    const mockData = {
      rows: { len: 100 },
      cols: { len: 26 },
    };

    vi.mocked(useSheetStore).mockReturnValue({
      undo: vi.fn(),
      redo: vi.fn(),
      setCellStyle: vi.fn(),
    } as ReturnType<typeof useSheetStore>);

    const { useActiveSheet } = require('../../src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(mockData);

    const { container } = render(<Toolbar />);
    const toolbar = container.querySelector('.x-spreadsheet-toolbar');

    expect(toolbar).toBeTruthy();
  });

  it('应该包含撤销和重做按钮', () => {
    const mockData = {
      rows: { len: 100 },
      cols: { len: 26 },
    };

    vi.mocked(useSheetStore).mockReturnValue({
      undo: vi.fn(),
      redo: vi.fn(),
      setCellStyle: vi.fn(),
    } as ReturnType<typeof useSheetStore>);

    const { useActiveSheet } = require('../../src/sheet/store/useSheetStore');
    vi.mocked(useActiveSheet).mockReturnValue(mockData);

    const { container } = render(<Toolbar />);
    const buttons = container.querySelectorAll('.x-spreadsheet-toolbar-btn');

    expect(buttons.length).toBeGreaterThan(0);
  });
});
