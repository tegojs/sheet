import type React from 'react';
import { useEffect, useRef } from 'react';
import { Bottombar } from './components/BottomBar/Bottombar';
import { CanvasTable } from './components/CanvasTable';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { CellEditor } from './components/Editor/CellEditor';
import { OverlayerInteraction } from './components/Overlayer/OverlayerInteraction';
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
  const initializdRef = useRef(false);
  const { addChangeListener, removeChangeListener, getActiveSheet } =
    useSheetStore();

  // 启用键盘快捷键
  useKeyboardShortcuts();

  // 初始化 store（仅一次）
  useEffect(() => {
    if (!initializdRef.current) {
      initializdRef.current = true;

      // 根据 options 更新 store 中的 sheet 设置
      const data = getActiveSheet();
      if (data && options) {
        // 更新 settings
        Object.assign(data.settings, options);
      }
    }
  }, [options, getActiveSheet]);

  // 初始化图标背景
  useEffect(() => {
    const updateIconBackgrounds = () => {
      const elements = document.querySelectorAll(`.${cssPrefix}-icon-img`);
      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement;
        if (
          !htmlElement.style.backgroundImage ||
          htmlElement.style.backgroundImage === 'none'
        ) {
          htmlElement.style.backgroundImage = `url('${svg}')`;
        }
      }
    };

    // 立即执行一次
    updateIconBackgrounds();

    // 使用 MutationObserver 监听 DOM 变化，确保动态添加的图标也能设置背景
    const observer = new MutationObserver(() => {
      updateIconBackgrounds();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
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
        // 滚动后触发重新渲染 - 使用 setState 强制触发 zustand 订阅者
        useSheetStore.setState({});
      });
    }
  };

  const handleHorizontalScroll = (distance: number) => {
    const data = getActiveSheet();
    if (data) {
      data.scrollx(distance, () => {
        // 滚动后触发重新渲染 - 使用 setState 强制触发 zustand 订阅者
        useSheetStore.setState({});
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

      <div className={`${cssPrefix}-sheet`}>
        <CanvasTable />

        <OverlayerInteraction>
          <CellEditor />
          <SelectionOverlay />
        </OverlayerInteraction>

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSheet = (_container: HTMLElement, _options?: Options) => {
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
