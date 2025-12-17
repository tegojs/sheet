import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { cssPrefix } from '../../configs';
import { useActiveSheet, useSheetStore } from '../../store/useSheetStore';

interface SelectionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Selection border width constant (should match LESS @selection-border-width)
const SELECTION_BORDER_WIDTH = 2;

export const SelectionOverlay: React.FC = () => {
  const data = useActiveSheet();
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(
    null,
  );
  const [clipboardRect, setClipboardRect] = useState<SelectionRect | null>(
    null,
  );

  // 更新选区的函数
  const updateSelection = useCallback(() => {
    if (!data) return;

    // 获取选区矩形
    const rect = data.getSelectedRect();

    // 注意：不需要添加 cols.indexWidth 和 rows.height 偏移
    // 因为 SelectionOverlay 已经在 overlayer-content 内部，
    // overlayer-content 已经有偏移了
    if (
      'width' in rect &&
      'height' in rect &&
      rect.left !== undefined &&
      rect.top !== undefined &&
      rect.width !== undefined &&
      rect.height !== undefined
    ) {
      setSelectionRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }

    // 获取剪贴板矩形（如果有）
    const clipRect = data.getClipboardRect();
    if (
      'width' in clipRect &&
      'height' in clipRect &&
      clipRect.left !== undefined &&
      clipRect.top !== undefined &&
      clipRect.width !== undefined &&
      clipRect.height !== undefined &&
      clipRect.left >= 0 &&
      clipRect.top >= 0
    ) {
      setClipboardRect({
        left: clipRect.left,
        top: clipRect.top,
        width: clipRect.width,
        height: clipRect.height,
      });
    } else {
      setClipboardRect(null);
    }
  }, [data]);

  // 初始化时更新一次
  useEffect(() => {
    updateSelection();
  }, [updateSelection]);

  // 监听 store 变化并更新选区
  useEffect(() => {
    const unsubscribe = useSheetStore.subscribe(() => {
      updateSelection();
    });

    return unsubscribe;
  }, [updateSelection]);

  if (!selectionRect) {
    return null;
  }

  const selectorHeightBorderWidth = SELECTION_BORDER_WIDTH * 2 - 1;

  return (
    <div className={`${cssPrefix}-selector`}>
      {/* 主选区 - 使用 CSS 类定义的颜色 */}
      <div
        className={`${cssPrefix}-selector-area`}
        style={{
          left: selectionRect.left - 0.8,
          top: selectionRect.top - 0.8,
          width: selectionRect.width - selectorHeightBorderWidth + 0.8,
          height: selectionRect.height - selectorHeightBorderWidth + 0.8,
        }}
      >
        {/* 右下角拖拽点 - 使用 CSS 类定义的颜色 */}
        <div className={`${cssPrefix}-selector-corner`} />
      </div>

      {/* 剪贴板选区 - 使用 CSS 类定义的颜色 */}
      {clipboardRect && (
        <div
          className={`${cssPrefix}-selector-clipboard`}
          style={{
            left: clipboardRect.left,
            top: clipboardRect.top,
            width: clipboardRect.width - 5,
            height: clipboardRect.height - 5,
          }}
        />
      )}
    </div>
  );
};
