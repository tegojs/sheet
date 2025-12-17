import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cssPrefix } from '../../configs';
import { useActiveSheet, useSheetStore } from '../../store/useSheetStore';

interface OverlayerInteractionProps {
  children: React.ReactNode;
}

export const OverlayerInteraction: React.FC<OverlayerInteractionProps> = ({
  children,
}) => {
  const data = useActiveSheet();
  const {
    setSelection,
    setSelectionEnd,
    startEditing,
    stopEditing,
    isEditing,
    openContextMenu,
  } = useSheetStore();
  const overlayerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    contentLeft: 0,
    contentTop: 0,
    contentWidth: 0,
    contentHeight: 0,
  });

  const isDraggingRef = useRef(false);
  const startCellRef = useRef<{ ri: number; ci: number } | null>(null);

  // 设置 overlayer 的尺寸和偏移
  useEffect(() => {
    if (data) {
      const { rows, cols } = data;
      const width = data.viewWidth();
      const height = data.viewHeight();
      const contentWidth = width - cols.indexWidth;
      const contentHeight = height - rows.height;
      setDimensions({
        width,
        height,
        contentLeft: cols.indexWidth,
        contentTop: rows.height,
        contentWidth,
        contentHeight,
      });
    }
  }, [data]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!data || !overlayerRef.current) return;

      const { buttons, detail, shiftKey, clientX, clientY } = event;

      // 计算相对于 overlayer 元素的坐标
      const rect = overlayerRef.current.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      // 获取点击的单元格
      const cellRect = data.getCellRectByXY(offsetX, offsetY);
      const { ri, ci } = cellRect;

      // 记录起始单元格
      startCellRef.current = { ri, ci };
      isDraggingRef.current = false;

      // 处理右键
      if (buttons === 2) {
        // 如果右键点击的单元格不在当前选区内，则设置新选区
        if (!data.xyInSelectedRect(offsetX, offsetY)) {
          setSelection(ri, ci, false);
        }
        return;
      }

      // 处理双击
      if (detail === 2) {
        startEditing();
        return;
      }

      // 如果正在编辑，先停止编辑
      if (isEditing) {
        stopEditing();
      }

      // 设置选区
      if (shiftKey) {
        // Shift+点击 - 扩展选区
        setSelectionEnd(ri, ci);
      } else {
        // 普通点击 - 新选区
        setSelection(ri, ci, false);
      }
    },
    [data, setSelection, setSelectionEnd, startEditing, stopEditing, isEditing],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!data || !overlayerRef.current || event.buttons === 0) return;

      const { clientX, clientY } = event;

      // 计算相对于 overlayer 元素的坐标
      const rect = overlayerRef.current.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      // 如果鼠标按下并移动，则开始拖拽选择
      if (event.buttons === 1 && startCellRef.current) {
        isDraggingRef.current = true;

        const cellRect = data.getCellRectByXY(offsetX, offsetY);
        const { ri, ci } = cellRect;

        // 扩展选区
        setSelectionEnd(ri, ci);
      }
    },
    [data, setSelectionEnd],
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    startCellRef.current = null;
  }, []);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!data || !overlayerRef.current) return;

      const { clientX, clientY } = event;

      // 计算相对于 overlayer 元素的坐标
      const rect = overlayerRef.current.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      // 打开右键菜单 - 使用相对于 overlayer 的坐标
      openContextMenu(offsetX, offsetY);
    },
    [data, openContextMenu],
  );

  // 使用原生事件监听器处理滚轮，设置 { passive: false } 以支持 preventDefault
  useEffect(() => {
    const element = overlayerRef.current;
    if (!element || !data) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const { deltaY, deltaX } = event;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // 垂直滚动 - 使用像素值
        const newY = data.scroll.y + deltaY;
        data.scrolly(Math.max(0, newY), () => {
          useSheetStore.getState().triggerChange();
        });
      } else {
        // 水平滚动 - 使用像素值
        const newX = data.scroll.x + deltaX;
        data.scrollx(Math.max(0, newX), () => {
          useSheetStore.getState().triggerChange();
        });
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, [data]);

  if (!data) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: spreadsheet grid has no semantic HTML equivalent
    <div
      ref={overlayerRef}
      className={`${cssPrefix}-overlayer`}
      role="grid"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: dimensions.width > 0 ? `${dimensions.width}px` : '100%',
        height: dimensions.height > 0 ? `${dimensions.height}px` : '100%',
        zIndex: 10,
      }}
    >
      <div
        className={`${cssPrefix}-overlayer-content`}
        style={{
          position: 'absolute',
          left: `${dimensions.contentLeft}px`,
          top: `${dimensions.contentTop}px`,
          width:
            dimensions.contentWidth > 0
              ? `${dimensions.contentWidth}px`
              : '100%',
          height:
            dimensions.contentHeight > 0
              ? `${dimensions.contentHeight}px`
              : '100%',
          overflow: 'hidden',
          // 不设置 pointerEvents: 'none'，让子元素可以正常接收事件
        }}
      >
        {children}
      </div>
    </div>
  );
};
