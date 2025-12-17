# 鼠标坐标偏移问题修复

## 问题描述
用户反馈在表格中点击和右键菜单的位置都有偏移：
- 在 B8 单元格位置右键，菜单却出现在右下角
- 点击单元格时，选中的位置也不正确
- **更新**: 修复后仍然有偏移，右键菜单出现在左下角，单元格选择位置不对

## 根本原因分析

### 0. offsetX/offsetY 的陷阱（最关键）

**问题**: `event.offsetX` 和 `event.offsetY` 是相对于**触发事件的元素** (`event.target`)，而不是**绑定事件的元素** (`event.currentTarget`)！

当 overlayer 有子元素（如 overlayer-content）时：
- 如果点击在子元素上，`offsetX/offsetY` 是相对于子元素的
- 如果 overlayer-content 有偏移（left: 60px, top: 25px），则坐标会错位

**正确做法**: 使用 `clientX/clientY` 和 `getBoundingClientRect()` 计算相对于 overlayer 的坐标：

```typescript
const rect = overlayerRef.current.getBoundingClientRect();
const offsetX = clientX - rect.left;
const offsetY = clientY - rect.top;
```

### 1. Overlayer 结构理解
在原始实现中，overlayer 有两层结构：
- **外层** (`overlayer`): 覆盖整个表格区域（包括行头和列头）
- **内层** (`overlayer-content`): 只覆盖实际的单元格内容区域（不包括行头和列头）

```javascript
// 原始实现
overlayerEl.offset(vRect);  // { width: viewWidth, height: viewHeight }
overlayerCEl.offset(tOffset);  // { 
//   left: cols.indexWidth,  // 偏移行头宽度
//   top: rows.height,        // 偏移列头高度
//   width: viewWidth - cols.indexWidth,
//   height: viewHeight - rows.height
// }
```

### 2. 坐标系统
- **offsetX/offsetY**: 相对于触发事件的元素
- **clientX/clientY**: 相对于整个视口

在原始实现中：
- 鼠标事件绑定在外层 overlayer 上
- 获取 `offsetX, offsetY` 相对于 overlayer（包含行头列头）
- `data.getCellRectByXY(offsetX, offsetY)` 能正确处理这些坐标
- 右键菜单使用 `setPosition(offsetX, offsetY)` 直接设置位置

### 3. React 实现的问题

**问题 1: 右键菜单坐标错误**
```typescript
// ❌ 错误：使用 clientX, clientY（视口坐标）
openContextMenu(clientX, clientY);

// ✅ 正确：使用 offsetX, offsetY（相对于 overlayer）
openContextMenu(offsetX, offsetY);
```

**问题 2: overlayer-content 未正确偏移**
```typescript
// ❌ 错误：没有设置偏移
<div className={`${cssPrefix}-overlayer-content`}>
  {children}
</div>

// ✅ 正确：设置偏移避开行头列头
<div
  className={`${cssPrefix}-overlayer-content`}
  style={{
    left: `${cols.indexWidth}px`,
    top: `${rows.height}px`,
    width: `${viewWidth - cols.indexWidth}px`,
    height: `${viewHeight - rows.height}px`,
  }}
>
  {children}
</div>
```

## 修复方案

### 1. 使用 clientX/clientY 计算正确坐标（最重要！）

**文件**: `src/sheet/components/Overlayer/OverlayerInteraction.tsx`

**问题代码**:
```typescript
// ❌ 错误：offsetX/offsetY 相对于 event.target，而不是 overlayer
const { offsetX, offsetY } = event;
const cellRect = data.getCellRectByXY(offsetX, offsetY);
```

**正确代码**:
```typescript
// ✅ 正确：计算相对于 overlayer 的坐标
const { clientX, clientY } = event;
const rect = overlayerRef.current.getBoundingClientRect();
const offsetX = clientX - rect.left;
const offsetY = clientY - rect.top;
const cellRect = data.getCellRectByXY(offsetX, offsetY);
```

### 2. 修正右键菜单坐标

应用同样的修复：

```typescript
const handleContextMenu = useCallback(
  (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!data || !overlayerRef.current) return;

    const { clientX, clientY } = event;
    const rect = overlayerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    openContextMenu(offsetX, offsetY);
  },
  [data, openContextMenu],
);
```

### 2. 设置 overlayer-content 正确偏移

**计算偏移量**:
```typescript
const [dimensions, setDimensions] = useState({
  width: 0,           // overlayer 总宽度
  height: 0,          // overlayer 总高度
  contentLeft: 0,     // content 左偏移（行头宽度）
  contentTop: 0,      // content 上偏移（列头高度）
  contentWidth: 0,    // content 宽度
  contentHeight: 0,   // content 高度
});

useEffect(() => {
  if (data) {
    const { rows, cols } = data;
    const width = data.viewWidth();
    const height = data.viewHeight();
    setDimensions({
      width,
      height,
      contentLeft: cols.indexWidth,
      contentTop: rows.height,
      contentWidth: width - cols.indexWidth,
      contentHeight: height - rows.height,
    });
  }
}, [data]);
```

