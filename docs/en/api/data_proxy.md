# DataProxy

The core data management class for spreadsheet operations. Access via `useSheetStore`.

## Access

```tsx
import { useSheetStore } from '@tachybase/sheet';

const { getActiveSheet } = useSheetStore();
const dataProxy = getActiveSheet();
```

## Cell Operations

### `getCell(ri, ci)`

Get cell data by row and column index.

```tsx
const cell = dataProxy.getCell(0, 0);
// { text: 'Hello', style: 0, merge: [1, 1] }
```

### `getCellTextOrDefault(ri, ci)`

Get cell text or default value.

```tsx
const text = dataProxy.getCellTextOrDefault(0, 0);
```

### `getCellStyle(ri, ci)`

Get cell style.

```tsx
const style = dataProxy.getCellStyle(0, 0);
```

### `getCellStyleOrDefault(ri, ci)`

Get cell style or default.

```tsx
const style = dataProxy.getCellStyleOrDefault(0, 0);
```

### `setCellText(ri, ci, text, state)`

Set cell text.

- `ri`: Row index
- `ci`: Column index
- `text`: Text content
- `state`: `'input'` or `'finished'`

```tsx
dataProxy.setCellText(0, 0, 'Hello', 'finished');
```

### `getSelectedCell()`

Get currently selected cell.

```tsx
const cell = dataProxy.getSelectedCell();
```

### `getSelectedCellStyle()`

Get style of selected cell.

```tsx
const style = dataProxy.getSelectedCellStyle();
```

### `setSelectedCellAttr(property, value)`

Set attribute for selected cells.

```tsx
dataProxy.setSelectedCellAttr('bold', true);
dataProxy.setSelectedCellAttr('bgcolor', '#ffff00');
```

### `setSelectedCellText(text, state)`

Set text for selected cell.

```tsx
dataProxy.setSelectedCellText('Hello', 'finished');
```

## Selection

### `calSelectedRangeByStart(ri, ci)`

Calculate selection range from start position.

```tsx
dataProxy.calSelectedRangeByStart(0, 0);
```

### `calSelectedRangeByEnd(ri, ci)`

Calculate selection range by end position.

```tsx
dataProxy.calSelectedRangeByEnd(5, 5);
```

### `isSignleSelected()`

Check if single cell is selected.

```tsx
const isSingle = dataProxy.isSignleSelected();
```

### `getSelectedRect()`

Get selected rectangle area.

```tsx
const rect = dataProxy.getSelectedRect();
```

### `xyInSelectedRect(x, y)`

Check if coordinates are within selected area.

```tsx
const isInside = dataProxy.xyInSelectedRect(100, 200);
```

### `getCellRectByXY(x, y)`

Get cell rectangle by coordinates.

```tsx
const rect = dataProxy.getCellRectByXY(100, 200);
```

## Clipboard

### `copy()`

Copy selected cells.

```tsx
dataProxy.copy();
```

### `copyToSystemClipboard()`

Copy to system clipboard.

```tsx
dataProxy.copyToSystemClipboard();
```

### `cut()`

Cut selected cells.

```tsx
dataProxy.cut();
```

### `paste(what, error)`

Paste from clipboard.

- `what`: `'all'`, `'text'`, or `'format'`
- `error`: Error callback function

```tsx
dataProxy.paste('all', (msg) => console.error(msg));
```

### `pasteFromText(txt)`

Paste text.

```tsx
dataProxy.pasteFromText('Hello\tWorld');
```

### `clearClipboard()`

Clear clipboard.

```tsx
dataProxy.clearClipboard();
```

### `getClipboardRect()`

Get clipboard selection rectangle.

```tsx
const rect = dataProxy.getClipboardRect();
```

## Merge

### `merge()`

Merge selected cells.

```tsx
dataProxy.merge();
```

### `unmerge()`

Unmerge selected cells.

```tsx
dataProxy.unmerge();
```

### `canUnmerge()`

Check if can unmerge.

```tsx
const canUnmerge = dataProxy.canUnmerge();
```

## History

### `undo()`

Undo last operation.

```tsx
dataProxy.undo();
```

### `redo()`

Redo last undone operation.

```tsx
dataProxy.redo();
```

### `canUndo()`

Check if can undo.

```tsx
const canUndo = dataProxy.canUndo();
```

### `canRedo()`

Check if can redo.

```tsx
const canRedo = dataProxy.canRedo();
```

## Row & Column

### `setRowHeight(ri, height)`

Set row height.

```tsx
dataProxy.setRowHeight(0, 50);
```

### `setColWidth(ci, width)`

Set column width.

