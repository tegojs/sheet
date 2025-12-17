import { useCallback, useEffect, useRef } from 'react';
import { renderCell } from '../canvas/cellRenderer';
import { Draw, DrawBox, thinLineWidth } from '../canvas/draw';
import { stringAt } from '../core/alphabet';
import type { CellRange } from '../core/cellRange';
import type DataProxy from '../core/dataProxy';
import { RenderConfig } from '../core/renderConfig';
import type { MergeInfo } from '../types';

const tableFixedHeaderCleanStyle = {
  fillStyle: RenderConfig.header.backgroundColor,
};
const tableGridStyle = {
  fillStyle: RenderConfig.grid.backgroundColor,
  lineWidth: thinLineWidth(),
  strokeStyle: RenderConfig.grid.lineColor,
};

function tableFixedHeaderStyle(): {
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  font: string;
  fillStyle: string;
  lineWidth: number;
  strokeStyle: string;
} {
  return {
    textAlign: 'center' as CanvasTextAlign,
    textBaseline: 'middle' as CanvasTextBaseline,
    font: RenderConfig.font.getHeaderFont(window.devicePixelRatio || 1),
    fillStyle: RenderConfig.header.textColor,
    lineWidth: thinLineWidth(),
    strokeStyle: RenderConfig.grid.lineColor,
  };
}

