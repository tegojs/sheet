# DataProxy

电子表格操作的核心数据管理类。通过 `useSheetStore` 访问。

## 访问方式

```tsx
import { useSheetStore } from '@tego/sheet';

const { getActiveSheet } = useSheetStore();
const dataProxy = getActiveSheet();
```

## 单元格操作

### `getCell(ri, ci)`

通过行列索引获取单元格数据。

```tsx
const cell = dataProxy.getCell(0, 0);
// { text: 'Hello', style: 0, merge: [1, 1] }
```

### `getCellTextOrDefault(ri, ci)`

获取单元格文本或默认值。

```tsx
const text = dataProxy.getCellTextOrDefault(0, 0);
```

### `getCellStyle(ri, ci)`

获取单元格样式。

```tsx
const style = dataProxy.getCellStyle(0, 0);
```

### `getCellStyleOrDefault(ri, ci)`

获取单元格样式或默认样式。

```tsx
const style = dataProxy.getCellStyleOrDefault(0, 0);
```

### `setCellText(ri, ci, text, state)`

设置单元格文本。

- `ri`: 行索引
- `ci`: 列索引
- `text`: 文本内容
- `state`: `'input'` 或 `'finished'`

```tsx
dataProxy.setCellText(0, 0, 'Hello', 'finished');
```

### `getSelectedCell()`

获取当前选中的单元格。

```tsx
const cell = dataProxy.getSelectedCell();
```

### `getSelectedCellStyle()`

获取选中单元格的样式。

```tsx
const style = dataProxy.getSelectedCellStyle();
```

### `setSelectedCellAttr(property, value)`

设置选中单元格的属性。

```tsx
dataProxy.setSelectedCellAttr('bold', true);
dataProxy.setSelectedCellAttr('bgcolor', '#ffff00');
```

### `setSelectedCellText(text, state)`

设置选中单元格的文本。

```tsx
dataProxy.setSelectedCellText('Hello', 'finished');
```

## 选区操作

### `calSelectedRangeByStart(ri, ci)`

通过起始位置计算选区范围。

```tsx
dataProxy.calSelectedRangeByStart(0, 0);
```

### `calSelectedRangeByEnd(ri, ci)`

通过结束位置计算选区范围。

```tsx
dataProxy.calSelectedRangeByEnd(5, 5);
```

### `isSignleSelected()`

检查是否只选中了单个单元格。

```tsx
const isSingle = dataProxy.isSignleSelected();
```

### `getSelectedRect()`

获取选中的矩形区域。

```tsx
const rect = dataProxy.getSelectedRect();
```

### `xyInSelectedRect(x, y)`

检查坐标是否在选中区域内。

```tsx
const isInside = dataProxy.xyInSelectedRect(100, 200);
```

### `getCellRectByXY(x, y)`

通过坐标获取单元格矩形。

```tsx
const rect = dataProxy.getCellRectByXY(100, 200);
```

## 剪贴板

### `copy()`

复制选中单元格。

```tsx
dataProxy.copy();
```

### `copyToSystemClipboard()`

复制到系统剪贴板。

```tsx
dataProxy.copyToSystemClipboard();
```

### `cut()`

剪切选中单元格。

```tsx
dataProxy.cut();
```

### `paste(what, error)`

从剪贴板粘贴。

- `what`: `'all'`、`'text'` 或 `'format'`
- `error`: 错误回调函数

```tsx
dataProxy.paste('all', (msg) => console.error(msg));
```

### `pasteFromText(txt)`

粘贴文本。

```tsx
dataProxy.pasteFromText('Hello\tWorld');
```

### `clearClipboard()`

清除剪贴板。

```tsx
dataProxy.clearClipboard();
```

### `getClipboardRect()`

获取剪贴板选区矩形。

```tsx
const rect = dataProxy.getClipboardRect();
```

## 合并单元格

### `merge()`

合并选中单元格。

```tsx
dataProxy.merge();
```

### `unmerge()`

取消合并选中单元格。

```tsx
dataProxy.unmerge();
```

### `canUnmerge()`

检查是否可以取消合并。

```tsx
const canUnmerge = dataProxy.canUnmerge();
```

## 历史记录

### `undo()`

撤销上一次操作。

```tsx
dataProxy.undo();
```

### `redo()`

重做上一次撤销的操作。

```tsx
dataProxy.redo();
```

### `canUndo()`

检查是否可以撤销。

```tsx
const canUndo = dataProxy.canUndo();
```

### `canRedo()`

检查是否可以重做。

```tsx
const canRedo = dataProxy.canRedo();
```

## 行列操作

### `setRowHeight(ri, height)`

设置行高。

```tsx
dataProxy.setRowHeight(0, 50);
```

