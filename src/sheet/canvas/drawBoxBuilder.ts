/**
 * Builder pattern for creating DrawBox instances with fluent API
 */

import type { BorderStyle } from '../types';
import { DrawBox } from './draw';
import { DrawConfig } from './drawConfig';

/**
 * Builder class for creating DrawBox instances with a fluent interface
 */
export class DrawBoxBuilder {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _padding = 0;
  private _bgcolor: string = DrawConfig.colors.defaultBackground;
  private _borderTop: BorderStyle | null = null;
  private _borderRight: BorderStyle | null = null;
  private _borderBottom: BorderStyle | null = null;
  private _borderLeft: BorderStyle | null = null;

  constructor(x: number, y: number, width: number, height: number) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  /**
   * Set padding for all sides
   */
  padding(p: number): this {
    this._padding = p;
    return this;
  }

  /**
   * Set background color
   */
  bgcolor(color: string): this {
    this._bgcolor = color;
    return this;
  }

  /**
   * Set top border
   */
  borderTop(style: BorderStyle): this {
    this._borderTop = style;
    return this;
  }

  /**
   * Set right border
   */
  borderRight(style: BorderStyle): this {
    this._borderRight = style;
    return this;
  }

  /**
   * Set bottom border
   */
  borderBottom(style: BorderStyle): this {
    this._borderBottom = style;
    return this;
  }

  /**
   * Set left border
   */
  borderLeft(style: BorderStyle): this {
    this._borderLeft = style;
    return this;
  }

  /**
   * Set all borders to the same style
   */
  allBorders(style: BorderStyle): this {
    this._borderTop = style;
    this._borderRight = style;
    this._borderBottom = style;
    this._borderLeft = style;
    return this;
  }

  /**
   * Set borders using an object
   */
  borders(borders: {
    top?: BorderStyle;
    right?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
  }): this {
    if (borders.top) this._borderTop = borders.top;
    if (borders.right) this._borderRight = borders.right;
    if (borders.bottom) this._borderBottom = borders.bottom;
    if (borders.left) this._borderLeft = borders.left;
    return this;
  }

  /**
   * Build and return the DrawBox instance
   */
  build(): DrawBox {
    const box = new DrawBox(
      this._x,
      this._y,
      this._width,
      this._height,
      this._padding,
    );
    box.bgcolor = this._bgcolor;
    if (this._borderTop) box.borderTop = this._borderTop;
    if (this._borderRight) box.borderRight = this._borderRight;
    if (this._borderBottom) box.borderBottom = this._borderBottom;
    if (this._borderLeft) box.borderLeft = this._borderLeft;
    return box;
  }

  /**
   * Static factory method for starting a builder chain
   */
  static at(x: number, y: number) {
    return {
      size: (width: number, height: number) =>
        new DrawBoxBuilder(x, y, width, height),
    };
  }

  /**
   * Static factory method for creating a builder with position and size
   */
  static create(
    x: number,
    y: number,
    width: number,
    height: number,
  ): DrawBoxBuilder {
    return new DrawBoxBuilder(x, y, width, height);
  }
}
