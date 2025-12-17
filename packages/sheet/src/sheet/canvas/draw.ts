/* global window */
import type {
  BorderStyle,
  CanvasRenderingOptions,
  DrawTextCallback,
} from '../types';
import { DrawConfig } from './drawConfig';
import { calculateDecorationOffset } from './textRenderer';

function dpr() {
  return window.devicePixelRatio || 1;
}

export function thinLineWidth() {
  return dpr() - 0.5;
}

export function npx(px: number): number {
  return Math.floor(px * dpr());
}

function npxLine(px: number): number {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}

export class DrawBox {
  x: number;
  y: number;
  width: number;
  height: number;
  padding: number;
  bgcolor: string;
  borderTop: BorderStyle | null;
  borderRight: BorderStyle | null;
  borderBottom: BorderStyle | null;
  borderLeft: BorderStyle | null;

  constructor(x: number, y: number, w: number, h: number, padding = 0) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.padding = padding;
    this.bgcolor = DrawConfig.colors.defaultBackground;
    // border: [style, color, width]
    this.borderTop = null;
    this.borderRight = null;
    this.borderBottom = null;
    this.borderLeft = null;
  }

  setBorders({
    top,
    bottom,
    left,
    right,
  }: {
    top?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
    right?: BorderStyle;
  }) {
    if (top) this.borderTop = top;
    if (right) this.borderRight = right;
    if (bottom) this.borderBottom = bottom;
    if (left) this.borderLeft = left;
  }

  innerWidth(): number {
    return this.width - this.padding * 2 - 2;
  }

  innerHeight(): number {
    return this.height - this.padding * 2 - 2;
  }

  textx(align: string): number {
    const { width, padding } = this;
    let { x } = this;
    if (align === 'left') {
      x += padding;
    } else if (align === 'center') {
      x += width / 2;
    } else if (align === 'right') {
      x += width - padding;
    }
    return x;
  }

  texty(align: string, h: number): number {
    const { height, padding } = this;
    let { y } = this;
    if (align === 'top') {
      y += padding;
    } else if (align === 'middle') {
      y += height / 2 - h / 2;
    } else if (align === 'bottom') {
      y += height - padding - h;
    }
    return y;
  }

  topxys(): [number, number][] {
    const { x, y, width } = this;
    return [
      [x, y],
      [x + width, y],
    ];
  }

  rightxys(): [number, number][] {
    const { x, y, width, height } = this;
    return [
      [x + width, y],
      [x + width, y + height],
    ];
  }

  bottomxys(): [number, number][] {
    const { x, y, width, height } = this;
    return [
      [x, y + height],
      [x + width, y + height],
    ];
  }

  leftxys(): [number, number][] {
    const { x, y, height } = this;
    return [
      [x, y],
      [x, y + height],
    ];
  }
}

function drawFontLine(
  this: Draw,
  type: 'strike' | 'underline',
  tx: number,
  ty: number,
  align: string,
  valign: string,
  blheight: number,
  blwidth: number,
) {
  const floffset = calculateDecorationOffset(
    type,
    align,
    valign,
    blheight,
    blwidth,
  );
  this.line(
    [tx - floffset.x, ty - floffset.y],
    [tx - floffset.x + blwidth, ty - floffset.y],
  );
}

