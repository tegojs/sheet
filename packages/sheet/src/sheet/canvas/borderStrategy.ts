/**
 * Strategy pattern for border styles
 */

import { npx, thinLineWidth } from './draw';
import { DrawConfig } from './drawConfig';

/**
 * Interface for border style strategies
 */
export interface BorderStrategy {
  apply(ctx: CanvasRenderingContext2D): void;
}

/**
 * Registry of border style strategies
 */
const strategies: Record<string, BorderStrategy> = {
  thin: {
    apply(ctx) {
      ctx.lineWidth = thinLineWidth();
      ctx.setLineDash([]);
    },
  },
  medium: {
    apply(ctx) {
      ctx.lineWidth = npx(DrawConfig.borders.mediumWidth) - 0.5;
      ctx.setLineDash([]);
    },
  },
  thick: {
    apply(ctx) {
      ctx.lineWidth = npx(DrawConfig.borders.thickWidth);
      ctx.setLineDash([]);
    },
  },
  dashed: {
    apply(ctx) {
      ctx.lineWidth = thinLineWidth();
      ctx.setLineDash(DrawConfig.borders.dashedPattern.map(npx));
    },
  },
  dotted: {
    apply(ctx) {
      ctx.lineWidth = thinLineWidth();
      ctx.setLineDash(DrawConfig.borders.dottedPattern.map(npx));
    },
  },
  double: {
    apply(ctx) {
      ctx.lineWidth = thinLineWidth();
      const pattern = DrawConfig.borders.doublePattern;
      ctx.setLineDash([npx(pattern[0]), pattern[1]]);
    },
  },
};

/**
 * Apply a border style to a canvas context
 */
export function applyBorderStyle(
  ctx: CanvasRenderingContext2D,
  style: string,
  color: string,
): void {
  ctx.strokeStyle = color;
  ctx.setLineDash([]);
  const strategy = strategies[style] || strategies.thin;
  strategy.apply(ctx);
}

/**
 * Register a custom border style strategy
 */
export function registerBorderStyle(
  name: string,
  strategy: BorderStrategy,
): void {
  strategies[name] = strategy;
}

/**
 * Get all registered border style names
 */
export function getBorderStyleNames(): string[] {
  return Object.keys(strategies);
}
