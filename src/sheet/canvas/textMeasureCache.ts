/**
 * LRU cache for text measurement results
 */

/**
 * Cache for text measurement to improve rendering performance
 */
class TextMeasureCache {
  private cache = new Map<string, number>();
  private maxSize: number;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Generate cache key from font and text
   */
  private getKey(font: string, text: string): string {
    return `${font}|${text}`;
  }

  /**
   * Measure text width with caching
   */
  measure(ctx: CanvasRenderingContext2D, text: string, font: string): number {
    const key = this.getKey(font, text);

    const cachedValue = this.cache.get(key);
    if (cachedValue !== undefined) {
      // Move to end for LRU
      this.cache.delete(key);
      this.cache.set(key, cachedValue);
      return cachedValue;
    }

    // Save and restore font to avoid side effects
    const originalFont = ctx.font;
    ctx.font = font;
    const width = ctx.measureText(text).width;
    ctx.font = originalFont;

    // LRU eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, width);
    return width;
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Check if a measurement is cached
   */
  has(font: string, text: string): boolean {
    return this.cache.has(this.getKey(font, text));
  }
}

/**
 * Global text measurement cache instance
 */
export const textMeasureCache = new TextMeasureCache();
