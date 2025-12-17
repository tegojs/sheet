import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { cssPrefix } from '../../configs';
import { useActiveSheet } from '../../store/useSheetStore';

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

  // 设置滚动条尺寸
  useEffect(() => {
    if (!data || !scrollRef.current || !contentRef.current) return;

    const { rows, cols } = data;
    const viewWidth = data.viewWidth();
    const viewHeight = data.viewHeight();

    if (vertical) {
      const height = viewHeight - 1;
      const exceptRowTotalHeight = data.exceptRowTotalHeight(0, -1);
      const contentDistance = rows.totalHeight() - exceptRowTotalHeight;

      if (contentDistance > height) {
        scrollRef.current.style.height = `${height - 15}px`;
        scrollRef.current.style.display = 'block';
        contentRef.current.style.width = '1px';
        contentRef.current.style.height = `${contentDistance}px`;
      } else {
        scrollRef.current.style.display = 'none';
      }
    } else {
      const width = viewWidth - 1;
      const contentDistance = cols.totalWidth();

      if (contentDistance > width) {
        scrollRef.current.style.width = `${width - 15}px`;
        scrollRef.current.style.display = 'block';
        contentRef.current.style.height = '1px';
        contentRef.current.style.width = `${contentDistance}px`;
      } else {
        scrollRef.current.style.display = 'none';
      }
    }
  }, [data, vertical]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const distance = vertical ? target.scrollTop : target.scrollLeft;

      if (onScroll) {
        onScroll(distance);
      }
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
        overflow: vertical ? 'scroll' : 'scroll',
        overflowX: vertical ? 'hidden' : 'scroll',
        overflowY: vertical ? 'scroll' : 'hidden',
      }}
    >
      <div ref={contentRef} style={{ background: '#ddd' }} />
    </div>
  );
};
