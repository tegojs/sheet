import { beforeEach, describe, expect, it } from 'vitest';
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

      expect(innerWidth).toBe(88); // 100 - 2 * 5 - 2
    });

    it('应该正确计算内部高度', () => {
      const box = new DrawBox(10, 20, 100, 50, 5);
      const innerHeight = box.innerHeight();

      expect(innerHeight).toBe(38); // 50 - 2 * 5 - 2
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
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
      canvas = document.createElement('canvas');
    });

    it('应该能够创建 Draw 实例', () => {
      const draw = new Draw(canvas, 100, 100);

      expect(draw).toBeInstanceOf(Draw);
    });

    it('应该能够绘制矩形', () => {
      const draw = new Draw(canvas, 100, 100);
      draw.rect({ x: 0, y: 0, width: 100, height: 50 }, () => {});

      // If no exception is thrown, the test passes
      expect(draw).toBeInstanceOf(Draw);
    });

    it('应该能够绘制文本', () => {
      const draw = new Draw(canvas, 100, 100);
      const box = new DrawBox(0, 0, 100, 50);
      const attr = {
        align: 'left',
        valign: 'middle',
        font: { name: 'Arial', size: 12 },
        color: '#000000',
      };

      draw.text('Test', box, attr);

      // If no exception is thrown, the test passes
      expect(draw).toBeInstanceOf(Draw);
    });

    it('应该能够绘制线条', () => {
      const draw = new Draw(canvas, 100, 100);

      draw.line([
        [0, 0],
        [100, 100],
      ]);

      // If no exception is thrown, the test passes
      expect(draw).toBeInstanceOf(Draw);
    });
  });
});
