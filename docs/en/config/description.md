# Configuration Options

These options can be passed to the ReactSheet component's `options` prop.

## Mode

Switch between read-only and edit mode.

```tsx
<ReactSheet options={{ mode: 'edit' }} />  // Edit mode (default)
<ReactSheet options={{ mode: 'read' }} />  // Read-only mode
```

## UI Toggles

### Toolbar

Show or hide the toolbar. Default: `true`

```tsx
<ReactSheet options={{ showToolbar: false }} />
```

### Bottom Bar

Show or hide the sheet tabs at the bottom. Default: `true`

```tsx
<ReactSheet options={{ showBottomBar: false }} />
```

### Grid Lines

Show or hide the grid lines. Default: `true`

```tsx
<ReactSheet options={{ showGrid: false }} />
```

### Context Menu

Enable or disable the right-click context menu. Default: `true`

```tsx
<ReactSheet options={{ showContextmenu: false }} />
```

## View Size

Set the spreadsheet dimensions using functions that return width/height.

```tsx
<ReactSheet
  options={{
    view: {
      height: () => 600,                              // Fixed height
      width: () => document.documentElement.clientWidth,  // Full width
    },
  }}
/>
```

## Row Configuration

Configure default row settings.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `len` | `number` | `100` | Number of rows |
| `height` | `number` | `25` | Default row height in pixels |

```tsx
<ReactSheet
  options={{
    row: {
      len: 200,    // 200 rows
      height: 30,  // 30px row height
    },
  }}
/>
```

## Column Configuration

Configure default column settings.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `len` | `number` | `26` | Number of columns (A-Z) |
| `width` | `number` | `100` | Default column width |
| `indexWidth` | `number` | `60` | Width of row index column |
| `minWidth` | `number` | `60` | Minimum column width |

```tsx
<ReactSheet
  options={{
    col: {
      len: 52,        // A-AZ (52 columns)
      width: 120,     // Default width 120px
      indexWidth: 50, // Row index width
      minWidth: 50,   // Minimum width
    },
  }}
/>
```

## Default Style

Set the default cell style for all cells.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bgcolor` | `string` | `'#ffffff'` | Background color |
| `align` | `string` | `'left'` | Horizontal alignment: `'left'`, `'center'`, `'right'` |
| `valign` | `string` | `'middle'` | Vertical alignment: `'top'`, `'middle'`, `'bottom'` |
| `textwrap` | `boolean` | `false` | Enable text wrapping |
| `strike` | `boolean` | `false` | Strikethrough text |
| `underline` | `boolean` | `false` | Underline text |
| `color` | `string` | `'#0a0a0a'` | Text color |
| `font.name` | `string` | `'Helvetica'` | Font family |
| `font.size` | `number` | `10` | Font size |
| `font.bold` | `boolean` | `false` | Bold text |
| `font.italic` | `boolean` | `false` | Italic text |

```tsx
<ReactSheet
  options={{
    style: {
      bgcolor: '#f5f5f5',
      align: 'center',
      valign: 'middle',
      textwrap: true,
      strike: false,
      underline: false,
      color: '#333333',
      font: {
        name: 'Arial',
        size: 12,
        bold: false,
        italic: false,
      },
    },
  }}
/>
```

## Complete Example

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',
        showToolbar: true,
        showBottomBar: true,
        showGrid: true,
        showContextmenu: true,
        view: {
          height: () => window.innerHeight - 100,
          width: () => window.innerWidth,
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
      }}
      onChange={(data) => console.log('Data changed:', data)}
    />
  );
}
```
