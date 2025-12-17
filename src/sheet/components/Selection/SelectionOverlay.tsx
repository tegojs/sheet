import type React from 'react';
import { useEffect, useState } from 'react';
import { cssPrefix } from '../../configs';
import { useActiveSheet, useSelection } from '../../store/useSheetStore';

interface SelectionRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const SelectionOverlay: React.FC = () => {
  const data = useActiveSheet();
  const selection = useSelection();
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(
    null,
  );
  const [clipboardRect, setClipboardRect] = useState<SelectionRect | null>(
    null,
  );

  useEffect(() => {
    if (!data) return;

    // 获取选区矩形
    const rect = data.getSelectedRect();
    const { rows, cols } = data;

    setSelectionRect({
      left: rect.left + cols.indexWidth,
      top: rect.top + rows.height,
      width: rect.width,
      height: rect.height,
    });

    // 获取剪贴板矩形（如果有）
    const clipRect = data.getClipboardRect();
    if (clipRect.left >= 0 && clipRect.top >= 0) {
      setClipboardRect({
        left: clipRect.left + cols.indexWidth,
        top: clipRect.top + rows.height,
        width: clipRect.width,
        height: clipRect.height,
      });
    } else {
      setClipboardRect(null);
    }
  }, [data, selection]);

  if (!selectionRect) {
    return null;
  }

  const selectorHeightBorderWidth = 2 * 2 - 1;

  return (
    <div
      className={`${cssPrefix}-selector`}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* 主选区 */}
      <div
        className={`${cssPrefix}-selector-area`}
        style={{
          position: 'absolute',
          left: selectionRect.left - 0.8,
          top: selectionRect.top - 0.8,
          width: selectionRect.width - selectorHeightBorderWidth + 0.8,
          height: selectionRect.height - selectorHeightBorderWidth + 0.8,
          border: '2px solid rgb(75, 137, 255)',
          background: 'rgba(75, 137, 255, 0.1)',
          zIndex: 5,
        }}
      >
        {/* 右下角拖拽点 */}
        <div
          className={`${cssPrefix}-selector-corner`}
          style={{
            position: 'absolute',
            cursor: 'crosshair',
            fontSize: 0,
            height: 5,
            width: 5,
            right: -5,
            bottom: -5,
            border: '2px solid rgb(255, 255, 255)',
            background: 'rgb(75, 137, 255)',
            pointerEvents: 'auto',
          }}
        />
      </div>

      {/* 剪贴板选区 */}
      {clipboardRect && (
        <div
          className={`${cssPrefix}-selector-clipboard`}
          style={{
            position: 'absolute',
            left: clipboardRect.left,
            top: clipboardRect.top,
            width: clipboardRect.width - 5,
            height: clipboardRect.height - 5,
            border: '2px dashed rgb(75, 137, 255)',
            background: 'transparent',
            zIndex: 100,
          }}
        />
      )}
    </div>
  );
};
