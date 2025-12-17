# ReactSheet

The main React component for rendering the spreadsheet.

## Import

```tsx
import { ReactSheet } from '@tachybase/sheet';
```

## Usage

```tsx
function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',
        showToolbar: true,
      }}
      onChange={(data) => console.log(data)}
    />
  );
}
```

## Props

### `options`

Type: `Options`

Configuration options for the spreadsheet.

```tsx
interface Options {
  mode?: 'edit' | 'read';         // Edit mode or read-only mode
  showToolbar?: boolean;          // Show toolbar (default: true)
  showGrid?: boolean;             // Show grid lines (default: true)
  showContextmenu?: boolean;      // Enable right-click menu (default: true)
  showBottomBar?: boolean;        // Show sheet tabs (default: true)
  autoFocus?: boolean;            // Auto focus on mount
  view?: {
    height: () => number;         // View height function
    width: () => number;          // View width function
  };
  row?: {
    len: number;                  // Number of rows
    height: number;               // Default row height
  };
  col?: {
    len: number;                  // Number of columns
    width: number;                // Default column width
    indexWidth: number;           // Row index column width
    minWidth: number;             // Minimum column width
  };
  style?: {
    bgcolor: string;              // Default background color
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    textwrap: boolean;
    strike: boolean;
    underline: boolean;
    color: string;                // Default text color
    font: {
      name: string;               // Font family
      size: number;               // Font size
      bold: boolean;
      italic: boolean;
    };
  };
  extendToolbar?: {               // Custom toolbar buttons
    left?: ExtendToolbarOption[];
    right?: ExtendToolbarOption[];
  };
}
```

### `onChange`

Type: `(data: SheetDataInput[]) => void`

Callback function triggered when sheet data changes.

```tsx
<ReactSheet
  onChange={(data) => {
    // data is an array of sheet data
    console.log('Sheet changed:', data);
    // Save to backend, etc.
  }}
/>
```

## Examples

### Read-only Mode

```tsx
<ReactSheet options={{ mode: 'read' }} />
```

### Custom View Size

```tsx
<ReactSheet
  options={{
    view: {
      height: () => 600,
      width: () => 800,
    },
  }}
/>
```

### Custom Default Style

```tsx
<ReactSheet
  options={{
    style: {
      bgcolor: '#f5f5f5',
      align: 'center',
      valign: 'middle',
      font: {
        name: 'Arial',
        size: 12,
        bold: false,
        italic: false,
      },
      color: '#333333',
      textwrap: false,
      strike: false,
      underline: false,
    },
  }}
/>
```

### Without Toolbar

```tsx
<ReactSheet
  options={{
    showToolbar: false,
    showBottomBar: false,
  }}
/>
```
