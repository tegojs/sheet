# ReactSheet

渲染电子表格的主 React 组件。

## 导入

```tsx
import { ReactSheet } from '@tachybase/sheet';
```

## 用法

```tsx
function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',
        showToolbar: true,
      }}
      onChange={(data) => console.log(data)}
    />
  );
}
```

## Props

### `options`

类型: `Options`

电子表格的配置选项。

```tsx
interface Options {
  mode?: 'edit' | 'read';         // 编辑模式或只读模式
  showToolbar?: boolean;          // 显示工具栏（默认: true）
  showGrid?: boolean;             // 显示网格线（默认: true）
  showContextmenu?: boolean;      // 启用右键菜单（默认: true）
  showBottomBar?: boolean;        // 显示表格标签栏（默认: true）
  autoFocus?: boolean;            // 挂载时自动聚焦
  view?: {
    height: () => number;         // 视图高度函数
    width: () => number;          // 视图宽度函数
  };
  row?: {
    len: number;                  // 行数
    height: number;               // 默认行高
  };
  col?: {
    len: number;                  // 列数
    width: number;                // 默认列宽
    indexWidth: number;           // 行索引列宽度
    minWidth: number;             // 最小列宽
  };
  style?: {
    bgcolor: string;              // 默认背景色
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    textwrap: boolean;
    strike: boolean;
    underline: boolean;
    color: string;                // 默认文字颜色
    font: {
      name: string;               // 字体
      size: number;               // 字号
      bold: boolean;
      italic: boolean;
    };
  };
  extendToolbar?: {               // 自定义工具栏按钮
    left?: ExtendToolbarOption[];
    right?: ExtendToolbarOption[];
  };
}
```

### `onChange`

类型: `(data: SheetDataInput[]) => void`

表格数据变化时触发的回调函数。

```tsx
<ReactSheet
  onChange={(data) => {
    // data 是表格数据数组
    console.log('表格变化:', data);
    // 保存到后端等操作
  }}
/>
```

## 示例

### 只读模式

```tsx
<ReactSheet options={{ mode: 'read' }} />
```

### 自定义视图尺寸

```tsx
<ReactSheet
  options={{
    view: {
      height: () => 600,
      width: () => 800,
    },
  }}
/>
```

### 自定义默认样式

```tsx
<ReactSheet
  options={{
    style: {
      bgcolor: '#f5f5f5',
      align: 'center',
      valign: 'middle',
      font: {
        name: 'Arial',
        size: 12,
        bold: false,
        italic: false,
      },
      color: '#333333',
      textwrap: false,
      strike: false,
      underline: false,
    },
  }}
/>
```

### 隐藏工具栏

```tsx
<ReactSheet
  options={{
    showToolbar: false,
    showBottomBar: false,
  }}
/>
```
