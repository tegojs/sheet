# Quick Start

## Installation

```bash
pnpm install @tego/sheet
```

## Basic Usage

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return <ReactSheet />;
}
```

## Configuration Options

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',           // 'edit' | 'read'
        showToolbar: true,      // Show toolbar
        showBottomBar: true,    // Show sheet tabs
        showGrid: true,         // Show grid lines
        showContextmenu: true,  // Enable right-click menu
      }}
    />
  );
}
```

## Load Data

```tsx
import { ReactSheet, useSheetStore } from '@tego/sheet';
import { useEffect } from 'react';

function App() {
  const { loadData } = useSheetStore();

  useEffect(() => {
    loadData([
      {
        name: 'Sheet1',
        rows: {
          0: { cells: { 0: { text: 'Name' }, 1: { text: 'Age' } } },
          1: { cells: { 0: { text: 'Alice' }, 1: { text: '25' } } },
          2: { cells: { 0: { text: 'Bob' }, 1: { text: '30' } } },
        },
      },
    ]);
  }, []);

  return <ReactSheet />;
}
```

## Get Data

```tsx
import { useSheetStore } from '@tego/sheet';

function ExportButton() {
  const { getData } = useSheetStore();

  const handleExport = () => {
    const data = getData();
    console.log(JSON.stringify(data, null, 2));
  };

  return <button onClick={handleExport}>Export Data</button>;
}
```

## Listen to Changes

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  const handleChange = (data) => {
    console.log('Sheet data changed:', data);
    // Save to backend, etc.
  };

  return <ReactSheet onChange={handleChange} />;
}
```

## Programmatic Cell Operations

```tsx
import { useSheetStore } from '@tego/sheet';

function Controls() {
  const { setCellText, setCellStyle } = useSheetStore();

  const updateCell = () => {
    // Set cell A1 (row 0, col 0) text
    setCellText(0, 0, 'Hello World');
  };

  const styleCell = () => {
    // Set style for selected cells
    setCellStyle('bold', true);
    setCellStyle('bgcolor', '#ffff00');
  };

  return (
    <div>
      <button onClick={updateCell}>Update Cell</button>
      <button onClick={styleCell}>Style Cell</button>
    </div>
  );
}
```

## Next Steps

- [API Reference](/api/introduction) - Complete API documentation
- [ReactSheet Component](/api/react-sheet) - Component props and options
- [useSheetStore Hook](/api/use-sheet-store) - State management methods
