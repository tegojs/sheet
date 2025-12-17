import { describe, expect, it } from 'vitest';
import { renderCell } from '../../src/sheet/canvas/cellRenderer';

describe('Cell Renderer', () => {
  it('renderCell 函数应该存在', () => {
    expect(typeof renderCell).toBe('function');
  });

  it('renderCell 函数应该接受正确数量的参数', () => {
    // renderCell signature: (draw, data, rindex, cindex, xoffset?, yoffset?)
    // It requires 4 mandatory parameters and 2 optional
    expect(renderCell.length).toBe(4);
  });
});
