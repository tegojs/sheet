import type React from 'react';
import { useEffect } from 'react';
import { cssPrefix } from '../configs';
import { useTableRender } from '../hooks/useTableRender';
import { useActiveSheet, useSheetStore } from '../store/useSheetStore';

export const CanvasTable: React.FC = () => {
  const data = useActiveSheet();
  const { canvasRef, render } = useTableRender(data);

  // 当数据变化时重新渲染
  useEffect(() => {
    if (data) {
      render();
    }
  }, [data, render]);

  // 监听 store 变化并重新渲染
  useEffect(() => {
    const unsubscribe = useSheetStore.subscribe(() => {
      // 任何 store 变化都重新渲染（包括选区变化）
      render();
    });

    return unsubscribe;
  }, [render]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`${cssPrefix}-table`}
      style={{
        verticalAlign: 'bottom',
      }}
    />
  );
};