export class Draw {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(el: HTMLCanvasElement, width: number, height: number) {
    this.el = el;
    const context = el.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context from canvas element');
    }
    this.ctx = context;
    this.resize(width, height);
    const currentDpr = dpr();
    this.ctx.scale(currentDpr, currentDpr);
  }

  resize(width: number, height: number) {
    // console.log('dpr:', dpr);
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.width = npx(width);
    this.el.height = npx(height);
  }

  clear() {
    const { width, height } = this.el;
    this.ctx.clearRect(0, 0, width, height);
    return this;
  }

  attr(options: CanvasRenderingOptions) {
    Object.assign(this.ctx, options);
    return this;
  }

  save() {
    this.ctx.save();
    this.ctx.beginPath();
    return this;
  }

  restore() {
    this.ctx.restore();
    return this;
  }

  /**
   * Context Guard pattern: Execute a function within a saved context
   * Automatically handles save/restore to prevent state leaks
   */
  withContext<T>(fn: () => T): T {
    this.ctx.save();
    this.ctx.beginPath();
    try {
      return fn();
    } finally {
      this.ctx.restore();
    }
  }

  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  translate(x: number, y: number) {
    this.ctx.translate(npx(x), npx(y));
    return this;
  }

  scale(x: number, y: number) {
    this.ctx.scale(x, y);
    return this;
  }

  clearRect(x: number, y: number, w: number, h: number) {
    this.ctx.clearRect(x, y, w, h);
    return this;
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
    return this;
  }

  fillText(text: string, x: number, y: number) {
    this.ctx.fillText(text, npx(x), npx(y));
    return this;
  }

  /*
    txt: render text
    box: DrawBox
    attr: {
      align: left | center | right
      valign: top | middle | bottom
      color: '#333333',
      strike: false,
      font: {
        name: 'Arial',
        size: 14,
        bold: false,
        italic: false,
      }
    }
    textWrap: text wrapping
  */
  text(
    mtxt: string,
    box: DrawBox,
    attr: {
      align: string;
      valign: string;
      font: {
        name: string;
        size: number;
        bold?: boolean;
        italic?: boolean;
      };
      color: string;
      strike?: boolean;
      underline?: boolean;
    },
    textWrap = true,
  ) {
    const { ctx } = this;
    const { align, valign, font, color, strike, underline } = attr;
    const tx = box.textx(align);
    ctx.save();
    ctx.beginPath();
    this.attr({
      textAlign: align as CanvasTextAlign,
      textBaseline: valign as CanvasTextBaseline,
      font: `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`,
      fillStyle: color,
      strokeStyle: color,
    });
    const txts = `${mtxt}`.split('\n');
    const biw = box.innerWidth();
    const ntxts: string[] = [];
    txts.forEach((it) => {
      const txtWidth = ctx.measureText(it).width;
      if (textWrap && txtWidth > npx(biw)) {
        let textLine = { w: 0, len: 0, start: 0 };
        for (let i = 0; i < it.length; i += 1) {
          if (textLine.w >= npx(biw)) {
            ntxts.push(it.substr(textLine.start, textLine.len));
            textLine = { w: 0, len: 0, start: i };
          }
          textLine.len += 1;
          textLine.w += ctx.measureText(it[i]).width + 1;
        }
        if (textLine.len > 0) {
          ntxts.push(it.substr(textLine.start, textLine.len));
        }
      } else {
        ntxts.push(it);
      }
    });
    const txtHeight = (ntxts.length - 1) * (font.size + 2);
    let ty = box.texty(valign, txtHeight);
    ntxts.forEach((txt) => {
      const txtWidth = ctx.measureText(txt).width;
      this.fillText(txt, tx, ty);
      if (strike) {
        drawFontLine.call(
          this,
          'strike',
          tx,
          ty,
          align,
          valign,
          font.size,
          txtWidth,
        );
      }
      if (underline) {
        drawFontLine.call(
          this,
          'underline',
          tx,
          ty,
          align,
          valign,
          font.size,
          txtWidth,
        );
      }
      ty += font.size + 2;
    });
    ctx.restore();
    return this;
  }

  border(style: string, color: string) {
    const { ctx } = this;
    const { borders } = DrawConfig;
    ctx.lineWidth = thinLineWidth();
    ctx.strokeStyle = color;
    // Reset lineDash first to avoid state pollution from previous calls
    ctx.setLineDash([]);
    if (style === 'medium') {
      ctx.lineWidth = npx(borders.mediumWidth) - 0.5;
    } else if (style === 'thick') {
      ctx.lineWidth = npx(borders.thickWidth);
    } else if (style === 'dashed') {
      ctx.setLineDash(borders.dashedPattern.map(npx));
    } else if (style === 'dotted') {
      ctx.setLineDash(borders.dottedPattern.map(npx));
    } else if (style === 'double') {
      ctx.setLineDash([
        npx(borders.doublePattern[0]),
        borders.doublePattern[1],
      ]);
    }
    return this;
  }

  line(...xys: [number, number][]) {
    const { ctx } = this;
    if (xys.length > 1) {
      ctx.beginPath();
      const [x, y] = xys[0];
      ctx.moveTo(npxLine(x), npxLine(y));
      for (let i = 1; i < xys.length; i += 1) {
        const [x1, y1] = xys[i];
        ctx.lineTo(npxLine(x1), npxLine(y1));
      }
      ctx.stroke();
    }
    return this;
  }

  strokeBorders(box: DrawBox) {
    const { ctx } = this;
    ctx.save();
    // border
    const { borderTop, borderRight, borderBottom, borderLeft } = box;
    if (borderTop) {
      this.border(borderTop[0], borderTop[1]);
      // console.log('box.topxys:', box.topxys());
      const topPoints = box.topxys();
      this.line(...(topPoints as [number, number][]));
    }
    if (borderRight) {
      this.border(borderRight[0], borderRight[1]);
      const rightPoints = box.rightxys();
      this.line(...(rightPoints as [number, number][]));
    }
    if (borderBottom) {
      this.border(borderBottom[0], borderBottom[1]);
      const bottomPoints = box.bottomxys();
      this.line(...(bottomPoints as [number, number][]));
    }
    if (borderLeft) {
      this.border(borderLeft[0], borderLeft[1]);
      const leftPoints = box.leftxys();
      this.line(...(leftPoints as [number, number][]));
    }
    ctx.restore();
  }

  /**
   * Draw a triangle indicator at a specified position
   * Template method for dropdown, error, and frozen indicators
   */
  private drawTriangleIndicator(
    box: DrawBox,
    position: 'bottom-right' | 'top-right',
    color: string,
    size: number,
    height: number,
  ) {
    const { ctx } = this;
    const { x, y, width, height: boxHeight } = box;
    const { offset } = DrawConfig.indicators;

    let points: [number, number][];

    if (position === 'bottom-right') {
      // Dropdown indicator (pointing down)
      const sx = x + width - offset;
      const sy = y + boxHeight - offset;
      points = [
        [sx, sy],
        [sx + size, sy],
        [sx + size / 2, sy + height],
      ];
    } else {
      // Corner indicator (top-right corner triangle)
      const sx = x + width - 1;
      points = [
        [sx - size, y - 1],
        [sx, y - 1],
        [sx, y + height],
      ];
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(points[0][0]), npx(points[0][1]));
    ctx.lineTo(npx(points[1][0]), npx(points[1][1]));
    ctx.lineTo(npx(points[2][0]), npx(points[2][1]));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  dropdown(box: DrawBox) {
    const { indicators, colors } = DrawConfig;
    this.drawTriangleIndicator(
      box,
      'bottom-right',
      colors.dropdownIndicator,
      indicators.triangleSize,
      indicators.triangleHeight,
    );
  }

  error(box: DrawBox) {
    const { indicators, colors } = DrawConfig;
    this.drawTriangleIndicator(
      box,
      'top-right',
      colors.errorIndicator,
      indicators.triangleSize,
      indicators.cornerHeight,
    );
  }

  frozen(box: DrawBox) {
    const { indicators, colors } = DrawConfig;
    this.drawTriangleIndicator(
      box,
      'top-right',
      colors.frozenIndicator,
      indicators.triangleSize,
      indicators.cornerHeight,
    );
  }

  rect(box: DrawBox, dtextcb: DrawTextCallback) {
    const { ctx } = this;
    const { x, y, width, height, bgcolor } = box;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = bgcolor || '#fff';
    ctx.rect(npxLine(x + 1), npxLine(y + 1), npx(width - 2), npx(height - 2));
    ctx.clip();
    ctx.fill();
    dtextcb('');
    ctx.restore();
  }
}
