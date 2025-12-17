/**
 * 单元格渲染器
 * 从 component/table.ts 迁移而来
 */

import { cellRender } from '../core/cell';
import type DataProxy from '../core/dataProxy';
import { getFontSizePxByPt } from '../core/font';
import { formatm } from '../core/format';
import { formulam } from '../core/formula';
import { type Draw, DrawBox } from './draw';

const cellPaddingWidth = 5;

function getDrawBox(
  data: DataProxy,
  rindex: number,
  cindex: number,
  xoffset = 0,
  yoffset = 0,
): DrawBox {
  const { left, top, width, height } = data.cellRect(rindex, cindex);
  const ileft = left + xoffset;
  const itop = top + yoffset;

  return new DrawBox(ileft, itop, width, height, cellPaddingWidth);
}

/**
 * 渲染单个单元格
 * @param draw - Draw 实例
 * @param data - DataProxy 实例
 * @param rindex - 行索引
 * @param cindex - 列索引
 * @param xoffset - X 偏移量
 * @param yoffset - Y 偏移量
 */
export function renderCell(
  draw: Draw,
  data: DataProxy,
  rindex: number,
  cindex: number,
  xoffset = 0,
  yoffset = 0,
): void {
  const { sortedRowMap, rows, cols } = data;
  if (rows.isHide(rindex) || cols.isHide(cindex)) return;

  let nrindex = rindex;
  if (sortedRowMap.has(rindex)) {
    nrindex = sortedRowMap.get(rindex);
  }

  const cell = data.getCell(nrindex, cindex);
  if (cell === null) return;

  let frozen = false;
  if ('editable' in cell && cell.editable === false) {
    frozen = true;
  }

  const style = data.getCellStyleOrDefault(nrindex, cindex);
  const dbox = getDrawBox(data, rindex, cindex, xoffset, yoffset);
  dbox.bgcolor = style.bgcolor;

  if (style.border !== undefined) {
    dbox.setBorders(style.border);
    draw.strokeBorders(dbox);
  }

  draw.rect(dbox, () => {
    // render text
    let cellText = '';
    if (!data.settings.evalPaused) {
      cellText = cellRender(cell.text || '', formulam, (y, x) =>
        data.getCellTextOrDefault(x, y),
      );
    } else {
      cellText = cell.text || '';
    }

    if (style.format) {
      cellText = formatm[style.format].render(cellText);
    }

    const font = Object.assign({}, style.font);
    font.size = getFontSizePxByPt(font.size);

    draw.text(
      cellText,
      dbox,
      {
        align: style.align,
        valign: style.valign,
        font,
        color: style.color,
        strike: style.strike,
        underline: style.underline,
      },
      style.textwrap,
    );

    // error
    const error = data.validations.getError(rindex, cindex);
    if (error) {
      draw.error(dbox);
    }

    if (frozen) {
      draw.frozen(dbox);
    }
  });
}