### `setColWidth(ci, width)`

设置列宽。

```tsx
dataProxy.setColWidth(0, 150);
```

### `insert(type, n)`

插入行或列。

- `type`: `'row'` 或 `'column'`
- `n`: 插入数量

```tsx
dataProxy.insert('row', 1);
dataProxy.insert('column', 2);
```

### `delete(type)`

删除选中的行或列。

```tsx
dataProxy.delete('row');
dataProxy.delete('column');
```

### `hideRowsOrCols()`

隐藏选中的行或列。

```tsx
dataProxy.hideRowsOrCols();
```

### `unhideRowsOrCols(type, index)`

取消隐藏行或列。

```tsx
dataProxy.unhideRowsOrCols('row', 5);
```

## 冻结窗格

### `setFreeze(ri, ci)`

设置冻结窗格。

```tsx
dataProxy.setFreeze(1, 1); // 冻结第一行和第一列
```

### `freezeIsActive()`

检查冻结是否激活。

```tsx
const isActive = dataProxy.freezeIsActive();
```

### `freezeTotalWidth()`

获取冻结区域宽度。

```tsx
const width = dataProxy.freezeTotalWidth();
```

### `freezeTotalHeight()`

获取冻结区域高度。

```tsx
const height = dataProxy.freezeTotalHeight();
```

## 筛选

### `autofilter()`

切换自动筛选。

```tsx
dataProxy.autofilter();
```

### `canAutofilter()`

检查是否可以应用自动筛选。

```tsx
const can = dataProxy.canAutofilter();
```

### `setAutoFilter(ci, order, operator, value)`

设置自动筛选选项。

```tsx
dataProxy.setAutoFilter(0, 'asc', 'eq', 'value');
```

### `resetAutoFilter()`

重置自动筛选。

```tsx
dataProxy.resetAutoFilter();
```

## 数据验证

### `addValidation(mode, ref, validator)`

添加验证规则。

```tsx
dataProxy.addValidation('stop', 'A1:B10', validator);
```

### `removeValidation()`

从选中范围移除验证。

```tsx
dataProxy.removeValidation();
```

### `getSelectedValidator()`

获取选中范围的验证器。

```tsx
const validator = dataProxy.getSelectedValidator();
```

### `getSelectedValidation()`

获取选中范围的验证信息。

```tsx
const validation = dataProxy.getSelectedValidation();
```

## 视图

### `viewWidth()`

获取视图宽度。

```tsx
const width = dataProxy.viewWidth();
```

### `viewHeight()`

获取视图高度。

```tsx
const height = dataProxy.viewHeight();
```

### `viewRange()`

获取可见范围。

```tsx
const range = dataProxy.viewRange();
```

### `freezeViewRange()`

获取冻结视图范围。

```tsx
const range = dataProxy.freezeViewRange();
```

### `contentRange()`

获取内容范围。

```tsx
const range = dataProxy.contentRange();
```

## 滚动

### `scrollx(x, cb)`

水平滚动。

```tsx
dataProxy.scrollx(100, () => console.log('已滚动'));
```

### `scrolly(y, cb)`

垂直滚动。

```tsx
dataProxy.scrolly(100, () => console.log('已滚动'));
```

## 数据

### `setData(d)`

设置表格数据。

```tsx
dataProxy.setData({
  name: 'Sheet1',
  rows: { /* ... */ },
});
```

### `getData()`

获取表格数据。

```tsx
const data = dataProxy.getData();
```

### `changeData(cb)`

设置变更回调。

```tsx
dataProxy.changeData((data) => {
  console.log('数据变化:', data);
});
```

## 样式

### `defaultStyle()`

获取默认样式。

```tsx
const style = dataProxy.defaultStyle();
```

### `addStyle(nstyle)`

添加样式到样式数组。

```tsx
const styleIndex = dataProxy.addStyle({
  bold: true,
  bgcolor: '#ffff00',
});
```

## 工具方法

### `cellRect(ri, ci)`

获取单元格矩形信息。

```tsx
const rect = dataProxy.cellRect(0, 0);
// { left, top, width, height }
```

### `getRect(cellRange)`

获取单元格范围的矩形。

```tsx
const rect = dataProxy.getRect(cellRange);
```

### `rowEach(min, max, cb)`

遍历行。

```tsx
dataProxy.rowEach(0, 10, (ri, row) => {
  console.log(ri, row);
});
```

### `colEach(min, max, cb)`

遍历列。

```tsx
dataProxy.colEach(0, 10, (ci, col) => {
  console.log(ci, col);
});
```

### `eachMergesInView(viewRange, cb)`

遍历视图中的合并单元格。

```tsx
dataProxy.eachMergesInView(viewRange, (merge) => {
  console.log(merge);
});
```
