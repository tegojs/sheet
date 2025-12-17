import { describe, expect, it, vi } from 'vitest';
import { renderCell } from '../../src/sheet/canvas/cell_renderer';
import { Draw } from '../../src/sheet/canvas/draw';

describe('Cell Renderer', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockDraw: Draw;

  beforeEach(() => {
    mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      measureText: vi.fn(() => ({ width: 50 })),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      setLineDash: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '12px Arial',
      textAlign: 'left',
      textBaseline: 'top',
    } as unknown as CanvasRenderingContext2D;

    mockDraw = new Draw(mockCtx, 10, 10);
  });

  it('应该能够渲染空单元格', () => {
    const cell = null;
    const x = 0;
    const y = 0;
    const w = 100;
    const h = 50;

    expect(() => {
      renderCell(mockDraw, cell, x, y, w, h);
    }).not.toThrow();
  });

  it('应该能够渲染包含文本的单元格', () => {
    const cell = {
      text: 'Test Cell',
    };
    const x = 0;
    const y = 0;
    const w = 100;
    const h = 50;

    expect(() => {
      renderCell(mockDraw, cell, x, y, w, h);
    }).not.toThrow();

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('应该能够渲染带样式的单元格', () => {
    const cell = {
      text: 'Styled Cell',
      style: {
        font: {
          name: 'Arial',
          size: 12,
          bold: true,
          italic: false,
        },
        color: '#000000',
        bgcolor: '#FFFFFF',
        align: 'center',
        valign: 'middle',
      },
    };
    const x = 0;
    const y = 0;
    const w = 100;
    const h = 50;

    expect(() => {
      renderCell(mockDraw, cell, x, y, w, h);
    }).not.toThrow();
  });

  it('应该能够渲染带边框的单元格', () => {
    const cell = {
      text: 'Bordered Cell',
      style: {
        border: {
          top: ['thin', '#000000', 'solid'],
          right: ['thin', '#000000', 'solid'],
          bottom: ['thin', '#000000', 'solid'],
          left: ['thin', '#000000', 'solid'],
        },
      },
    };
    const x = 0;
    const y = 0;
    const w = 100;
    const h = 50;

    expect(() => {
      renderCell(mockDraw, cell, x, y, w, h);
    }).not.toThrow();
  });

  it('应该能够处理长文本', () => {
    const cell = {
      text: 'This is a very long text that should be truncated or wrapped',
    };
    const x = 0;
    const y = 0;
    const w = 100;
    const h = 50;

    expect(() => {
      renderCell(mockDraw, cell, x, y, w, h);
    }).not.toThrow();
  });
});
