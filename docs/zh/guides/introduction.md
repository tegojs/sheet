# 快速开始

## 安装

```bash
pnpm install @tego/sheet
```

## 基础用法

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return <ReactSheet />;
}
```

## 配置选项

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  return (
    <ReactSheet
      options={{
        mode: 'edit',           // 'edit' | 'read'
        showToolbar: true,      // 显示工具栏
        showBottomBar: true,    // 显示表格标签
        showGrid: true,         // 显示网格线
        showContextmenu: true,  // 启用右键菜单
      }}
    />
  );
}
```

## 加载数据

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
          0: { cells: { 0: { text: '姓名' }, 1: { text: '年龄' } } },
          1: { cells: { 0: { text: '小明' }, 1: { text: '25' } } },
          2: { cells: { 0: { text: '小红' }, 1: { text: '30' } } },
        },
      },
    ]);
  }, []);

  return <ReactSheet />;
}
```

## 获取数据

```tsx
import { useSheetStore } from '@tego/sheet';

function ExportButton() {
  const { getData } = useSheetStore();

  const handleExport = () => {
    const data = getData();
    console.log(JSON.stringify(data, null, 2));
  };

  return <button onClick={handleExport}>导出数据</button>;
}
```

## 监听变化

```tsx
import { ReactSheet } from '@tego/sheet';

function App() {
  const handleChange = (data) => {
    console.log('表格数据变化:', data);
    // 保存到后端等操作
  };

  return <ReactSheet onChange={handleChange} />;
}
```

## 程序化单元格操作

```tsx
import { useSheetStore } from '@tego/sheet';

function Controls() {
  const { setCellText, setCellStyle } = useSheetStore();

  const updateCell = () => {
    // 设置 A1 单元格（第 0 行，第 0 列）的文本
    setCellText(0, 0, 'Hello World');
  };

  const styleCell = () => {
    // 设置选中单元格的样式
    setCellStyle('bold', true);
    setCellStyle('bgcolor', '#ffff00');
  };

  return (
    <div>
      <button onClick={updateCell}>更新单元格</button>
      <button onClick={styleCell}>设置样式</button>
    </div>
  );
}
```

## 下一步

- [API 参考](/api/introduction) - 完整 API 文档
- [ReactSheet 组件](/api/react-sheet) - 组件属性和配置
- [useSheetStore Hook](/api/use-sheet-store) - 状态管理方法
