# React + Canvas 电子表格使用示例

## 基础示例

### 1. 最简单的使用方式

```tsx
import React from 'react';
import ReactSheet from '@tachybase/sheet';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactSheet />
    </div>
  );
}

export default App;
```

### 2. 带配置选项

```tsx
import React from 'react';
import ReactSheet from '@tachybase/sheet';

function App() {
  const options = {
    mode: 'edit', // 'edit' | 'read'
    showToolbar: true,
    showBottomBar: true,
    showGrid: true,
    view: {
      height: () => 600,
      width: () => 800,
    },
  };

  return <ReactSheet options={options} />;
}
```

### 3. 监听数据变化

```tsx
import React from 'react';
import ReactSheet from '@tachybase/sheet';

function App() {
  const handleChange = (data) => {
    console.log('数据已更改:', data);
    // 保存到服务器或本地存储
  };

  return <ReactSheet onChange={handleChange} />;
}
```

## 高级示例

### 4. 使用 Store 直接控制

```tsx
import React, { useEffect } from 'react';
import { useSheetStore } from '@tachybase/sheet';
import ReactSheet from '@tachybase/sheet';

function App() {
  const { loadData, getData, addChangeListener } = useSheetStore();

  useEffect(() => {
    // 加载初始数据
    loadData([
      {
        name: 'Sheet1',
        rows: {
          0: {
            cells: {
              0: { text: 'Name' },
              1: { text: 'Age' },
              2: { text: 'City' },
            },
          },
          1: {
            cells: {
              0: { text: 'Alice' },
              1: { text: '25' },
              2: { text: 'New York' },
            },
          },
          2: {
            cells: {
              0: { text: 'Bob' },
              1: { text: '30' },
              2: { text: 'London' },
            },
          },
        },
      },
    ]);

    // 监听变化
    const unsubscribe = addChangeListener((data) => {
      console.log('Data changed:', data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <ReactSheet />;
}
```

### 5. 自定义组件组合

```tsx
import React from 'react';
import {
  CanvasTable,
  Toolbar,
  CellEditor,
  SelectionOverlay,
  Bottombar,
  useKeyboardShortcuts,
} from '@tachybase/sheet';

function CustomSheet() {
  // 启用键盘快捷键
  useKeyboardShortcuts();

  return (
    <div className="custom-sheet">
      <Toolbar />
      <div style={{ position: 'relative', height: '500px' }}>
        <CanvasTable />
        <SelectionOverlay />
        <CellEditor />
      </div>
      <Bottombar />
    </div>
  );
}
```

### 6. 程序化操作

```tsx
import React, { useEffect } from 'react';
import { useSheetStore } from '@tachybase/sheet';
import ReactSheet from '@tachybase/sheet';

function App() {
  const {
    setCellText,
    setCellStyle,
    addSheet,
    switchSheet,
    undo,
    redo,
  } = useSheetStore();

  const handleSetCell = () => {
    // 设置单元格文本
    setCellText(0, 0, 'Hello World', 'finished');
  };

  const handleStyleCell = () => {
    // 设置单元格样式
    setCellStyle('font-bold', true);
    setCellStyle('bgcolor', '#ffff00');
  };

  const handleAddSheet = () => {
    // 添加新的 sheet
    addSheet('New Sheet', true);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleSetCell}>设置单元格</button>
        <button onClick={handleStyleCell}>设置样式</button>
        <button onClick={handleAddSheet}>添加 Sheet</button>
        <button onClick={undo}>撤销</button>
        <button onClick={redo}>重做</button>
      </div>
      <ReactSheet />
    </div>
  );
}
```

### 7. 只读模式

```tsx
import React from 'react';
import ReactSheet from '@tachybase/sheet';

function ReadOnlySheet({ data }) {
  return (
    <ReactSheet
      options={{
        mode: 'read',
        showToolbar: false,
        showBottomBar: false,
      }}
      onChange={(newData) => {
        // 只读模式下不会触发
      }}
    />
  );
}
```

### 8. 与表单集成

```tsx
import React, { useState } from 'react';
import { useSheetStore } from '@tachybase/sheet';
import ReactSheet from '@tachybase/sheet';

function FormWithSheet() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = () => {
    const sheetData = useSheetStore.getState().getData();
    
    const submitData = {
      ...formData,
      spreadsheet: sheetData,
    };

    console.log('提交数据:', submitData);
    // 发送到服务器
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="标题"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="描述"
      />
      <ReactSheet />
      <button type="submit">提交</button>
    </form>
  );
}
```

