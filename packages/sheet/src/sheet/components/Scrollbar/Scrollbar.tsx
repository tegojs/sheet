import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cssPrefix } from '../../configs';
import { useActiveSheet, useSheetStore } from '../../store/useSheetStore';

interface ScrollbarProps {
  vertical?: boolean;
  onScroll?: (distance: number) => void;
}

export const Scrollbar: React.FC<ScrollbarProps> = ({
  vertical = false,
  onScroll,
}) => {
  const data = useActiveSheet();
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const [dimensions, setDimensions] = useState({
    scrollbarSize: 0,
    contentSize: 0,
    visible: false,
  });

  // 计算滚动条尺寸
  useEffect(() => {
    if (!data) return;

    const updateDimensions = () => {
      const { rows, cols } = data;
      const viewWidth = data.viewWidth();
      const viewHeight = data.viewHeight();

      if (vertical) {
        const height = viewHeight - 1;
        const exceptRowTotalHeight = data.exceptRowTotalHeight(0, -1);
        const contentDistance = rows.totalHeight() - exceptRowTotalHeight;

        setDimensions({
          scrollbarSize: height - 15,
          contentSize: contentDistance,
          visible: contentDistance > height,
        });
      } else {
        const width = viewWidth - 1;
        const contentDistance = cols.totalWidth();

        setDimensions({
          scrollbarSize: width - 15,
          contentSize: contentDistance,
          visible: contentDistance > width,
        });
      }
    };

    // 初始计算
    updateDimensions();

    // 订阅 store 变化
    const unsubscribe = useSheetStore.subscribe(() => {
      updateDimensions();
    });

    return unsubscribe;
  }, [data, vertical]);

  // 同步滚动位置
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
  }, [data, vertical, dimensions.visible]);

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

  if (!data || !dimensions.visible) return null;

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
          ? { height: dimensions.scrollbarSize }
          : { width: dimensions.scrollbarSize }),
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
