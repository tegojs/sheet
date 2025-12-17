# API 参考

## 概述

`@tachybase/sheet` 提供基于 React 的电子表格组件，主要导出：

| 导出 | 类型 | 描述 |
|------|------|------|
| `ReactSheet` | 组件 | 主电子表格 React 组件 |
| `useSheetStore` | Hook | Zustand 状态管理 store |
| `useActiveSheet` | Hook | 获取当前活动表格 |
| `useSelection` | Hook | 获取当前选区 |
| `useIsEditing` | Hook | 获取编辑状态 |
| `Spreadsheet` | 类 | 旧版类式 API（兼容用） |

## 快速示例

```tsx
import { ReactSheet, useSheetStore } from '@tachybase/sheet';

function App() {
  const { loadData, getData } = useSheetStore();

  return (
    <div>
      <ReactSheet
        options={{ mode: 'edit' }}
        onChange={(data) => console.log(data)}
      />
      <button onClick={() => console.log(getData())}>
        导出
      </button>
    </div>
  );
}
```

## 核心 API

### [ReactSheet](/api/react-sheet)

渲染电子表格的主 React 组件。

```tsx
<ReactSheet options={options} onChange={callback} />
```

### [useSheetStore](/api/use-sheet-store)

Zustand store hook，提供所有状态管理方法：

- 表格管理：`addSheet`, `deleteSheet`, `switchSheet`, `renameSheet`
- 单元格操作：`setCellText`, `setCellStyle`, `setSelection`
- 编辑操作：`startEditing`, `stopEditing`
- 历史记录：`undo`, `redo`
- 剪贴板：`copy`, `cut`, `paste`
- 数据操作：`loadData`, `getData`

### [DataProxy](/api/data_proxy)

管理表格数据的内部类。通过 `getActiveSheet()` 访问。

### [Types](/api/types)

所有接口的 TypeScript 类型定义。

## 架构

```
┌─────────────────────────────────────┐
│  ReactSheet（UI 层）                │
│  • Toolbar, Editor, ContextMenu     │
│  • SelectionOverlay, Bottombar      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  useSheetStore（状态层）            │
│  • Zustand store                    │
│  • 状态和操作方法                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  DataProxy（数据层）                │
│  • 单元格数据管理                   │
│  • Canvas 渲染                      │
└─────────────────────────────────────┘
```
