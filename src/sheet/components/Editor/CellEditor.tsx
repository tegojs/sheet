import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cssPrefix } from '../../configs';
import {
  useActiveSheet,
  useIsEditing,
  useSheetStore,
} from '../../store/useSheetStore';

interface CellEditorProps {
  onFinish?: () => void;
}

export const CellEditor: React.FC<CellEditorProps> = ({ onFinish }) => {
  const data = useActiveSheet();
  const isEditing = useIsEditing();
  const { setCellText, stopEditing } = useSheetStore();

  const [text, setText] = useState('');
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 当开始编辑时，获取单元格内容和位置
  useEffect(() => {
    if (isEditing && data) {
      const cell = data.getSelectedCell();
      const cellText = cell?.text || '';
      setText(cellText);

      // 获取选中单元格的位置
      const rect = data.getSelectedRect();
      const { rows, cols } = data;

      setPosition({
        left: rect.left + cols.indexWidth,
        top: rect.top + rows.height,
        width: rect.width,
        height: rect.height,
      });

      // 聚焦到 textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            cellText.length,
            cellText.length,
          );
        }
      }, 0);
    } else {
      setPosition(null);
    }
  }, [isEditing, data]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText);

      if (data) {
        const { ri, ci } = data.selector;
        setCellText(ri, ci, newText, 'input');
      }
    },
    [data, setCellText],
  );

  const handleFinish = useCallback(() => {
    if (data) {
      const { ri, ci } = data.selector;
      setCellText(ri, ci, text, 'finished');
    }
    stopEditing();
    if (onFinish) {
      onFinish();
    }
  }, [data, text, setCellText, stopEditing, onFinish]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.altKey) {
        e.preventDefault();
        handleFinish();
      } else if (e.key === 'Enter' && e.altKey) {
        // Alt+Enter 插入换行
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const newText = text.substring(0, start) + '\n' + text.substring(end);
          setText(newText);

          setTimeout(() => {
            textarea.setSelectionRange(start + 1, start + 1);
          }, 0);
        }
      } else if (e.key === 'Escape') {
        stopEditing();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleFinish();
        // TODO: 移动到下一个单元格
      }
    },
    [text, handleFinish, stopEditing],
  );

  const handleBlur = useCallback(() => {
    // 延迟处理，避免与其他点击事件冲突
    setTimeout(() => {
      if (isEditing) {
        handleFinish();
      }
    }, 100);
  }, [isEditing, handleFinish]);

  if (!isEditing || !position) {
    return null;
  }

  return (
    <div
      className={`${cssPrefix}-editor`}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <div
        className={`${cssPrefix}-editor-area`}
        style={{
          position: 'absolute',
          left: position.left - 0.8,
          top: position.top - 0.8,
          border: '2px solid rgb(75, 137, 255)',
          pointerEvents: 'auto',
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            width: position.width - 9 + 0.8,
            height: position.height - 3 + 0.8,
            border: 'none',
            padding: '0 3px',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            font: '400 13px Arial, "Lato", "Source Sans Pro", Roboto, Helvetica, sans-serif',
            lineHeight: '22px',
            margin: 0,
            boxSizing: 'content-box',
          }}
        />
      </div>
    </div>
  );
};
