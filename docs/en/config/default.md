# Default Configuration

You can customize these options when creating a ReactSheet component. Below are all the default values:

```typescript
{
  mode: 'edit',              // 'edit' | 'read'
  showToolbar: true,
  showGrid: true,
  showContextmenu: true,
  showBottomBar: true,
  view: {
    height: () => 600,
    width: () => 800,
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
}
```

## Usage

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',
        showToolbar: true,
        // ... other options
      }}
    />
  );
}
```

See [Configuration Options](/config/description) for detailed explanations of each option.
