# 配置项说明

这些选项可以通过 ReactSheet 组件的 `options` prop 传入。

## 模式

切换只读和编辑模式。

```tsx
<ReactSheet options={{ mode: 'edit' }} />  // 编辑模式（默认）
<ReactSheet options={{ mode: 'read' }} />  // 只读模式
```

## UI 开关

### 工具栏

显示或隐藏工具栏。默认：`true`

```tsx
<ReactSheet options={{ showToolbar: false }} />
```

### 底部栏

显示或隐藏底部的表格标签栏。默认：`true`

```tsx
<ReactSheet options={{ showBottomBar: false }} />
```

### 网格线

显示或隐藏网格线。默认：`true`

```tsx
<ReactSheet options={{ showGrid: false }} />
```

### 右键菜单

启用或禁用右键菜单。默认：`true`

```tsx
<ReactSheet options={{ showContextmenu: false }} />
```

## 视图尺寸

使用返回宽度/高度的函数设置电子表格尺寸。

```tsx
<ReactSheet
  options={{
    view: {
      height: () => 600,                              // 固定高度
      width: () => document.documentElement.clientWidth,  // 全宽
    },
  }}
/>
```

## 行配置

配置默认行设置。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `len` | `number` | `100` | 行数 |
| `height` | `number` | `25` | 默认行高（像素） |

```tsx
<ReactSheet
  options={{
    row: {
      len: 200,    // 200 行
      height: 30,  // 30px 行高
    },
  }}
/>
```

## 列配置

配置默认列设置。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `len` | `number` | `26` | 列数（A-Z） |
| `width` | `number` | `100` | 默认列宽 |
| `indexWidth` | `number` | `60` | 行索引列宽度 |
| `minWidth` | `number` | `60` | 最小列宽 |

```tsx
<ReactSheet
  options={{
    col: {
      len: 52,        // A-AZ（52 列）
      width: 120,     // 默认宽度 120px
      indexWidth: 50, // 行索引宽度
      minWidth: 50,   // 最小宽度
    },
  }}
/>
```

## 默认样式

设置所有单元格的默认样式。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `bgcolor` | `string` | `'#ffffff'` | 背景色 |
| `align` | `string` | `'left'` | 水平对齐：`'left'`、`'center'`、`'right'` |
| `valign` | `string` | `'middle'` | 垂直对齐：`'top'`、`'middle'`、`'bottom'` |
| `textwrap` | `boolean` | `false` | 启用文本换行 |
| `strike` | `boolean` | `false` | 删除线 |
| `underline` | `boolean` | `false` | 下划线 |
| `color` | `string` | `'#0a0a0a'` | 文字颜色 |
| `font.name` | `string` | `'Helvetica'` | 字体 |
| `font.size` | `number` | `10` | 字号 |
| `font.bold` | `boolean` | `false` | 加粗 |
| `font.italic` | `boolean` | `false` | 斜体 |

```tsx
<ReactSheet
  options={{
    style: {
      bgcolor: '#f5f5f5',
      align: 'center',
      valign: 'middle',
      textwrap: true,
      strike: false,
      underline: false,
      color: '#333333',
      font: {
        name: 'Arial',
        size: 12,
        bold: false,
        italic: false,
      },
    },
  }}
/>
```

## 完整示例

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',
        showToolbar: true,
        showBottomBar: true,
        showGrid: true,
        showContextmenu: true,
        view: {
          height: () => window.innerHeight - 100,
          width: () => window.innerWidth,
        },
        row: {
          len: 100,
          height: 25,
        },
        col: {
          len: 26,
          width: 100,
          indexWidth: 60,
          minWidth: 60,
        },
        style: {
          bgcolor: '#ffffff',
          align: 'left',
          valign: 'middle',
          textwrap: false,
          strike: false,
          underline: false,
          color: '#0a0a0a',
          font: {
            name: 'Helvetica',
            size: 10,
            bold: false,
            italic: false,
          },
        },
      }}
      onChange={(data) => console.log('数据变化:', data)}
    />
  );
}
```
