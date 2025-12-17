# API Reference

## Overview

`@tachybase/sheet` provides a React-based spreadsheet component with the following main exports:

| Export | Type | Description |
|--------|------|-------------|
| `ReactSheet` | Component | Main spreadsheet React component |
| `useSheetStore` | Hook | Zustand store for state management |
| `useActiveSheet` | Hook | Get the current active sheet |
| `useSelection` | Hook | Get current selection |
| `useIsEditing` | Hook | Get editing state |
| `Spreadsheet` | Class | Legacy class-based API (for compatibility) |

## Quick Example

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
        Export
      </button>
    </div>
  );
}
```

## Core APIs

### [ReactSheet](/api/react-sheet)

The main React component for rendering the spreadsheet.

```tsx
<ReactSheet options={options} onChange={callback} />
```

### [useSheetStore](/api/use-sheet-store)

Zustand store hook providing all state management methods:

- Sheet management: `addSheet`, `deleteSheet`, `switchSheet`, `renameSheet`
- Cell operations: `setCellText`, `setCellStyle`, `setSelection`
- Editing: `startEditing`, `stopEditing`
- History: `undo`, `redo`
- Clipboard: `copy`, `cut`, `paste`
- Data: `loadData`, `getData`

### [DataProxy](/api/data_proxy)

Internal class managing sheet data. Accessed via `getActiveSheet()`.

### [Types](/api/types)

TypeScript type definitions for all interfaces.

## Architecture

```
┌─────────────────────────────────────┐
│  ReactSheet (UI Layer)              │
│  • Toolbar, Editor, ContextMenu     │
│  • SelectionOverlay, Bottombar      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  useSheetStore (State Layer)        │
│  • Zustand store                    │
│  • State & actions                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  DataProxy (Data Layer)             │
│  • Cell data management             │
│  • Canvas rendering                 │
└─────────────────────────────────────┘
```
