import { create } from 'zustand';
import type { CellRange } from '../core/cellRange';
import DataProxy from '../core/dataProxy';
import type { Options } from '../index';
import type {
  ChangeListener,
  SheetDataInput,
  StyleValue,
} from '../types/index';

interface SheetState {
  // 数据状态
  sheets: DataProxy[];
  activeSheetIndex: number;

  // UI 状态
  isEditing: boolean;
  editingInitialChar: string | null; // 直接输入时的初始字符
  editingCell: { ri: number; ci: number } | null; // 正在编辑的单元格
  editingText: string; // 当前编辑的文本
  contextMenuPosition: { x: number; y: number } | null;
  showContextMenu: boolean;

  // 更新计数器 - 用于触发组件重新渲染
  updateCount: number;

  // 计算属性获取器
  getActiveSheet: () => DataProxy;
  getSelection: () => CellRange;

  // Actions - 表格管理
  addSheet: (name?: string, active?: boolean) => void;
  deleteSheet: (index: number) => void;
  switchSheet: (index: number) => void;
  renameSheet: (index: number, name: string) => void;

  // Actions - 单元格操作
  setCellText: (
    ri: number,
    ci: number,
    text: string,
    state?: 'input' | 'finished',
  ) => void;
  setSelection: (ri: number, ci: number, multiple?: boolean) => void;
  setSelectionEnd: (ri: number, ci: number) => void;

  // Actions - 样式操作
  setCellStyle: (property: string, value: StyleValue) => void;

  // Actions - 编辑状态
  startEditing: (initialChar?: string) => void;
  stopEditing: () => void;
  setEditingText: (text: string) => void;

  // Actions - 右键菜单
  openContextMenu: (x: number, y: number) => void;
  closeContextMenu: () => void;

  // Actions - 撤销/重做
  undo: () => void;
  redo: () => void;

  // Actions - 剪贴板
  copy: () => void;
  cut: () => void;
  paste: (what?: 'all' | 'text' | 'format') => void;

  // Actions - 数据加载
  loadData: (data: SheetDataInput | SheetDataInput[]) => void;
  getData: () => SheetDataInput[];

  // Actions - 触发变更事件
  triggerChange: () => void;

  // 事件监听器
  changeListeners: ChangeListener[];
  addChangeListener: (listener: ChangeListener) => void;
  removeChangeListener: (listener: ChangeListener) => void;
}

const defaultOptions: Partial<Options> = {
  mode: 'edit',
  showToolbar: true,
  showGrid: true,
  showContextmenu: true,
  showBottomBar: true,
  view: {
    height: () => document.documentElement.clientHeight,
    width: () => document.documentElement.clientWidth,
  },
  style: {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    strike: false,
    underline: false,
    color: '#0a0a0a',
    font: {
      name: 'Helvetica',
      size: 10,
      bold: false,
      italic: false,
    },
    format: 'normal',
  },
};

