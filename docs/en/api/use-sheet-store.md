# useSheetStore

Zustand store hook for managing spreadsheet state and operations.

## Import

```tsx
import { useSheetStore } from '@tachybase/sheet';
```

## Basic Usage

```tsx
function MyComponent() {
  const {
    loadData,
    getData,
    setCellText,
    undo,
    redo,
  } = useSheetStore();

  // Use the methods...
}
```

## State Properties

| Property | Type | Description |
|----------|------|-------------|
| `sheets` | `DataProxy[]` | Array of all sheets |
| `activeSheetIndex` | `number` | Index of active sheet |
| `isEditing` | `boolean` | Whether a cell is being edited |
| `editingCell` | `{ ri: number; ci: number } \| null` | Currently editing cell |
| `editingText` | `string` | Text in the editor |
| `contextMenuPosition` | `{ x: number; y: number } \| null` | Context menu position |
| `showContextMenu` | `boolean` | Whether context menu is visible |
| `updateCount` | `number` | Counter for triggering re-renders |

## Computed Properties

### `getActiveSheet()`

Returns the currently active `DataProxy` instance.

```tsx
const { getActiveSheet } = useSheetStore();
const sheet = getActiveSheet();
```

### `getSelection()`

Returns the current selection range.

```tsx
const { getSelection } = useSheetStore();
const selection = getSelection();
// { sri, sci, eri, eci }
```

## Sheet Management

### `addSheet(name?, active?)`

Add a new sheet.

```tsx
const { addSheet } = useSheetStore();
addSheet('New Sheet', true); // name, active
```

### `deleteSheet(index)`

Delete a sheet by index.

```tsx
const { deleteSheet } = useSheetStore();
deleteSheet(0);
```

### `switchSheet(index)`

Switch to a sheet by index.

```tsx
const { switchSheet } = useSheetStore();
switchSheet(1);
```

### `renameSheet(index, name)`

Rename a sheet.

```tsx
const { renameSheet } = useSheetStore();
renameSheet(0, 'Sales Data');
```

## Cell Operations

### `setCellText(ri, ci, text, state?)`

Set text content of a cell.

```tsx
const { setCellText } = useSheetStore();
setCellText(0, 0, 'Hello'); // row 0, col 0
setCellText(1, 2, 'World', 'finished'); // with state
```

### `setCellStyle(property, value)`

Set style for selected cells.

```tsx
const { setCellStyle } = useSheetStore();
setCellStyle('bold', true);
setCellStyle('bgcolor', '#ffff00');
setCellStyle('align', 'center');
setCellStyle('font-size', 14);
```

### `setSelection(ri, ci, multiple?)`

Set selection to a cell.

```tsx
const { setSelection } = useSheetStore();
setSelection(0, 0);       // Single cell
setSelection(5, 5, true); // Extend selection
```

### `setSelectionEnd(ri, ci)`

Set the end point of a selection range.

```tsx
const { setSelectionEnd } = useSheetStore();
setSelectionEnd(10, 10);
```

## Editing Operations

### `startEditing(initialChar?)`

Start editing the selected cell.

```tsx
const { startEditing } = useSheetStore();
startEditing();       // Edit existing content
startEditing('A');    // Start with character 'A'
```

### `stopEditing()`

Stop editing and save content.

```tsx
const { stopEditing } = useSheetStore();
stopEditing();
```

### `setEditingText(text)`

Update the text in the editor.

```tsx
const { setEditingText } = useSheetStore();
setEditingText('New content');
```

## Context Menu

### `openContextMenu(x, y)`

Open context menu at position.

```tsx
const { openContextMenu } = useSheetStore();
openContextMenu(100, 200);
```

### `closeContextMenu()`

Close context menu.

```tsx
const { closeContextMenu } = useSheetStore();
closeContextMenu();
```

## History Operations

### `undo()`

Undo the last operation.

```tsx
const { undo } = useSheetStore();
undo();
```

### `redo()`

Redo the last undone operation.

```tsx
const { redo } = useSheetStore();
redo();
```

## Clipboard Operations

### `copy()`

Copy selected cells.

```tsx
const { copy } = useSheetStore();
copy();
```

### `cut()`

Cut selected cells.

```tsx
const { cut } = useSheetStore();
cut();
```

### `paste(what?)`

Paste from clipboard.

```tsx
const { paste } = useSheetStore();
paste();           // Paste all
paste('text');     // Paste text only
paste('format');   // Paste format only
```

## Data Operations

### `loadData(data)`

Load data into the spreadsheet.

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

Get current spreadsheet data.

```tsx
const { getData } = useSheetStore();
const data = getData();
console.log(JSON.stringify(data));
```

### `triggerChange()`

Manually trigger change event.

```tsx
const { triggerChange } = useSheetStore();
triggerChange();
```

## Event Listeners

### `addChangeListener(listener)`

Add a change listener.

```tsx
const { addChangeListener } = useSheetStore();
addChangeListener((data) => {
  console.log('Data changed:', data);
});
```

### `removeChangeListener(listener)`

Remove a change listener.

```tsx
const { removeChangeListener } = useSheetStore();
removeChangeListener(myListener);
```

## Convenience Hooks

### `useActiveSheet()`

Get the active sheet directly.

```tsx
import { useActiveSheet } from '@tachybase/sheet';

const sheet = useActiveSheet();
```

### `useSelection()`

Get the current selection.

```tsx
import { useSelection } from '@tachybase/sheet';

const selection = useSelection();
```

### `useIsEditing()`

Check if currently editing.

```tsx
import { useIsEditing } from '@tachybase/sheet';

const isEditing = useIsEditing();
```

### `useUpdateCount()`

Get update count for re-render tracking.

```tsx
import { useUpdateCount } from '@tachybase/sheet';

const updateCount = useUpdateCount();
```
