import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { cssPrefix } from '../configs';
import { useTableRender } from '../hooks/useTableRender';
import { useActiveSheet, useSheetStore } from '../store/useSheetStore';

interface CanvasTableProps {
  onCellClick?: (ri: number, ci: number, event: React.MouseEvent) => void;
  onCellDoubleClick?: (ri: number, ci: number) => void;
  onScroll?: (x: number, y: number) => void;
}

export const CanvasTable: React.FC<CanvasTableProps> = ({
  onCellClick,
  onCellDoubleClick,
  onScroll,
}) => {
  const data = useActiveSheet();
  const { canvasRef, render } = useTableRender(data);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  // 当数据变化时重新渲染
  useEffect(() => {
    if (data) {
      render();
    }
  }, [data, render]);

  // 监听 store 变化并重新渲染
  useEffect(() => {
    const unsubscribe = useSheetStore.subscribe((state, prevState) => {
      // 当活动 sheet 变化或数据变化时重新渲染
      if (state.activeSheetIndex !== prevState.activeSheetIndex) {
        render();
      }
    });

    return unsubscribe;
  }, [render]);

  // 处理鼠标点击事件
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!data || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const cellRect = data.getCellRectByXY(x, y);
      const { ri, ci } = cellRect;

      clickCountRef.current += 1;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          // 单击
          if (onCellClick) {
            onCellClick(ri, ci, event);
          }
        } else if (clickCountRef.current === 2) {
          // 双击
          if (onCellDoubleClick) {
            onCellDoubleClick(ri, ci);
          }
        }
        clickCountRef.current = 0;
      }, 250);
    },
    [data, canvasRef, onCellClick, onCellDoubleClick],
  );

  // 处理鼠标移动事件（用于显示调整大小的光标等）
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!data || !canvasRef.current) return;

      // 这里可以添加鼠标悬停效果的逻辑
      // 例如：显示行列调整大小的光标
    },
    [data, canvasRef],
  );

  // 处理右键菜单
  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault();

      if (!data || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const cellRect = data.getCellRectByXY(x, y);
      const { ri, ci } = cellRect;

      // 设置选区
      const setSelection = useSheetStore.getState().setSelection;
      setSelection(ri, ci, false);

      // 打开右键菜单
      const openContextMenu = useSheetStore.getState().openContextMenu;
      openContextMenu(event.clientX, event.clientY);
    },
    [data, canvasRef],
  );

  // 处理滚轮事件
  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLCanvasElement>) => {
      event.preventDefault();

      if (!data) return;

      const { deltaY, deltaX } = event;

      // 这里需要调用 data 的滚动方法
      // 暂时简化处理
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // 垂直滚动
        if (onScroll) {
          onScroll(0, deltaY);
        }
      } else {
        // 水平滚动
        if (onScroll) {
          onScroll(deltaX, 0);
        }
      }

      render();
    },
    [data, onScroll, render],
  );

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`${cssPrefix}-table`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
      style={{
        verticalAlign: 'bottom',
        cursor: 'default',
      }}
    />
  );
};
