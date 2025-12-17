# 默认配置

创建 ReactSheet 组件时可以自定义这些选项。以下是所有默认值：

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

## 用法

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',
        showToolbar: true,
        // ... 其他选项
      }}
    />
  );
}
```

详细说明请参阅 [配置项说明](/config/description)。