**应用偏移**:
```typescript
<div
  className={`${cssPrefix}-overlayer`}
  style={{
    position: 'absolute',
    left: 0,
    top: 0,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    zIndex: 10,
  }}
>
  <div
    className={`${cssPrefix}-overlayer-content`}
    style={{
      position: 'absolute',
      left: `${dimensions.contentLeft}px`,
      top: `${dimensions.contentTop}px`,
      width: `${dimensions.contentWidth}px`,
      height: `${dimensions.contentHeight}px`,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
</div>
```

## 坐标系统图解

### offsetX/offsetY 的问题

```
┌─ overlayer (绑定事件) ─────────────────┐
│  鼠标点击这里                           │
│                 ↓                      │
│   ┌─ overlayer-content (left: 60, top: 25) ─┐
│   │             █ ← 点击位置           │    │
│   │                                    │    │
│   │  如果使用 event.offsetX:           │    │
│   │  - offsetX 相对于 overlayer-content│    │
│   │  - 实际应该是: offsetX + 60        │    │
│   │  - 实际应该是: offsetY + 25        │    │
│   └────────────────────────────────────┘    │
└────────────────────────────────────────────┘

正确做法：
const rect = overlayer.getBoundingClientRect();
const offsetX = clientX - rect.left;  // 相对于 overlayer
const offsetY = clientY - rect.top;
```

### 完整的坐标系统

```
┌─────────────────────────────────────────┐
│                                         │  ← .x-spreadsheet-overlayer
│   ┌───┬───┬───┬───┬───┬───┬───┬───┐   │     (left: 0, top: 0)
│   │   │ A │ B │ C │ D │ E │ F │ G │   │     width: viewWidth
│   ├───┼───┼───┼───┼───┼───┼───┼───┤   │     height: viewHeight
│   │ 6 │   │   │   │   │   │   │   │   │
│   ├───┼───┼───┼───┼───┼───┼───┼───┤   │
│   │ 7 │   │   │   │   │   │   │   │   │
│   ├───┼───┼───┼───┼───┼───┼───┼───┤   │
│   │ 8 │   │ █ │◄──┼───── offsetX, offsetY
│   ├───┼───┼───┼───┼───┼───┼───┼───┤   │     相对于 overlayer
│   │ 9 │   │   │   │   │   │   │   │   │
│   └───┴───┴───┴───┴───┴───┴───┴───┘   │
│    ↑                                   │
│    └─ overlayer-content                │
│       (left: cols.indexWidth,          │
│        top: rows.height)               │
└─────────────────────────────────────────┘
```

## 为什么需要两层结构？

1. **外层 overlayer**: 
   - 覆盖整个表格（包括行头、列头、内容）
   - 接收所有鼠标事件
   - 可以检测鼠标是否在行头/列头上（用于 resizer）

2. **内层 overlayer-content**:
   - 只覆盖单元格内容区域
   - 包含 Editor（编辑器）和 SelectionOverlay（选区框）
   - 这些元素只应该显示在内容区域，不应该遮挡行头列头

## 测试验证

修复后需要验证：

1. **点击单元格**
   - ✅ 点击任意单元格，选区框应该准确显示在该单元格上
   - ✅ 控制台日志应该显示正确的 ri, ci 坐标

2. **右键菜单**
   - ✅ 右键点击任意单元格，菜单应该出现在鼠标附近
   - ✅ 菜单不应该出现在完全错误的位置（如右下角）

3. **拖拽选择**
   - ✅ 拖拽鼠标选择多个单元格，选区框应该准确跟随鼠标

4. **双击编辑**
   - ✅ 双击单元格，编辑器应该出现在正确的位置

## 调试日志

临时添加了 console.log 用于验证修复：

```typescript
// MouseDown 事件
console.log('MouseDown:', { offsetX, offsetY, ri, ci, buttons, detail });

// ContextMenu 事件
console.log('ContextMenu:', { offsetX, offsetY });
```

确认功能正常后，这些日志应该被移除。

## 相关文件

- `src/sheet/components/Overlayer/OverlayerInteraction.tsx` - 主要修复文件
- `src/sheet/store/useSheetStore.ts` - openContextMenu 方法
- `src/sheet/components/ContextMenu/ContextMenu.tsx` - 菜单组件
- `src/sheet/sheet.less` - overlayer 样式定义

## 后续优化

1. 移除调试日志
2. 考虑添加 resizer 功能（行列宽度调整）
3. 优化坐标计算性能
4. 处理滚动时的坐标变化

