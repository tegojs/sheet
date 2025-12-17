import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { cssPrefix } from '../../configs';
import { useActiveSheet, useUpdateCount } from '../../store/useSheetStore';

interface ScrollbarProps {
  vertical?: boolean;
  onScroll?: (distance: number) => void;
}

export const Scrollbar: React.FC<ScrollbarProps> = ({
  vertical = false,
  onScroll,
}) => {
  const data = useActiveSheet();
  const updateCount = useUpdateCount(); // 触发重新渲染
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // 计算滚动条尺寸 - 滚动条始终显示
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateCount triggers recalculation on data changes
  const dimensions = useMemo(() => {
    if (!data) {
      return { scrollbarSize: 0, contentSize: 0 };
    }

    const { rows, cols } = data;
    const viewWidth = data.viewWidth();
    const viewHeight = data.viewHeight();

    if (vertical) {
      const scrollbarSize = Math.max(viewHeight - 9, 50);
      const contentViewHeight = viewHeight - rows.height;
      // 最大可滚动距离 = 总内容高度 - 可视内容高度
      const maxScroll = Math.max(0, rows.totalHeight() - contentViewHeight);
      // contentSize = scrollbarSize + maxScroll，这样滚动条最大滚动位置 = maxScroll
      const contentSize = scrollbarSize + maxScroll;

      return {
        scrollbarSize,
        contentSize,
      };
    }

    const scrollbarSize = Math.max(viewWidth - 9, 50);
    const contentViewWidth = viewWidth - cols.indexWidth;
    // 最大可滚动距离 = 总内容宽度 - 可视内容宽度
    const maxScroll = Math.max(0, cols.totalWidth() - contentViewWidth);
    // contentSize = scrollbarSize + maxScroll，这样滚动条最大滚动位置 = maxScroll
    const contentSize = scrollbarSize + maxScroll;

    return {
      scrollbarSize,
      contentSize,
    };
  }, [data, vertical, updateCount]);

  // 同步滚动位置 - 当 updateCount 变化时同步
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateCount triggers sync on data changes
  useEffect(() => {
    if (!data || !scrollRef.current) return;

    const { scroll } = data;
    if (!isScrollingRef.current) {
      if (vertical) {
        scrollRef.current.scrollTop = scroll.y;
      } else {
        scrollRef.current.scrollLeft = scroll.x;
      }
    }
  }, [data, vertical, updateCount]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const distance = vertical ? target.scrollTop : target.scrollLeft;

      isScrollingRef.current = true;
      if (onScroll) {
        onScroll(distance);
      }
      // 重置标志，允许后续的同步更新
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    },
    [vertical, onScroll],
  );

  if (!data) return null;

  return (
    <div
      ref={scrollRef}
      className={`${cssPrefix}-scrollbar ${vertical ? 'vertical' : 'horizontal'}`}
      onScroll={handleScroll}
      style={{
        position: 'absolute',
        bottom: vertical ? 8 : 0,
        right: vertical ? 0 : 8,
        backgroundColor: '#f4f5f8',
        opacity: 0.9,
        zIndex: 12,
        overflowX: vertical ? 'hidden' : 'scroll',
        overflowY: vertical ? 'scroll' : 'hidden',
        ...(vertical
          ? { width: 8, height: dimensions.scrollbarSize }
          : { height: 8, width: dimensions.scrollbarSize }),
      }}
    >
      <div
        ref={contentRef}
        style={{
          background: '#ddd',
          ...(vertical
            ? { width: 1, height: dimensions.contentSize }
            : { height: 1, width: dimensions.contentSize }),
        }}
      />
    </div>
  );
};