```tsx
dataProxy.setColWidth(0, 150);
```

### `insert(type, n)`

Insert rows or columns.

- `type`: `'row'` or `'column'`
- `n`: Number to insert

```tsx
dataProxy.insert('row', 1);
dataProxy.insert('column', 2);
```

### `delete(type)`

Delete selected rows or columns.

```tsx
dataProxy.delete('row');
dataProxy.delete('column');
```

### `hideRowsOrCols()`

Hide selected rows or columns.

```tsx
dataProxy.hideRowsOrCols();
```

### `unhideRowsOrCols(type, index)`

Unhide rows or columns.

```tsx
dataProxy.unhideRowsOrCols('row', 5);
```

## Freeze

### `setFreeze(ri, ci)`

Set freeze panes.

```tsx
dataProxy.setFreeze(1, 1); // Freeze first row and column
```

### `freezeIsActive()`

Check if freeze is active.

```tsx
const isActive = dataProxy.freezeIsActive();
```

### `freezeTotalWidth()`

Get frozen area width.

```tsx
const width = dataProxy.freezeTotalWidth();
```

### `freezeTotalHeight()`

Get frozen area height.

```tsx
const height = dataProxy.freezeTotalHeight();
```

## Filter

### `autofilter()`

Toggle auto-filter.

```tsx
dataProxy.autofilter();
```

### `canAutofilter()`

Check if can apply auto-filter.

```tsx
const can = dataProxy.canAutofilter();
```

### `setAutoFilter(ci, order, operator, value)`

Set auto-filter options.

```tsx
dataProxy.setAutoFilter(0, 'asc', 'eq', 'value');
```

### `resetAutoFilter()`

Reset auto-filter.

```tsx
dataProxy.resetAutoFilter();
```

## Validation

### `addValidation(mode, ref, validator)`

Add validation rule.

```tsx
dataProxy.addValidation('stop', 'A1:B10', validator);
```

### `removeValidation()`

Remove validation from selected range.

```tsx
dataProxy.removeValidation();
```

### `getSelectedValidator()`

Get validator for selected range.

```tsx
const validator = dataProxy.getSelectedValidator();
```

### `getSelectedValidation()`

Get validation info for selected range.

```tsx
const validation = dataProxy.getSelectedValidation();
```

## View

### `viewWidth()`

Get view width.

```tsx
const width = dataProxy.viewWidth();
```

### `viewHeight()`

Get view height.

```tsx
const height = dataProxy.viewHeight();
```

### `viewRange()`

Get visible range.

```tsx
const range = dataProxy.viewRange();
```

### `freezeViewRange()`

Get frozen view range.

```tsx
const range = dataProxy.freezeViewRange();
```

### `contentRange()`

Get content range.

```tsx
const range = dataProxy.contentRange();
```

## Scroll

### `scrollx(x, cb)`

Scroll horizontally.

```tsx
dataProxy.scrollx(100, () => console.log('scrolled'));
```

### `scrolly(y, cb)`

Scroll vertically.

```tsx
dataProxy.scrolly(100, () => console.log('scrolled'));
```

## Data

### `setData(d)`

Set sheet data.

```tsx
dataProxy.setData({
  name: 'Sheet1',
  rows: { /* ... */ },
});
```

### `getData()`

Get sheet data.

```tsx
const data = dataProxy.getData();
```

### `changeData(cb)`

Set change callback.

```tsx
dataProxy.changeData((data) => {
  console.log('Data changed:', data);
});
```

## Style

### `defaultStyle()`

Get default style.

```tsx
const style = dataProxy.defaultStyle();
```

### `addStyle(nstyle)`

Add style to style array.

```tsx
const styleIndex = dataProxy.addStyle({
  bold: true,
  bgcolor: '#ffff00',
});
```

## Utility

### `cellRect(ri, ci)`

Get cell rectangle info.

```tsx
const rect = dataProxy.cellRect(0, 0);
// { left, top, width, height }
```

### `getRect(cellRange)`

Get rectangle for cell range.

```tsx
const rect = dataProxy.getRect(cellRange);
```

### `rowEach(min, max, cb)`

Iterate over rows.

```tsx
dataProxy.rowEach(0, 10, (ri, row) => {
  console.log(ri, row);
});
```

### `colEach(min, max, cb)`

Iterate over columns.

```tsx
dataProxy.colEach(0, 10, (ci, col) => {
  console.log(ci, col);
});
```

### `eachMergesInView(viewRange, cb)`

Iterate merged cells in view.

```tsx
dataProxy.eachMergesInView(viewRange, (merge) => {
  console.log(merge);
});
```
