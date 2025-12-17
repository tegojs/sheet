import { useCallback, useRef } from 'react';
import type DataProxy from '../core/data_proxy';
import { useSheetStore } from '../store/useSheetStore';

interface MouseInteractionOptions {
  onCellClick?: (ri: number, ci: number) => void;
  onCellDoubleClick?: (ri: number, ci: number) => void;
  onSelectionChange?: () => void;
}

export function useMouseInteraction(
  data: DataProxy | null,
  options: MouseInteractionOptions = {},
) {
  const { setSelection, setSelectionEnd, startEditing, openContextMenu } =
    useSheetStore();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startCellRef = useRef<{ ri: number; ci: number } | null>(null);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!data) return;

      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const cellRect = data.getCellRectByXY(x, y);
      const { ri, ci } = cellRect;

      // 记录起始单元格
      startCellRef.current = { ri, ci };
      isDraggingRef.current = false;

      // 设置选区
      if (event.shiftKey) {
        // Shift+点击 - 扩展选区
        setSelectionEnd(ri, ci);
      } else {
        // 普通点击 - 新选区
        setSelection(ri, ci, false);
      }

      if (options.onSelectionChange) {
        options.onSelectionChange();
      }

      // 处理单击/双击
      clickCountRef.current += 1;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          // 单击
          if (options.onCellClick) {
            options.onCellClick(ri, ci);
          }
        } else if (clickCountRef.current === 2) {
          // 双击 - 开始编辑
          if (options.onCellDoubleClick) {
            options.onCellDoubleClick(ri, ci);
          }
          startEditing();
        }
        clickCountRef.current = 0;
      }, 250);
    },
    [data, setSelection, setSelectionEnd, startEditing, options],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!data || !startCellRef.current) return;

      // 如果鼠标按下并移动，则开始拖拽选择
      if (event.buttons === 1) {
        isDraggingRef.current = true;

        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const cellRect = data.getCellRectByXY(x, y);
        const { ri, ci } = cellRect;

        // 扩展选区
        setSelectionEnd(ri, ci);

        if (options.onSelectionChange) {
          options.onSelectionChange();
        }
      }
    },
    [data, setSelectionEnd, options],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    startCellRef.current = null;
  }, []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault();

      if (!data) return;

      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const cellRect = data.getCellRectByXY(x, y);
      const { ri, ci } = cellRect;

      // 如果右键点击的单元格不在当前选区内，则设置新选区
      const { sri, sci, eri, eci } = data.selector.range;
      if (ri < sri || ri > eri || ci < sci || ci > eci) {
        setSelection(ri, ci, false);
      }

      // 打开右键菜单
      openContextMenu(event.clientX, event.clientY);
    },
    [data, setSelection, openContextMenu],
  );

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
  };
}
