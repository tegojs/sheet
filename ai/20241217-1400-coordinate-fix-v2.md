# 坐标偏移问题的最终修复

## 问题根源

### offsetX/offsetY 的陷阱 ⚠️

`event.offsetX` 和 `event.offsetY` 是相对于 **`event.target`**（触发事件的元素），而不是 **`event.currentTarget`**（绑定事件的元素）！

### 场景说明

```typescript
// 结构
<div className="overlayer" onMouseDown={handleMouseDown}>
  <div className="overlayer-content" style={{ left: 60, top: 25 }}>
    <div className="editor">点击这里</div>
  </div>
</div>

// 当点击 editor 时：
// event.target = editor 元素
// event.currentTarget = overlayer 元素
// event.offsetX = 相对于 editor 的 X 坐标 ❌ 错误！
// event.offsetY = 相对于 editor 的 Y 坐标 ❌ 错误！
```

### 问题示例

假设点击位置在屏幕上的绝对坐标是 (200, 150)：

| 元素 | 位置 | event.offsetX | 期望值 | 差值 |
|------|------|---------------|--------|------|
| overlayer | (100, 100) | 100 | 100 | ✅ 正确 |
| overlayer-content | (160, 125) | 40 | 100 | ❌ 少了 60 |
| editor | (180, 140) | 20 | 100 | ❌ 少了 80 |

**结论**: 当点击在子元素上时，`offsetX` 会变小，导致计算的单元格位置偏左上。

## 修复方案

### ✅ 使用 clientX/clientY + getBoundingClientRect

```typescript
const handleMouseDown = useCallback(
  (event: React.MouseEvent<HTMLDivElement>) => {
    if (!data || !overlayerRef.current) return;

    // ✅ 使用 clientX/clientY（相对于视口）
    const { clientX, clientY } = event;
    
    // ✅ 获取 overlayer 的位置
    const rect = overlayerRef.current.getBoundingClientRect();
    
    // ✅ 计算相对于 overlayer 的坐标
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    
    // ✅ 现在坐标是正确的
    const cellRect = data.getCellRectByXY(offsetX, offsetY);
  },
  [data],
);
```

## 修改的文件

**文件**: `src/sheet/components/Overlayer/OverlayerInteraction.tsx`

修改了三个事件处理器：
1. `handleMouseDown` - 处理点击和双击
2. `handleMouseMove` - 处理拖拽选择
3. `handleContextMenu` - 处理右键菜单

所有都改为使用 `clientX/clientY + getBoundingClientRect()`。

## 验证方法

1. 打开开发者工具 Console
2. 点击任意单元格
3. 查看日志：

```
MouseDown: {
  clientX: 456,        // 视口坐标
  clientY: 234,
  rectLeft: 200,       // overlayer 位置
  rectTop: 100,
  offsetX: 256,        // 计算出的相对坐标 = 456 - 200
  offsetY: 134,        // = 234 - 100
  ri: 8,               // 正确的行
  ci: 1,               // 正确的列
}
```

4. 验证选区框是否在点击的单元格上
5. 右键点击，验证菜单是否在鼠标附近

## 为什么之前的修复不工作

### 第一次修复 ❌
```typescript
// 使用 offsetX/offsetY，但没有意识到子元素问题
const { offsetX, offsetY } = event;
```
**问题**: 当点击子元素时，offsetX 是相对于子元素的。

### 第二次修复 ❌
```typescript
// 设置 overlayer-content 的偏移
<div style={{ left: 60, top: 25 }}>
  {children}
</div>
```
**问题**: 虽然视觉上正确，但让 offsetX 的问题更严重了。

### 第三次修复 ✅
```typescript
// 使用 clientX/clientY 计算相对于 overlayer 的坐标
const rect = overlayerRef.current.getBoundingClientRect();
const offsetX = clientX - rect.left;
const offsetY = clientY - rect.top;
```
**正确**: 无论点击哪个子元素，都能得到正确的坐标。

## 技术要点

### 1. 事件坐标系统

- **clientX/clientY**: 相对于浏览器视口（推荐使用）
- **pageX/pageY**: 相对于整个文档（包括滚动）
- **offsetX/offsetY**: 相对于 event.target（不推荐，容易出错）
- **screenX/screenY**: 相对于屏幕

### 2. getBoundingClientRect()

返回元素相对于视口的位置和尺寸：
```typescript
{
  left: 200,    // 左边距
  top: 100,     // 上边距
  right: 800,   // 右边距
  bottom: 600,  // 下边距
  width: 600,   // 宽度
  height: 500,  // 高度
}
```

### 3. 计算相对坐标

```typescript
// 元素在视口中的位置
const rect = element.getBoundingClientRect();

// 鼠标在视口中的位置
const { clientX, clientY } = event;

// 鼠标相对于元素的位置
const offsetX = clientX - rect.left;
const offsetY = clientY - rect.top;
```

## 常见错误

### ❌ 错误 1: 直接使用 offsetX/offsetY
```typescript
const { offsetX, offsetY } = event;
// 当点击子元素时会出错
```

### ❌ 错误 2: 使用 currentTarget 的 offset
```typescript
const target = event.currentTarget as HTMLElement;
const offsetX = event.clientX - target.offsetLeft;
// offsetLeft 是相对于父元素的，不是视口
```

### ❌ 错误 3: 忘记处理所有事件
```typescript
// 只修复了 mousedown，忘记修复 mousemove 和 contextmenu
```

### ✅ 正确做法
```typescript
// 统一使用 clientX/clientY + getBoundingClientRect()
const rect = overlayerRef.current.getBoundingClientRect();
const offsetX = clientX - rect.left;
const offsetY = clientY - rect.top;
```

## 测试清单

- [x] 点击单元格 A1，选区框出现在 A1
- [x] 点击单元格 B8，选区框出现在 B8
- [x] 拖拽选择多个单元格，选区框准确
- [x] 右键点击单元格，菜单出现在鼠标附近（不是左下角）
- [x] 双击单元格，编辑器出现在正确位置
- [x] Shift+点击扩展选区，正确扩展

## 性能考虑

`getBoundingClientRect()` 会触发浏览器的重排（reflow），但在事件处理器中调用是可以接受的，因为：

1. 事件频率不高（鼠标事件）
2. 只在需要时调用
3. 返回值是实时计算的，不需要缓存

如果有性能问题，可以考虑：
- 缓存 rect，在窗口大小变化或滚动时更新
- 使用 ResizeObserver 监听尺寸变化

## 相关资源

- [MDN: MouseEvent.offsetX](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX)
- [MDN: MouseEvent.clientX](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
- [MDN: Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)

## 总结

**核心问题**: `offsetX/offsetY` 相对于 `event.target`，不是 `event.currentTarget`

**解决方案**: 使用 `clientX/clientY + getBoundingClientRect()` 计算相对于 overlayer 的坐标

**关键代码**:
```typescript
const rect = overlayerRef.current.getBoundingClientRect();
const offsetX = clientX - rect.left;
const offsetY = clientY - rect.top;
```

这个修复彻底解决了所有坐标相关的问题！🎉

