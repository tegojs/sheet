# useSheetStore

用于管理电子表格状态和操作的 Zustand store hook。

## 导入

```tsx
import { useSheetStore } from '@tachybase/sheet';
```

## 基本用法

```tsx
function MyComponent() {
  const {
    loadData,
    getData,
    setCellText,
    undo,
    redo,
  } = useSheetStore();

  // 使用这些方法...
}
```

## 状态属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `sheets` | `DataProxy[]` | 所有表格数组 |
| `activeSheetIndex` | `number` | 当前活动表格索引 |
| `isEditing` | `boolean` | 是否正在编辑单元格 |
| `editingCell` | `{ ri: number; ci: number } \| null` | 正在编辑的单元格 |
| `editingText` | `string` | 编辑器中的文本 |
| `contextMenuPosition` | `{ x: number; y: number } \| null` | 右键菜单位置 |
| `showContextMenu` | `boolean` | 右键菜单是否可见 |
| `updateCount` | `number` | 用于触发重渲染的计数器 |

## 计算属性

### `getActiveSheet()`

返回当前活动的 `DataProxy` 实例。

```tsx
const { getActiveSheet } = useSheetStore();
const sheet = getActiveSheet();
```

### `getSelection()`

返回当前选区范围。

```tsx
const { getSelection } = useSheetStore();
const selection = getSelection();
// { sri, sci, eri, eci }
```

## 表格管理

### `addSheet(name?, active?)`

添加新表格。

```tsx
const { addSheet } = useSheetStore();
addSheet('新表格', true); // 名称, 是否激活
```

### `deleteSheet(index)`

按索引删除表格。

```tsx
const { deleteSheet } = useSheetStore();
deleteSheet(0);
```

### `switchSheet(index)`

按索引切换表格。

```tsx
const { switchSheet } = useSheetStore();
switchSheet(1);
```

### `renameSheet(index, name)`

重命名表格。

```tsx
const { renameSheet } = useSheetStore();
renameSheet(0, '销售数据');
```

## 单元格操作

### `setCellText(ri, ci, text, state?)`

设置单元格文本内容。

```tsx
const { setCellText } = useSheetStore();
setCellText(0, 0, 'Hello'); // 第 0 行, 第 0 列
setCellText(1, 2, 'World', 'finished'); // 带状态
```

### `setCellStyle(property, value)`

设置选中单元格的样式。

```tsx
const { setCellStyle } = useSheetStore();
setCellStyle('bold', true);
setCellStyle('bgcolor', '#ffff00');
setCellStyle('align', 'center');
setCellStyle('font-size', 14);
```

### `setSelection(ri, ci, multiple?)`

设置选中单元格。

```tsx
const { setSelection } = useSheetStore();
setSelection(0, 0);       // 单个单元格
setSelection(5, 5, true); // 扩展选区
```

### `setSelectionEnd(ri, ci)`

设置选区的结束点。

```tsx
const { setSelectionEnd } = useSheetStore();
setSelectionEnd(10, 10);
```

## 编辑操作

### `startEditing(initialChar?)`

开始编辑选中的单元格。

```tsx
const { startEditing } = useSheetStore();
startEditing();       // 编辑现有内容
startEditing('A');    // 以字符 'A' 开始
```

### `stopEditing()`

停止编辑并保存内容。

```tsx
const { stopEditing } = useSheetStore();
stopEditing();
```

### `setEditingText(text)`

更新编辑器中的文本。

```tsx
const { setEditingText } = useSheetStore();
setEditingText('新内容');
```

## 右键菜单

### `openContextMenu(x, y)`

在指定位置打开右键菜单。

```tsx
const { openContextMenu } = useSheetStore();
openContextMenu(100, 200);
```

### `closeContextMenu()`

关闭右键菜单。

```tsx
const { closeContextMenu } = useSheetStore();
closeContextMenu();
```

## 历史操作

### `undo()`

撤销上一次操作。

```tsx
const { undo } = useSheetStore();
undo();
```

### `redo()`

重做上一次撤销的操作。

```tsx
const { redo } = useSheetStore();
redo();
```

## 剪贴板操作

### `copy()`

复制选中单元格。

```tsx
const { copy } = useSheetStore();
copy();
```

### `cut()`

剪切选中单元格。

```tsx
const { cut } = useSheetStore();
cut();
```

### `paste(what?)`

从剪贴板粘贴。

```tsx
const { paste } = useSheetStore();
paste();           // 粘贴全部
paste('text');     // 仅粘贴文本
paste('format');   // 仅粘贴格式
```

## 数据操作

### `loadData(data)`

加载数据到电子表格。

```tsx
const { loadData } = useSheetStore();
loadData([
  {
    name: 'Sheet1',
    rows: {
      0: { cells: { 0: { text: 'A1' } } },
    },
  },
]);
```

### `getData()`

获取当前电子表格数据。

```tsx
const { getData } = useSheetStore();
const data = getData();
console.log(JSON.stringify(data));
```

### `triggerChange()`

手动触发变更事件。

```tsx
const { triggerChange } = useSheetStore();
triggerChange();
```

## 事件监听

### `addChangeListener(listener)`

添加变更监听器。

```tsx
const { addChangeListener } = useSheetStore();
addChangeListener((data) => {
  console.log('数据变化:', data);
});
```

### `removeChangeListener(listener)`

移除变更监听器。

```tsx
const { removeChangeListener } = useSheetStore();
removeChangeListener(myListener);
```

## 便捷 Hooks

### `useActiveSheet()`

直接获取活动表格。

```tsx
import { useActiveSheet } from '@tachybase/sheet';

const sheet = useActiveSheet();
```

### `useSelection()`

获取当前选区。

```tsx
import { useSelection } from '@tachybase/sheet';

const selection = useSelection();
```

### `useIsEditing()`

检查是否正在编辑。

```tsx
import { useIsEditing } from '@tachybase/sheet';

const isEditing = useIsEditing();
```

### `useUpdateCount()`

获取更新计数用于重渲染追踪。

```tsx
import { useUpdateCount } from '@tachybase/sheet';

const updateCount = useUpdateCount();
```
