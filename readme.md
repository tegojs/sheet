# TegoSheet (@tego/sheet)

A high-performance spreadsheet component for React, combining React's declarative UI with Canvas rendering.

## Installation

```bash
pnpm install @tego/sheet
```

## Quick Start

### Basic Usage

```tsx
import { TegoSheet } from '@tego/sheet';

function App() {
  return <TegoSheet />;
}
```

### With Options

```tsx
<TegoSheet
  options={{
    mode: 'edit',        // 'edit' | 'read'
    showToolbar: true,
    showBottomBar: true,
    showGrid: true,
  }}
/>
```

### Load Data

```tsx
import { TegoSheet, useSheetStore } from '@tego/sheet';
import { useEffect } from 'react';

function App() {
  const { loadData } = useSheetStore();

  useEffect(() => {
    loadData([
      {
        name: 'Sheet1',
        rows: {
          0: { cells: { 0: { text: 'A1' }, 1: { text: 'B1' } } },
          1: { cells: { 0: { text: 'A2' }, 1: { text: 'B2' } } },
        },
      },
    ]);
  }, []);

  return <TegoSheet />;
}
```

### Listen to Changes

```tsx
<TegoSheet
  onChange={(data) => {
    console.log('Sheet data changed:', data);
  }}
/>
```

## Documentation

See [docs](./docs) for full API documentation.

## License

MIT
