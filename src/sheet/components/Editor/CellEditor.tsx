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
  const { setCellText, stopEditing, editingText, setEditingText } =
    useSheetStore();

  const [text, setText] = useState('');
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 记录正在编辑的单元格坐标
  const editingCellRef = useRef<{ ri: number; ci: number } | null>(null);
  // 记录 blur 超时，用于在开始新编辑时取消
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 记录上一次的 isEditing 状态，用于检测编辑开始
  const wasEditingRef = useRef(false);
  // 使用 ref 记录初始编辑文本，避免 editingText 变化导致 effect 重新运行
  const initialEditingTextRef = useRef<string>('');

  // 当开始编辑时，获取单元格内容和位置
  useEffect(() => {
    // 只在从非编辑状态进入编辑状态时初始化
    const justStartedEditing = isEditing && !wasEditingRef.current;
    wasEditingRef.current = isEditing;

    if (isEditing && data) {
      // 取消任何待处理的 blur 超时，防止 Chrome 中的竞态条件
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }

      const { ri, ci } = data.selector;
      // 保存正在编辑的单元格坐标
      editingCellRef.current = { ri, ci };

      // 只在刚开始编辑时设置初始文本
      if (justStartedEditing) {
        // 捕获当前的 editingText 到 ref，后续 editingText 变化不会重置文本
        initialEditingTextRef.current = editingText;
        setText(editingText);

        // 聚焦到 textarea - 必须同步执行以确保后续按键能被 textarea 捕获
        // 使用 setTimeout(0) 等待 React 完成 DOM 更新
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            // 光标放在末尾
            const cursorPos = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(cursorPos, cursorPos);
          }
        }, 0);
      }

      // 获取选中单元格的位置
      const rect = data.getSelectedRect();

      // 注意：不需要添加 cols.indexWidth 和 rows.height 偏移
      // 因为 CellEditor 已经在 overlayer-content 内部，
      // overlayer-content 已经有偏移了
      setPosition({
        left: rect.left ?? 0,
        top: rect.top ?? 0,
        width: rect.width ?? 0,
        height: rect.height ?? 0,
      });
    } else {
      setPosition(null);
      editingCellRef.current = null;
    }

    // 清理函数：组件卸载或依赖变化时取消待处理的超时
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };
    // editingText 在 deps 中是为了在开始编辑时获取初始值
    // 但 justStartedEditing 保证了只有在首次编辑时才会 setText
  }, [isEditing, data, editingText]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText);
      setEditingText(newText);

      // 使用保存的编辑单元格坐标，实时更新单元格内容（用于预览）
      if (editingCellRef.current) {
        const { ri, ci } = editingCellRef.current;
        setCellText(ri, ci, newText, 'input');
      }
    },
    [setCellText, setEditingText],
  );

  const handleFinish = useCallback(() => {
    setEditingText(text);
    stopEditing();
    if (onFinish) {
      onFinish();
    }
  }, [text, setEditingText, stopEditing, onFinish]);

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
          const newText = `${text.substring(0, start)}\n${text.substring(end)}`;
          setText(newText);
          setEditingText(newText);

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
    [text, handleFinish, stopEditing, setEditingText],
  );

  const handleBlur = useCallback(() => {
    // 延迟处理，避免与其他点击事件冲突
    // 保存超时 ID 以便在开始新编辑时取消
    blurTimeoutRef.current = setTimeout(() => {
      blurTimeoutRef.current = null;
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
