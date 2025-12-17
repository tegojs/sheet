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

  // 计算滚动条尺寸 - 使用 useMemo 在每次渲染时重新计算
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateCount triggers recalculation on data changes
  const dimensions = useMemo(() => {
    if (!data) {
      return { scrollbarSize: 0, contentSize: 0, visible: false };
    }

    const { rows, cols } = data;
    const viewWidth = data.viewWidth();
    const viewHeight = data.viewHeight();

    if (vertical) {
      const height = viewHeight - 1;
      const exceptRowTotalHeight = data.exceptRowTotalHeight(0, -1);
      const contentDistance = rows.totalHeight() - exceptRowTotalHeight;

      return {
        scrollbarSize: height - 15,
        contentSize: contentDistance,
        visible: contentDistance > height,
      };
    }

    const width = viewWidth - 1;
    const contentDistance = cols.totalWidth();

    return {
      scrollbarSize: width - 15,
      contentSize: contentDistance,
      visible: contentDistance > width,
    };
  }, [data, vertical, updateCount]);

  // 同步滚动位置 - 当 updateCount 变化时同步
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateCount triggers sync on data changes
  useEffect(() => {
    if (!data || !scrollRef.current || !dimensions.visible) return;

    const { scroll } = data;
    if (!isScrollingRef.current) {
      if (vertical) {
        scrollRef.current.scrollTop = scroll.y;
      } else {
        scrollRef.current.scrollLeft = scroll.x;
      }
    }
  }, [data, vertical, dimensions.visible, updateCount]);

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
        bottom: vertical ? 15 : 0,
        right: vertical ? 0 : 15,
        backgroundColor: '#f4f5f8',
        opacity: 0.9,
        zIndex: 12,
        overflowX: vertical ? 'hidden' : 'scroll',
        overflowY: vertical ? 'scroll' : 'hidden',
        ...(vertical
          ? { width: 15, height: dimensions.scrollbarSize }
          : { height: 15, width: dimensions.scrollbarSize }),
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
