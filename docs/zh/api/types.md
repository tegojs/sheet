# 类型定义

`@tego/sheet` 的 TypeScript 类型定义。

## 数据类型

### `SheetDataInput`

加载电子表格数据的输入数据结构。

```typescript
interface SheetDataInput {
  name?: string;           // 表格名称
  freeze?: string;         // 冻结位置（如 'A1'）
  styles?: CellStyle[];    // 样式定义
  merges?: string[];       // 合并单元格范围（如 ['A1:B2']）
  cols?: {
    len?: number;          // 列数
    [key: number]: { width?: number };
  };
  rows?: {
    [key: number]: {
      cells: {
        [key: number]: {
          text: string;
          style?: number;  // 样式数组索引
          merge?: [number, number];
        };
      };
    };
  };
}
```

### `Cell`

单元格数据结构。

```typescript
interface Cell {
  text?: string;                    // 单元格文本内容
  style?: number;                   // 样式索引
  merge?: [number, number];         // 合并跨度 [行数, 列数]
  editable?: boolean;               // 是否可编辑
  [key: string]: unknown;
}
```

### `CellStyle`

单元格样式定义。

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
  bgcolor?: string;                 // 背景色
  textwrap?: boolean;               // 文本换行
  color?: string;                   // 文字颜色
  strike?: boolean;                 // 删除线
  underline?: boolean;              // 下划线
  border?: {
    top?: BorderStyle;
    right?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
  };
  format?: string;                  // 数字格式
}
```

### `CellStyleFull`

包含所有必需属性的完整单元格样式。

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

边框样式定义。

```typescript
type BorderStyle = [string, string, string];
// [线条样式, 颜色, 宽度]
// 如 ['thin', '#000000', '1px']
```

## 视图类型

### `ViewRange`

定义可见区域范围。

```typescript
interface ViewRange {
  sri: number;    // 起始行索引
  sci: number;    // 起始列索引
  eri: number;    // 结束行索引
  eci: number;    // 结束列索引
  w: number;      // 宽度
  h: number;      // 高度
  each?: (
    cb: (ri: number, ci: number) => void,
    filteredCb?: (ri: number) => boolean,
  ) => void;
  intersects?: (other: ViewRange) => boolean;
  clone?: () => ViewRange;
}
```

### `CellRect`

单元格矩形信息。

```typescript
interface CellRect {
  ri: number;     // 行索引
  ci: number;     // 列索引
  left: number;
  top: number;
  width: number;
  height: number;
}
```

### `MergeInfo`

合并单元格信息。

```typescript
interface MergeInfo {
  sri: number;    // 起始行索引
  sci: number;    // 起始列索引
  eri: number;    // 结束行索引
  eci: number;    // 结束列索引
}
```

## 验证类型

### `ValidationType`

可用的验证类型。

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

验证操作符。

```typescript
type ValidationOperator =
  | 'be'    // 介于
  | 'nbe'   // 不介于
  | 'eq'    // 等于
  | 'neq'   // 不等于
  | 'lt'    // 小于
  | 'lte'   // 小于或等于
  | 'gt'    // 大于
  | 'gte';  // 大于或等于
```

### `ValidationMode`

验证模式。

```typescript
type ValidationMode = 'stop' | 'alert' | 'hint';
```

### `ValidationRule`

验证规则结构。

```typescript
interface ValidationRule {
  type: ValidationType;
  required: boolean;
  value: string | string[];
  operator: ValidationOperator;
}
```

### `ValidationData`

完整的验证数据。

```typescript
interface ValidationData {
  refs: string[];           // 单元格引用，如 ['A1', 'B2:C3']
  mode: ValidationMode;
  type: ValidationType;
  required: boolean;
  operator: ValidationOperator;
  value: string | string[];
}
```

### `ValidationError`

验证错误信息。

```typescript
interface ValidationError {
  ri: number;
  ci: number;
  message: string;
}
```

## 事件类型

### `ChangeListener`

变更事件监听器类型。

```typescript
type ChangeListener = (data: SheetDataInput | SheetDataInput[]) => void;
```

### `StyleValue`

样式值类型。

```typescript
type StyleValue = string | number | boolean | Record<string, unknown>;
```

## Canvas 类型

### `DrawBoxOptions`

绘制框选项。

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

绘制框参数。

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

Canvas 渲染选项。

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

## 工具类型

### `RangeCallback`

范围选择回调。

```typescript
type RangeCallback<T = unknown> = (value: T) => void;
```

### `EventListener`

事件监听器类型。

```typescript
type EventListener<T = unknown> = (event: T) => void;
```

### `CellRenderFn`

单元格渲染函数类型。

```typescript
type CellRenderFn = (x: number, y: number) => string | number;
```

### `Messages`

本地化消息类型。

```typescript
interface Messages {
  [key: string]: string | Messages;
}
```
