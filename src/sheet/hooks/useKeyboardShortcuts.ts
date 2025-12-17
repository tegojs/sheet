import { useEffect } from 'react';
import { useSheetStore } from '../store/useSheetStore';

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    copy,
    cut,
    paste,
    startEditing,
    stopEditing,
    setCellStyle,
    getActiveSheet,
  } = useSheetStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, key, keyCode } = e;
      const cmdKey = ctrlKey || metaKey;

      // 如果在输入框中，不处理快捷键
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (cmdKey) {
        switch (keyCode) {
          case 90: // Ctrl+Z - 撤销
            e.preventDefault();
            undo();
            break;
          case 89: // Ctrl+Y - 重做
            e.preventDefault();
            redo();
            break;
          case 67: // Ctrl+C - 复制
            // 让浏览器处理复制
            break;
          case 88: // Ctrl+X - 剪切
            e.preventDefault();
            cut();
            break;
          case 86: // Ctrl+V - 粘贴
            // 让浏览器处理粘贴
            break;
          case 66: // Ctrl+B - 加粗
            e.preventDefault();
            setCellStyle('font-bold', true);
            break;
          case 73: // Ctrl+I - 斜体
            e.preventDefault();
            setCellStyle('font-italic', true);
            break;
          case 85: // Ctrl+U - 下划线
            e.preventDefault();
            setCellStyle('underline', true);
            break;
          case 37: // Ctrl+Left - 移动到行首
            e.preventDefault();
            // TODO: 实现移动到行首
            break;
          case 38: // Ctrl+Up - 移动到列首
            e.preventDefault();
            // TODO: 实现移动到列首
            break;
          case 39: // Ctrl+Right - 移动到行尾
            e.preventDefault();
            // TODO: 实现移动到行尾
            break;
          case 40: // Ctrl+Down - 移动到列尾
            e.preventDefault();
            // TODO: 实现移动到列尾
            break;
          default:
            break;
        }
      } else {
        // 非 Ctrl 键
        switch (keyCode) {
          case 13: // Enter - 开始编辑或移动到下一行
            e.preventDefault();
            if (shiftKey) {
              // Shift+Enter - 向上移动
              // TODO: 实现向上移动
            } else {
              // Enter - 向下移动
              // TODO: 实现向下移动
            }
            break;
          case 9: // Tab - 移动到下一列
            e.preventDefault();
            if (shiftKey) {
              // Shift+Tab - 向左移动
              // TODO: 实现向左移动
            } else {
              // Tab - 向右移动
              // TODO: 实现向右移动
            }
            break;
          case 27: // Esc - 取消编辑
            e.preventDefault();
            stopEditing();
            break;
          case 8: // Backspace - 删除单元格内容
            e.preventDefault();
            const data = getActiveSheet();
            if (data) {
              data.deleteCell('text');
            }
            break;
          case 46: // Delete - 删除单元格内容
            e.preventDefault();
            const activeData = getActiveSheet();
            if (activeData) {
              activeData.deleteCell('text');
            }
            break;
          case 113: // F2 - 开始编辑
            e.preventDefault();
            startEditing();
            break;
          case 37: // Left
          case 38: // Up
          case 39: // Right
          case 40: // Down
            e.preventDefault();
            // TODO: 实现方向键移动
            break;
          default:
            // 字母数字键 - 开始编辑
            if (
              (keyCode >= 65 && keyCode <= 90) || // A-Z
              (keyCode >= 48 && keyCode <= 57) || // 0-9
              (keyCode >= 96 && keyCode <= 105) || // 数字键盘 0-9
              key === '='
            ) {
              startEditing();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    undo,
    redo,
    copy,
    cut,
    paste,
    startEditing,
    stopEditing,
    setCellStyle,
    getActiveSheet,
  ]);
}
