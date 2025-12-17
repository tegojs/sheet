# Types

TypeScript type definitions for `@tachybase/sheet`.

## Data Types

### `SheetDataInput`

Input data structure for loading spreadsheet data.

```typescript
interface SheetDataInput {
  name?: string;           // Sheet name
  freeze?: string;         // Freeze position (e.g., 'A1')
  styles?: CellStyle[];    // Style definitions
  merges?: string[];       // Merged cell ranges (e.g., ['A1:B2'])
  cols?: {
    len?: number;          // Number of columns
    [key: number]: { width?: number };
  };
  rows?: {
    [key: number]: {
      cells: {
        [key: number]: {
          text: string;
          style?: number;  // Index into styles array
          merge?: [number, number];
        };
      };
    };
  };
}
```

### `Cell`

Cell data structure.

```typescript
interface Cell {
  text?: string;                    // Cell text content
  style?: number;                   // Style index
  merge?: [number, number];         // Merge span [rows, cols]
  editable?: boolean;               // Whether cell is editable
  [key: string]: unknown;
}
```

### `CellStyle`

Cell style definition.

```typescript
interface CellStyle {
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  font?: {
    bold?: boolean;
    italic?: boolean;
    name?: string;
    size?: number;
  };
  bgcolor?: string;                 // Background color
  textwrap?: boolean;               // Text wrapping
  color?: string;                   // Text color
  strike?: boolean;                 // Strikethrough
  underline?: boolean;              // Underline
  border?: {
    top?: BorderStyle;
    right?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
  };
  format?: string;                  // Number format
}
```

### `CellStyleFull`

Complete cell style with all required properties.

```typescript
interface CellStyleFull {
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
  font: {
    bold: boolean;
    italic: boolean;
    name: string;
    size: number;
  };
  bgcolor: string;
  textwrap: boolean;
  color: string;
  strike: boolean;
  underline: boolean;
  format: string;
}
```

### `BorderStyle`

Border style definition.

```typescript
type BorderStyle = [string, string, string];
// [line-style, color, width]
// e.g., ['thin', '#000000', '1px']
```

## View Types

### `ViewRange`

Defines the visible area range.

```typescript
interface ViewRange {
  sri: number;    // Start row index
  sci: number;    // Start column index
  eri: number;    // End row index
  eci: number;    // End column index
  w: number;      // Width
  h: number;      // Height
  each?: (
    cb: (ri: number, ci: number) => void,
    filteredCb?: (ri: number) => boolean,
  ) => void;
  intersects?: (other: ViewRange) => boolean;
  clone?: () => ViewRange;
}
```

### `CellRect`

Cell rectangle information.

```typescript
interface CellRect {
  ri: number;     // Row index
  ci: number;     // Column index
  left: number;
  top: number;
  width: number;
  height: number;
}
```

### `MergeInfo`

Merged cell information.

```typescript
interface MergeInfo {
  sri: number;    // Start row index
  sci: number;    // Start column index
  eri: number;    // End row index
  eci: number;    // End column index
}
```

## Validation Types

### `ValidationType`

Available validation types.

```typescript
type ValidationType =
  | 'number'
  | 'email'
  | 'phone'
  | 'list'
  | 'date'
  | 'custom';
```

### `ValidationOperator`

Validation operators.

```typescript
type ValidationOperator =
  | 'be'    // Between
  | 'nbe'   // Not between
  | 'eq'    // Equal
  | 'neq'   // Not equal
  | 'lt'    // Less than
  | 'lte'   // Less than or equal
  | 'gt'    // Greater than
  | 'gte';  // Greater than or equal
```

### `ValidationMode`

Validation mode.

```typescript
type ValidationMode = 'stop' | 'alert' | 'hint';
```

### `ValidationRule`

Validation rule structure.

```typescript
interface ValidationRule {
  type: ValidationType;
  required: boolean;
  value: string | string[];
  operator: ValidationOperator;
}
```

### `ValidationData`

Complete validation data.

```typescript
interface ValidationData {
  refs: string[];           // Cell references, e.g., ['A1', 'B2:C3']
  mode: ValidationMode;
  type: ValidationType;
  required: boolean;
  operator: ValidationOperator;
  value: string | string[];
}
```

### `ValidationError`

Validation error information.

```typescript
interface ValidationError {
  ri: number;
  ci: number;
  message: string;
}
```

## Event Types

### `ChangeListener`

Change event listener type.

```typescript
type ChangeListener = (data: SheetDataInput | SheetDataInput[]) => void;
```

### `StyleValue`

Style value type.

```typescript
type StyleValue = string | number | boolean | Record<string, unknown>;
```

## Canvas Types

### `DrawBoxOptions`

Draw box options.

```typescript
interface DrawBoxOptions {
  bgcolor?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  font?: string;
  color?: string;
  strike?: boolean;
  underline?: boolean;
  textwrap?: boolean;
}
```

### `DrawBoxParams`

Draw box parameters.

```typescript
interface DrawBoxParams {
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: number;
  bgcolor?: string;
  borderTop?: BorderStyle | null;
  borderRight?: BorderStyle | null;
  borderBottom?: BorderStyle | null;
  borderLeft?: BorderStyle | null;
}
```

### `CanvasRenderingOptions`

Canvas rendering options.

```typescript
interface CanvasRenderingOptions {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  font?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}
```

## Utility Types

### `RangeCallback`

Range selection callback.

```typescript
type RangeCallback<T = unknown> = (value: T) => void;
```

### `EventListener`

Event listener type.

```typescript
type EventListener<T = unknown> = (event: T) => void;
```

### `CellRenderFn`

Cell render function type.

```typescript
type CellRenderFn = (x: number, y: number) => string | number;
```

### `Messages`

Locale messages type.

```typescript
interface Messages {
  [key: string]: string | Messages;
}
```
