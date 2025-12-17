import { describe, expect, it, vi } from 'vitest';
import { Draw, DrawBox, npx, thinLineWidth } from '../../src/sheet/canvas/draw';

describe('Canvas Draw Utils', () => {
  describe('npx', () => {
    it('应该正确转换像素值', () => {
      const result = npx(10);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('thinLineWidth', () => {
    it('应该返回细线宽度', () => {
      const result = thinLineWidth();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('DrawBox', () => {
    it('应该正确初始化', () => {
      const box = new DrawBox(10, 20, 100, 50, 5);

      expect(box.x).toBe(10);
      expect(box.y).toBe(20);
      expect(box.width).toBe(100);
      expect(box.height).toBe(50);
      expect(box.padding).toBe(5);
    });

    it('应该正确计算内部宽度', () => {
      const box = new DrawBox(10, 20, 100, 50, 5);
      const innerWidth = box.innerWidth();

      expect(innerWidth).toBe(90); // 100 - 2 * 5
    });

    it('应该正确计算内部高度', () => {
      const box = new DrawBox(10, 20, 100, 50, 5);
      const innerHeight = box.innerHeight();

      expect(innerHeight).toBe(40); // 50 - 2 * 5
    });

    it('应该能够设置边框', () => {
      const box = new DrawBox(10, 20, 100, 50);
      box.setBorders({
        top: ['thin', '#000', 'solid'],
        right: ['thin', '#000', 'solid'],
        bottom: ['thin', '#000', 'solid'],
        left: ['thin', '#000', 'solid'],
      });

      expect(box.borderTop).toEqual(['thin', '#000', 'solid']);
      expect(box.borderRight).toEqual(['thin', '#000', 'solid']);
      expect(box.borderBottom).toEqual(['thin', '#000', 'solid']);
      expect(box.borderLeft).toEqual(['thin', '#000', 'solid']);
    });
  });

  describe('Draw', () => {
    let mockCtx: CanvasRenderingContext2D;

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
    });

    it('应该能够创建 Draw 实例', () => {
      const draw = new Draw(mockCtx, 10, 10);

      expect(draw).toBeInstanceOf(Draw);
    });

    it('应该能够绘制矩形', () => {
      const draw = new Draw(mockCtx, 10, 10);
      draw.rect({ x: 0, y: 0, width: 100, height: 50 }, () => {});

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });

    it('应该能够绘制文本', () => {
      const draw = new Draw(mockCtx, 10, 10);
      const box = new DrawBox(0, 0, 100, 50);

      draw.text('Test', box);

      expect(mockCtx.fillText).toHaveBeenCalled();
    });

    it('应该能够绘制线条', () => {
      const draw = new Draw(mockCtx, 10, 10);

      draw.line([
        [0, 0],
        [100, 100],
      ]);

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.moveTo).toHaveBeenCalled();
      expect(mockCtx.lineTo).toHaveBeenCalled();
      expect(mockCtx.stroke).toHaveBeenCalled();
    });
  });
});