### 9. 导入/导出数据

```tsx
import React from 'react';
import { useSheetStore } from '@tachybase/sheet';
import ReactSheet from '@tachybase/sheet';

function ImportExportSheet() {
  const { loadData, getData } = useSheetStore();

  const handleImport = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const text = await file.text();
      const data = JSON.parse(text);
      loadData(data);
    };
    
    fileInput.click();
  };

  const handleExport = () => {
    const data = getData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.json';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleImport}>导入</button>
        <button onClick={handleExport}>导出</button>
      </div>
      <ReactSheet />
    </div>
  );
}
```

### 10. 多 Sheet 管理

```tsx
import React from 'react';
import { useSheetStore } from '@tachybase/sheet';
import ReactSheet from '@tachybase/sheet';

function MultiSheetManager() {
  const {
    sheets,
    activeSheetIndex,
    addSheet,
    deleteSheet,
    switchSheet,
    renameSheet,
  } = useSheetStore();

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <h3>Sheets 管理</h3>
        <button onClick={() => addSheet()}>添加 Sheet</button>
        <ul>
          {sheets.map((sheet, index) => (
            <li key={index}>
              <span
                style={{
                  fontWeight: index === activeSheetIndex ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
                onClick={() => switchSheet(index)}
              >
                {sheet.name}
              </span>
              {sheets.length > 1 && (
                <button onClick={() => deleteSheet(index)}>删除</button>
              )}
              <button
                onClick={() => {
                  const newName = prompt('新名称:', sheet.name);
                  if (newName) renameSheet(index, newName);
                }}
              >
                重命名
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ReactSheet />
    </div>
  );
}
```

## 兼容旧版 API

### 11. 使用旧版 API（向后兼容）

```typescript
import Spreadsheet from '@tachybase/sheet';

// 创建实例
const sheet = Spreadsheet.makeSheet(document.getElementById('spreadsheet'), {
  mode: 'edit',
  showToolbar: true,
  showBottomBar: true,
});

// 加载数据
sheet.loadData([
  {
    name: 'Sheet1',
    rows: {
      0: {
        cells: {
          0: { text: 'A1' },
          1: { text: 'B1' },
        },
      },
    },
  },
]);

// 监听变化
sheet.on('change', (data) => {
  console.log('Data changed:', data);
});

// 获取数据
const data = sheet.getData();

// 设置单元格
sheet.cellText(0, 0, 'New Value');

// 获取单元格
const cell = sheet.cell(0, 0);

// 添加 sheet
sheet.addSheet('New Sheet');

// 删除 sheet
sheet.deleteSheet();
```

## 样式定制

### 12. 自定义样式

```tsx
import React from 'react';
import ReactSheet from '@tachybase/sheet';
import './custom-sheet.css'; // 自定义样式

function StyledSheet() {
  return (
    <div className="custom-sheet-container">
      <ReactSheet />
    </div>
  );
}
```

```css
/* custom-sheet.css */
.x-spreadsheet-toolbar {
  background: #f0f0f0;
  border-bottom: 2px solid #ccc;
}

.x-spreadsheet-table {
  font-family: 'Monaco', monospace;
}

.x-spreadsheet-selector-area {
  border-color: #ff0000;
}
```

## 性能优化

### 13. 大数据量优化

```tsx
import React, { useMemo } from 'react';
import { useSheetStore } from '@tachybase/sheet';
import ReactSheet from '@tachybase/sheet';

function LargeDataSheet() {
  const options = useMemo(() => ({
    row: {
      len: 1000, // 1000 行
      height: 25,
    },
    col: {
      len: 100, // 100 列
      width: 100,
    },
  }), []);

  return <ReactSheet options={options} />;
}
```

## 总结

这些示例展示了如何使用新的 React + Canvas 架构：

1. **简单使用**: 直接使用 `<ReactSheet />` 组件
2. **高级控制**: 使用 `useSheetStore` hook
3. **自定义组合**: 单独使用各个组件
4. **向后兼容**: 支持旧版 API

选择最适合你项目需求的方式！

