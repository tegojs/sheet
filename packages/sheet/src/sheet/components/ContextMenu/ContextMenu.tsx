import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { cssPrefix } from '../../configs';
import { tf } from '../../locale/locale';
import { useActiveSheet, useSheetStore } from '../../store/useSheetStore';

interface MenuItem {
  key: string;
  title: () => string;
  label?: string;
}

// 检测是否是 Mac 系统
const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

// 格式化快捷键标签，Mac 上用 ⌘ 替换 Ctrl，用 ⌥ 替换 Alt
function formatShortcut(shortcut: string): string {
  if (isMac) {
    return shortcut
      .replace(/Ctrl\+/g, '⌘')
      .replace(/Alt\+/g, '⌥')
      .replace(/Shift\+/g, '⇧');
  }
  return shortcut;
}

const menuItems: MenuItem[] = [
  { key: 'copy', title: tf('contextmenu.copy'), label: 'Ctrl+C' },
  { key: 'cut', title: tf('contextmenu.cut'), label: 'Ctrl+X' },
  { key: 'paste', title: tf('contextmenu.paste'), label: 'Ctrl+V' },
  {
    key: 'paste-value',
    title: tf('contextmenu.pasteValue'),
    label: 'Ctrl+Shift+V',
  },
  {
    key: 'paste-format',
    title: tf('contextmenu.pasteFormat'),
    label: 'Ctrl+Alt+V',
  },
  { key: 'divider-1', title: () => '' },
  { key: 'insert-row', title: tf('contextmenu.insertRow') },
  { key: 'insert-column', title: tf('contextmenu.insertColumn') },
  { key: 'divider-2', title: () => '' },
  { key: 'delete-row', title: tf('contextmenu.deleteRow') },
  { key: 'delete-column', title: tf('contextmenu.deleteColumn') },
  { key: 'delete-cell-text', title: tf('contextmenu.deleteCellText') },
  { key: 'hide', title: tf('contextmenu.hide') },
  { key: 'divider-3', title: () => '' },
  { key: 'validation', title: tf('contextmenu.validation') },
];

export const ContextMenu: React.FC = () => {
  const data = useActiveSheet();
  const {
    showContextMenu,
    contextMenuPosition,
    closeContextMenu,
    copy,
    cut,
    paste,
    triggerChange,
  } = useSheetStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu, closeContextMenu]);

  const handleItemClick = (key: string) => {
    if (!data) return;

    switch (key) {
      case 'copy':
        copy();
        triggerChange(); // 触发更新以显示复制指示器
        break;
      case 'cut':
        cut();
        triggerChange(); // 触发更新以显示剪切指示器
        break;
      case 'paste':
        paste('all');
        break;
      case 'paste-value':
        paste('text');
        break;
      case 'paste-format':
        paste('format');
        break;
      case 'insert-row':
        data.insert('row');
        break;
      case 'insert-column':
        data.insert('column');
        break;
      case 'delete-row':
        data.delete('row');
        break;
      case 'delete-column':
        data.delete('column');
        break;
      case 'delete-cell-text':
        data.deleteCell('text');
        break;
      case 'hide':
        data.hideRowsOrCols();
        break;
      case 'validation':
        // TODO: 打开验证对话框
        break;
      default:
        break;
    }

    closeContextMenu();
  };

  if (!showContextMenu || !contextMenuPosition) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={`${cssPrefix}-contextmenu`}
      style={{
        position: 'absolute',
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
        zIndex: 100,
        width: '260px',
        boxShadow: '1px 2px 5px 2px rgba(51, 51, 51, 0.15)',
        background: '#fff',
        overflow: 'auto',
      }}
    >
      {menuItems.map((item) => {
        if (item.key.startsWith('divider')) {
          return (
            <div
              key={item.key}
              className={`${cssPrefix}-item divider`}
              style={{
                height: 0,
                padding: 0,
                margin: '5px 0',
                border: 'none',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              }}
            />
          );
        }

        return (
          <div
            key={item.key}
            className={`${cssPrefix}-item`}
            role="menuitem"
            tabIndex={0}
            onClick={() => handleItemClick(item.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(item.key);
              }
            }}
            onMouseEnter={() => setHoveredItem(item.key)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              userSelect: 'none',
              background:
                hoveredItem === item.key
                  ? 'rgba(0, 0, 0, 0.05)'
                  : 'transparent',
              border: '1px solid transparent',
              outline: 'none',
              height: 26,
              color: 'rgba(0, 0, 0, 0.9)',
              lineHeight: '26px',
              listStyle: 'none',
              padding: '2px 10px',
              cursor: 'default',
              textAlign: 'left',
              overflow: 'hidden',
            }}
          >
            {item.title()}
            {item.label && (
              <div
                className="label"
                style={{
                  float: 'right',
                  opacity: 0.65,
                  fontSize: '1em',
                }}
              >
                {formatShortcut(item.label)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
