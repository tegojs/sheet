import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardShortcuts } from '../../src/sheet/hooks/useKeyboardShortcuts';
import { useSheetStore } from '../../src/sheet/store/useSheetStore';

// Mock useSheetStore
vi.mock('../../src/sheet/store/useSheetStore', () => ({
  useSheetStore: vi.fn(),
}));

describe('useKeyboardShortcuts', () => {
  it('应该注册键盘事件监听器', () => {
    const mockUndo = vi.fn();
    const mockRedo = vi.fn();
    const mockCut = vi.fn();
    const mockStartEditing = vi.fn();
    const mockStopEditing = vi.fn();
    const mockSetCellStyle = vi.fn();
    const mockGetActiveSheet = vi.fn(() => ({
      selector: { ri: 0, ci: 0 },
    }));

    vi.mocked(useSheetStore).mockReturnValue({
      undo: mockUndo,
      redo: mockRedo,
      cut: mockCut,
      startEditing: mockStartEditing,
      stopEditing: mockStopEditing,
      setCellStyle: mockSetCellStyle,
      getActiveSheet: mockGetActiveSheet,
    } as ReturnType<typeof useSheetStore>);

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyboardShortcuts());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('应该在组件卸载时移除事件监听器', () => {
    const mockUndo = vi.fn();
    const mockRedo = vi.fn();
    const mockCut = vi.fn();
    const mockStartEditing = vi.fn();
    const mockStopEditing = vi.fn();
    const mockSetCellStyle = vi.fn();
    const mockGetActiveSheet = vi.fn(() => ({
      selector: { ri: 0, ci: 0 },
    }));

    vi.mocked(useSheetStore).mockReturnValue({
      undo: mockUndo,
      redo: mockRedo,
      cut: mockCut,
      startEditing: mockStartEditing,
      stopEditing: mockStopEditing,
      setCellStyle: mockSetCellStyle,
      getActiveSheet: mockGetActiveSheet,
    } as ReturnType<typeof useSheetStore>);

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyboardShortcuts());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();

    removeEventListenerSpy.mockRestore();
  });
});
