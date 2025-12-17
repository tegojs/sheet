import type React from 'react';
import { useEffect, useRef } from 'react';
import { Bottombar } from './components/Bottombar/Bottombar';
import { CanvasTable } from './components/CanvasTable';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { CellEditor } from './components/Editor/CellEditor';
import { Scrollbar } from './components/Scrollbar/Scrollbar';
import { SelectionOverlay } from './components/Selection/SelectionOverlay';
import { Toolbar } from './components/Toolbar/Toolbar';
import { cssPrefix } from './configs';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSheetStore } from './store/useSheetStore';
import './sheet.less';
import svg from './assets/sprite.svg';
import type { Options } from './index';

interface ReactSheetProps {
  options?: Options;
  onChange?: (data: unknown) => void;
}

const ReactSheet: React.FC<ReactSheetProps> = ({ options = {}, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loadData, addChangeListener, removeChangeListener, getActiveSheet } =
    useSheetStore();

  // 启用键盘快捷键
  useKeyboardShortcuts();

  // 初始化图标背景
  useEffect(() => {
    const elements = document.querySelectorAll(`.${cssPrefix}-icon-img`);
    for (const element of elements) {
      (element as HTMLElement).style.backgroundImage = `url('${svg}')`;
    }
  }, []);

  // 注册 onChange 监听器
  useEffect(() => {
    if (onChange) {
      addChangeListener(onChange);
      return () => {
        removeChangeListener(onChange);
      };
    }
  }, [onChange, addChangeListener, removeChangeListener]);

  // 处理滚动
  const handleVerticalScroll = (distance: number) => {
    const data = getActiveSheet();
    if (data) {
      data.scrolly(distance, () => {
        // 滚动后重新渲染
      });
    }
  };

  const handleHorizontalScroll = (distance: number) => {
    const data = getActiveSheet();
    if (data) {
      data.scrollx(distance, () => {
        // 滚动后重新渲染
      });
    }
  };

  const showToolbar = options.showToolbar !== false;
  const showBottomBar = options.showBottomBar !== false;

  return (
    <div
      ref={containerRef}
      className={cssPrefix}
      onContextMenu={(e) => e.preventDefault()}
    >
      {showToolbar && <Toolbar />}

      <div
        className={`${cssPrefix}-sheet`}
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CanvasTable />

        <div
          className={`${cssPrefix}-overlayer`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div
            className={`${cssPrefix}-overlayer-content`}
            style={{
              position: 'absolute',
              overflow: 'hidden',
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
            }}
          >
            <CellEditor />
            <SelectionOverlay />
          </div>
        </div>

        <Scrollbar vertical onScroll={handleVerticalScroll} />
        <Scrollbar onScroll={handleHorizontalScroll} />

        <ContextMenu />
      </div>

      {showBottomBar && <Bottombar />}
    </div>
  );
};

export default ReactSheet;

// 导出 API 方法供外部使用
export const createSheet = (container: HTMLElement, options?: Options) => {
  // TODO: 实现 React 渲染到容器
  return {
    loadData: (data: unknown) => useSheetStore.getState().loadData(data),
    getData: () => useSheetStore.getState().getData(),
    on: (event: string, callback: (data: unknown) => void) => {
      if (event === 'change') {
        useSheetStore.getState().addChangeListener(callback);
      }
    },
  };
};
