/**
 * Data Types
 */

import type { CellStyle } from './cell';

/**
 * Sheet data input type
 * Used for loadData method
 */
export interface SheetDataInput {
  name?: string;
  freeze?: string;
  styles?: CellStyle[];
  merges?: string[];
  cols?: {
    len?: number;
    [key: number]: { width?: number };
  };
  rows?: {
    [key: number]: {
      cells: {
        [key: number]: {
          text: string;
          style?: number;
          merge?: [number, number];
        };
      };
    };
  };
}

/**
 * Change listener type
 */
export type ChangeListener = (data: SheetDataInput | SheetDataInput[]) => void;

/**
 * View range
 * Defines the visible area row/column range
 */
export interface ViewRange {
  sri: number; // start row index
  sci: number; // start column index
  eri: number; // end row index
  eci: number; // end column index
  w: number; // width
  h: number; // height
  each?: (
    cb: (ri: number, ci: number) => void,
    filteredCb?: (ri: number) => boolean,
  ) => void;
  intersects?: (
    other: ViewRange | { sri: number; sci: number; eri: number; eci: number },
  ) => boolean;
  clone?: () => ViewRange;
}
