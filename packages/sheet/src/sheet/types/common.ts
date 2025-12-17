/**
 * Common Utility Types
 */

/**
 * Range selector callback
 */
export type RangeCallback<T = unknown> = (value: T) => void;

/**
 * Event listener
 */
export type EventListener<T = unknown> = (event: T) => void;

/**
 * Formula map type
 */
export interface FormulaMap {
  [key: string]: {
    render: (
      params: (string | number | boolean)[],
    ) => string | number | boolean;
  };
}

/**
 * Cell render function type
 */
export type CellRenderFn = (x: number, y: number) => string | number;

/**
 * Format map type
 */
export interface FormatMap {
  [key: string]: {
    render: (value: string) => string;
  };
}

/**
 * Messages map type
 */
export interface Messages {
  [key: string]: string | Messages;
}