export function useTableRender(data: DataProxy | null) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<Draw | null>(null);

  // 初始化 Draw 实例
  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const width = data.viewWidth();
    const height = data.viewHeight();

    drawRef.current = new Draw(canvas, width, height);

    return () => {
      drawRef.current = null;
    };
  }, [data]);

  // 渲染固定表头
  const renderFixedHeaders = useCallback(
    (
      type: 'all' | 'left' | 'top',
      viewRange: CellRange,
      w: number,
      h: number,
      tx: number,
      ty: number,
    ) => {
      if (!drawRef.current || !data) return;

      const draw = drawRef.current;
      const sumHeight = viewRange.h;
      const sumWidth = viewRange.w;
      const nty = ty + h;
      const ntx = tx + w;

      draw.save();
      draw.attr(tableFixedHeaderCleanStyle);

      if (type === 'all' || type === 'left') {
        draw.fillRect(0, nty, w, sumHeight);
      }
      if (type === 'all' || type === 'top') {
        draw.fillRect(ntx, 0, sumWidth, h);
      }

      const { sri, sci, eri, eci } = data.selector.range;
      draw.attr(tableFixedHeaderStyle());

      // Y-header (行号)
      if (type === 'all' || type === 'left') {
        data.rowEach(
          viewRange.sri,
          viewRange.eri,
          (i: number, y1: number, rowHeight: number) => {
            const y = nty + y1;
            draw.line([0, y], [w, y]);

            if (sri <= i && i < eri + 1) {
              draw.save();
              draw
                .attr({ fillStyle: RenderConfig.selection.highlight })
                .fillRect(0, y, w, rowHeight);
              draw.restore();
            }

            draw.fillText(String(i + 1), w / 2, y + rowHeight / 2);

            if (i > 0 && data.rows.isHide(i - 1)) {
              draw.save();
              draw.attr({ strokeStyle: RenderConfig.header.hiddenLineColor });
              draw.line([5, y + 5], [w - 5, y + 5]);
              draw.restore();
            }
          },
        );
        draw.line([0, sumHeight + nty], [w, sumHeight + nty]);
        draw.line([w, nty], [w, sumHeight + nty]);
      }

      // X-header (列号)
      if (type === 'all' || type === 'top') {
        data.colEach(
          viewRange.sci,
          viewRange.eci,
          (i: number, x1: number, colWidth: number) => {
            const x = ntx + x1;
            draw.line([x, 0], [x, h]);

            if (sci <= i && i < eci + 1) {
              draw.save();
              draw
                .attr({ fillStyle: RenderConfig.selection.highlight })
                .fillRect(x, 0, colWidth, h);
              draw.restore();
            }

            draw.fillText(stringAt(i), x + colWidth / 2, h / 2);

            if (i > 0 && data.cols.isHide(i - 1)) {
              draw.save();
              draw.attr({ strokeStyle: RenderConfig.header.hiddenLineColor });
              draw.line([x + 5, 5], [x + 5, h - 5]);
              draw.restore();
            }
          },
        );
        draw.line([sumWidth + ntx, 0], [sumWidth + ntx, h]);
        draw.line([0, h], [sumWidth + ntx, h]);
      }

      draw.restore();
    },
    [data],
  );

  // 渲染内容区域
  const renderContent = useCallback(
    (viewRange: CellRange, fw: number, fh: number, tx: number, ty: number) => {
      if (!drawRef.current || !data) return;

      const draw = drawRef.current;
      draw.save();
      draw.translate(fw, fh).translate(tx, ty);

      const { exceptRowSet } = data;
      const filteredTranslateFunc = (ri: number) => {
        const ret = exceptRowSet.has(ri);
        if (ret) {
          const height = data.rows.getHeight(ri);
          draw.translate(0, -height);
        }
        return !ret;
      };

      const exceptRowTotalHeight = data.exceptRowTotalHeight(
        viewRange.sri,
        viewRange.eri,
      );

      // 渲染单元格
      draw.save();
      draw.translate(0, -exceptRowTotalHeight);
      if (viewRange.each) {
        viewRange.each(
          (ri: number, ci: number) => {
            renderCell(draw, data, ri, ci);
          },
          (ri: number) => filteredTranslateFunc(ri),
        );
      }
      draw.restore();

      // 渲染合并单元格
      const rset = new Set();
      draw.save();
      draw.translate(0, -exceptRowTotalHeight);
      data.eachMergesInView(viewRange, ({ sri, sci, eri }: MergeInfo) => {
        if (!exceptRowSet.has(sri)) {
          renderCell(draw, data, sri, sci);
        } else if (!rset.has(sri)) {
          rset.add(sri);
          const height = data.rows.sumHeight(sri, eri + 1);
          draw.translate(0, -height);
        }
      });
      draw.restore();

      // 渲染自动筛选下拉框
      const { autoFilter } = data;
      if (autoFilter.active()) {
        const afRange = autoFilter.hrange();
        if (viewRange.intersects?.(afRange)) {
          if (afRange.each) {
            afRange.each((ri: number, ci: number) => {
              const { left, top, width, height } = data.cellRect(ri, ci);
              draw.dropdown(new DrawBox(left, top, width, height, 0));
            });
          }
        }
      }

      draw.restore();
    },
    [data],
  );

  // 渲染网格线
  const renderContentGrid = useCallback(
    (viewRange: CellRange, fw: number, fh: number, tx: number, ty: number) => {
      if (!drawRef.current || !data) return;

      const draw = drawRef.current;
      const { settings } = data;

      draw.save();
      draw.attr(tableGridStyle).translate(fw + tx, fh + ty);

      if (!settings.showGrid) {
        draw.restore();
        return;
      }

      data.rowEach(
        viewRange.sri,
        viewRange.eri,
        (i: number, y: number, ch: number) => {
          if (i !== viewRange.sri) draw.line([0, y], [viewRange.w, y]);
          if (i === viewRange.eri)
            draw.line([0, y + ch], [viewRange.w, y + ch]);
        },
      );

      data.colEach(
        viewRange.sci,
        viewRange.eci,
        (i: number, x: number, cw: number) => {
          if (i !== viewRange.sci) draw.line([x, 0], [x, viewRange.h]);
          if (i === viewRange.eci)
            draw.line([x + cw, 0], [x + cw, viewRange.h]);
        },
      );

      draw.restore();
    },
    [data],
  );

  // 渲染左上角固定单元格
  const renderFixedLeftTopCell = useCallback((fw: number, fh: number) => {
    if (!drawRef.current) return;

    const draw = drawRef.current;
    draw.save();
    draw
      .attr({ fillStyle: RenderConfig.header.backgroundColor })
      .fillRect(0, 0, fw, fh);
    draw.restore();
  }, []);

  // 渲染冻结高亮线
  const renderFreezeHighlightLine = useCallback(
    (fw: number, fh: number, ftw: number, fth: number) => {
      if (!drawRef.current || !data) return;

      const draw = drawRef.current;
      const twidth = data.viewWidth() - fw;
      const theight = data.viewHeight() - fh;

      draw
        .save()
        .translate(fw, fh)
        .attr({ strokeStyle: RenderConfig.selection.freezeLine });
      draw.line([0, fth], [twidth, fth]);
      draw.line([ftw, 0], [ftw, theight]);
      draw.restore();
    },
    [data],
  );

  // 主渲染函数
  const render = useCallback(() => {
    if (!drawRef.current || !data) return;

    const draw = drawRef.current;
    const { rows, cols } = data;
    const fw = cols.indexWidth;
    const fh = rows.height;

    // 调整 canvas 大小
    draw.resize(data.viewWidth(), data.viewHeight());
    draw.clear();

    const viewRange = data.viewRange();
    const tx = data.freezeTotalWidth();
    const ty = data.freezeTotalHeight();
    const { x, y } = data.scroll;

    // 渲染主区域
    renderContentGrid(viewRange, fw, fh, tx, ty);
    renderContent(viewRange, fw, fh, -x, -y);
    renderFixedHeaders('all', viewRange, fw, fh, tx, ty);
    renderFixedLeftTopCell(fw, fh);

    // 渲染冻结区域
    const [fri, fci] = data.freeze;
    if (fri > 0 || fci > 0) {
      if (fri > 0) {
        const vr = viewRange.clone();
        vr.sri = 0;
        vr.eri = fri - 1;
        vr.h = ty;
        renderContentGrid(vr, fw, fh, tx, 0);
        renderContent(vr, fw, fh, -x, 0);
        renderFixedHeaders('top', vr, fw, fh, tx, 0);
      }

      if (fci > 0) {
        const vr = viewRange.clone();
        vr.sci = 0;
        vr.eci = fci - 1;
        vr.w = tx;
        renderContentGrid(vr, fw, fh, 0, ty);
        renderFixedHeaders('left', vr, fw, fh, 0, ty);
        renderContent(vr, fw, fh, 0, -y);
      }

      const freezeViewRange = data.freezeViewRange();
      renderContentGrid(freezeViewRange, fw, fh, 0, 0);
      renderFixedHeaders('all', freezeViewRange, fw, fh, 0, 0);
      renderContent(freezeViewRange, fw, fh, 0, 0);

      renderFreezeHighlightLine(fw, fh, tx, ty);
    }
  }, [
    data,
    renderContent,
    renderContentGrid,
    renderFixedHeaders,
    renderFixedLeftTopCell,
    renderFreezeHighlightLine,
  ]);

  return {
    canvasRef,
    render,
  };
}