export const useSheetStore = create<SheetState>((set, get) => {
  let sheetIndex = 1;

  const createSheet = (
    name?: string,
    options: Partial<Options> = defaultOptions,
  ): DataProxy => {
    const sheetName = name || `sheet${sheetIndex}`;
    const data = new DataProxy(
      sheetName,
      options as ConstructorParameters<typeof DataProxy>[1],
    );

    // 绑定 change 事件到 store
    data.change = () => {
      get().triggerChange();
    };

    sheetIndex += 1;
    return data;
  };

  // 初始化一个默认 sheet
  const initialSheet = createSheet('sheet1', defaultOptions);

  return {
    // 初始状态
    sheets: [initialSheet],
    activeSheetIndex: 0,
    isEditing: false,
    editingInitialChar: null,
    editingCell: null,
    editingText: '',
    contextMenuPosition: null,
    showContextMenu: false,
    updateCount: 0,
    changeListeners: [],

    // 计算属性
    getActiveSheet: () => {
      const state = get();
      return state.sheets[state.activeSheetIndex];
    },

    getSelection: () => {
      return get().getActiveSheet().selector.range;
    },

    // 表格管理
    addSheet: (name?: string, active = true) => {
      set((state) => {
        const newSheet = createSheet(name, defaultOptions);
        const newSheets = [...state.sheets, newSheet];
        return {
          sheets: newSheets,
          activeSheetIndex: active
            ? newSheets.length - 1
            : state.activeSheetIndex,
        };
      });
      get().triggerChange();
    },

    deleteSheet: (index: number) => {
      set((state) => {
        if (state.sheets.length <= 1) return state;

        const newSheets = state.sheets.filter((_, i) => i !== index);
        let newActiveIndex = state.activeSheetIndex;

        if (index === state.activeSheetIndex) {
          newActiveIndex = Math.min(index, newSheets.length - 1);
        } else if (index < state.activeSheetIndex) {
          newActiveIndex = state.activeSheetIndex - 1;
        }

        return {
          sheets: newSheets,
          activeSheetIndex: newActiveIndex,
        };
      });
      get().triggerChange();
    },

    switchSheet: (index: number) => {
      set({ activeSheetIndex: index, isEditing: false });
    },

    renameSheet: (index: number, name: string) => {
      set((state) => {
        const newSheets = [...state.sheets];
        newSheets[index].name = name;
        return { sheets: newSheets };
      });
      get().triggerChange();
    },

    // 单元格操作
    setCellText: (
      ri: number,
      ci: number,
      text: string,
      state: 'input' | 'finished' = 'finished',
    ) => {
      const sheet = get().getActiveSheet();
      // 直接设置指定单元格的文本，不改变当前选区
      sheet.setCellText(ri, ci, text, state);
      if (state === 'finished') {
        get().triggerChange();
      }
    },

    setSelection: (ri: number, ci: number, multiple = false) => {
      const sheet = get().getActiveSheet();
      if (multiple) {
        sheet.calSelectedRangeByEnd(ri, ci);
      } else {
        sheet.calSelectedRangeByStart(ri, ci);
        sheet.selector.setIndexes(ri, ci);
      }
      // 触发视图更新（不触发 change 事件）
      set({}); // 强制 Zustand 通知订阅者
    },

    setSelectionEnd: (ri: number, ci: number) => {
      const sheet = get().getActiveSheet();
      sheet.calSelectedRangeByEnd(ri, ci);
      // 触发视图更新
      set({});
    },

    // 样式操作
    setCellStyle: (property: string, value: StyleValue) => {
      const sheet = get().getActiveSheet();
      sheet.setSelectedCellAttr(property, value);
      get().triggerChange();
    },

    // 编辑状态
    startEditing: (initialChar?: string) => {
      const sheet = get().getActiveSheet();
      const { ri, ci } = sheet.selector;
      const cell = sheet.getSelectedCell();
      const initialText =
        initialChar !== null && initialChar !== undefined
          ? initialChar
          : cell?.text || '';

      set({
        isEditing: true,
        editingInitialChar: initialChar || null,
        editingCell: { ri, ci },
        editingText: initialText,
      });
    },
    stopEditing: () => {
      const state = get();
      // 保存编辑内容到单元格
      if (state.editingCell && state.isEditing) {
        const { ri, ci } = state.editingCell;
        const sheet = state.getActiveSheet();
        sheet.setCellText(ri, ci, state.editingText, 'finished');
        state.triggerChange();
      }
      set({
        isEditing: false,
        editingInitialChar: null,
        editingCell: null,
        editingText: '',
      });
    },
    setEditingText: (text: string) => set({ editingText: text }),

    // 右键菜单
    openContextMenu: (x: number, y: number) => {
      set({
        contextMenuPosition: { x, y },
        showContextMenu: true,
      });
    },

    closeContextMenu: () => {
      set({
        showContextMenu: false,
        contextMenuPosition: null,
      });
    },

    // 撤销/重做
    undo: () => {
      const sheet = get().getActiveSheet();
      sheet.undo();
      get().triggerChange();
    },

    redo: () => {
      const sheet = get().getActiveSheet();
      sheet.redo();
      get().triggerChange();
    },

    // 剪贴板
    copy: () => {
      const sheet = get().getActiveSheet();
      sheet.copy();
    },

    cut: () => {
      const sheet = get().getActiveSheet();
      sheet.cut();
    },

    paste: (what: 'all' | 'text' | 'format' = 'all') => {
      const sheet = get().getActiveSheet();
      sheet.paste(what);
      get().triggerChange();
    },

    // 数据加载
    loadData: (data: SheetDataInput | SheetDataInput[]) => {
      const dataArray = Array.isArray(data) ? data : [data];

      set((state) => {
        const newSheets: DataProxy[] = [];

        dataArray.forEach((sheetData, i) => {
          const sheet = createSheet(
            sheetData.name || `sheet${i + 1}`,
            defaultOptions,
          );
          sheet.setData(sheetData as unknown as Record<string, unknown>);
          newSheets.push(sheet);
        });

        return {
          sheets: newSheets.length > 0 ? newSheets : state.sheets,
          activeSheetIndex: 0,
        };
      });

      get().triggerChange();
    },

    getData: (): SheetDataInput[] => {
      return get().sheets.map((sheet) => sheet.getData());
    },

    // 事件系统
    triggerChange: () => {
      // 增加更新计数器，触发组件重新渲染
      set((state) => ({ updateCount: state.updateCount + 1 }));

      const state = get();
      const data = state.getData();
      state.changeListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error('Error in change listener:', error);
        }
      });
    },

    addChangeListener: (listener: ChangeListener) => {
      set((state) => ({
        changeListeners: [...state.changeListeners, listener],
      }));
    },

    removeChangeListener: (listener: ChangeListener) => {
      set((state) => ({
        changeListeners: state.changeListeners.filter((l) => l !== listener),
      }));
    },
  };
});

// 导出 hook 的选择器，用于性能优化
export const useActiveSheet = () =>
  useSheetStore((state) => state.getActiveSheet());
export const useSelection = () =>
  useSheetStore((state) => state.getSelection());
export const useIsEditing = () => useSheetStore((state) => state.isEditing);
export const useUpdateCount = () => useSheetStore((state) => state.updateCount);
