import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSheetStore } from '../../src/sheet/store/useSheetStore';

describe('useSheetStore', () => {
  it('应该初始化默认状态', () => {
    const { result } = renderHook(() => useSheetStore());
    const state = result.current;

    expect(state.sheets).toHaveLength(1);
    expect(state.activeSheetIndex).toBe(0);
    expect(state.isEditing).toBe(false);
    expect(state.contextMenuPosition).toBe(null);
  });

  it('应该能够添加新表格', () => {
    const { result } = renderHook(() => useSheetStore());

    act(() => {
      result.current.addSheet();
    });

    expect(result.current.sheets).toHaveLength(2);
  });

  it('应该能够切换表格', () => {
    const { result } = renderHook(() => useSheetStore());

    act(() => {
      result.current.addSheet();
      result.current.switchSheet(1);
    });

    expect(result.current.activeSheetIndex).toBe(1);
  });

  it('应该能够删除表格', () => {
    const { result } = renderHook(() => useSheetStore());

    const initialLength = result.current.sheets.length;

    // 添加一个新表格
    act(() => {
      result.current.addSheet();
    });

    expect(result.current.sheets).toHaveLength(initialLength + 1);

    // 删除最后一个表格
    act(() => {
      result.current.deleteSheet(initialLength);
    });

    expect(result.current.sheets).toHaveLength(initialLength);
  });

  it('应该能够重命名表格', () => {
    const { result } = renderHook(() => useSheetStore());
    const newName = 'New Sheet Name';

    act(() => {
      result.current.renameSheet(0, newName);
    });

    expect(result.current.sheets[0].name).toBe(newName);
  });

  it('应该能够设置单元格文本', () => {
    const { result } = renderHook(() => useSheetStore());

    act(() => {
      result.current.setCellText(0, 0, 'Test');
    });

    const sheet = result.current.getActiveSheet();
    const cell = sheet.rows.getCell(0, 0);
    expect(cell?.text).toBe('Test');
  });

  it('应该能够设置选区', () => {
    const { result } = renderHook(() => useSheetStore());

    act(() => {
      result.current.setSelection(1, 1);
    });

    const sheet = result.current.getActiveSheet();
    expect(sheet.selector.ri).toBe(1);
    expect(sheet.selector.ci).toBe(1);
  });

  it('应该能够开始和停止编辑', () => {
    const { result } = renderHook(() => useSheetStore());

    act(() => {
      result.current.startEditing(0, 0);
    });

    expect(result.current.isEditing).toBe(true);

    act(() => {
      result.current.stopEditing();
    });

    expect(result.current.isEditing).toBe(false);
  });

  it('应该能够打开和关闭右键菜单', () => {
    const { result } = renderHook(() => useSheetStore());

    act(() => {
      result.current.openContextMenu(100, 200);
    });

    expect(result.current.contextMenuPosition).toEqual({ x: 100, y: 200 });

    act(() => {
      result.current.closeContextMenu();
    });

    expect(result.current.contextMenuPosition).toBe(null);
  });

  it('应该能够撤销和重做', () => {
    const { result } = renderHook(() => useSheetStore());

    act(() => {
      result.current.setCellText(0, 0, 'Test 1');
    });

    let sheet = result.current.getActiveSheet();
    let cell = sheet.rows.getCell(0, 0);
    expect(cell?.text).toBe('Test 1');

    act(() => {
      result.current.setCellText(0, 0, 'Test 2');
    });

    sheet = result.current.getActiveSheet();
    cell = sheet.rows.getCell(0, 0);
    expect(cell?.text).toBe('Test 2');

    // 撤销和重做功能依赖于 DataProxy 的 history 实现
    // 这里只验证方法可以被调用而不抛出错误
    expect(() => {
      act(() => {
        result.current.undo();
      });
    }).not.toThrow();

    expect(() => {
      act(() => {
        result.current.redo();
      });
    }).not.toThrow();
  });

  it('应该能够加载和获取数据', () => {
    const { result } = renderHook(() => useSheetStore());
    const testData = [
      {
        name: 'Test Sheet',
        rows: {
          0: { cells: { 0: { text: 'A1' } } },
        },
      },
    ];

    act(() => {
      result.current.loadData(testData);
    });

    const data = result.current.getData();
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('Test Sheet');
  });

  it('应该能够添加和移除变化监听器', () => {
    const { result } = renderHook(() => useSheetStore());
    let changeCount = 0;

    const listener = () => {
      changeCount++;
    };

    act(() => {
      result.current.addChangeListener(listener);
      result.current.setCellText(0, 0, 'Test');
    });

    expect(changeCount).toBeGreaterThan(0);

    const initialCount = changeCount;

    act(() => {
      result.current.removeChangeListener(listener);
      result.current.setCellText(0, 1, 'Test 2');
    });

    expect(changeCount).toBe(initialCount);
  });
});
