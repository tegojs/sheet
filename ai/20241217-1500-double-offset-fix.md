# 双重偏移问题修复

## 问题描述

用户反馈：
1. 选区框位置接近但没有对齐（偏移约两倍距离）
2. 无法输入文字，编辑器不工作
3. 有时候连双击进入编辑状态都无法触发

## 根本原因

### 双重偏移问题

`SelectionOverlay` 和 `CellEditor` 发生了**双重偏移**：

```
overlayer (外层)
  └─ overlayer-content (偏移 60, 25)  ← 第一次偏移
       └─ SelectionOverlay
            └─ selection-area (又偏移 60, 25)  ← 第二次偏移
            结果: 总偏移 (120, 50) ❌ 错误！
```

### 结构说明

```typescript
<OverlayerInteraction>
  {/* overlayer-content 已经有偏移 */}
  <div style={{ left: 60, top: 25 }}>  
    
    {/* SelectionOverlay 在 overlayer-content 内部 */}
    <SelectionOverlay />
    
    {/* CellEditor 也在 overlayer-content 内部 */}
    <CellEditor />
    
  </div>
</OverlayerInteraction>
```

### 错误代码

**SelectionOverlay.tsx** (修复前):
```typescript
// ❌ 错误：重复添加偏移
setSelectionRect({
  left: rect.left + cols.indexWidth,  // 又加一次
  top: rect.top + rows.height,        // 又加一次
  width: rect.width,
  height: rect.height,
});
```

**CellEditor.tsx** (修复前):
```typescript
// ❌ 错误：重复添加偏移
setPosition({
  left: rect.left + cols.indexWidth,  // 又加一次
  top: rect.top + rows.height,        // 又加一次
  width: rect.width,
  height: rect.height,
});
```

## 修复方案

### 1. 移除子组件中的偏移

**SelectionOverlay.tsx** (修复后):
```typescript
// ✅ 正确：不添加偏移，因为父容器已经有偏移了
setSelectionRect({
  left: rect.left,   // 直接使用
  top: rect.top,     // 直接使用
  width: rect.width,
  height: rect.height,
});
```

**CellEditor.tsx** (修复后):
```typescript
// ✅ 正确：不添加偏移
setPosition({
  left: rect.left,   // 直接使用
  top: rect.top,     // 直接使用
  width: rect.width,
  height: rect.height,
});
```

### 2. 设置 overlayer-content 的 pointerEvents

**OverlayerInteraction.tsx**:
```typescript
<div
  className={`${cssPrefix}-overlayer-content`}
  style={{
    // ...其他样式
    pointerEvents: 'none', // 让双击事件能穿透到 overlayer
  }}
>
  {children}
</div>
```

**为什么需要 pointerEvents: 'none'**:
- overlayer-content 不需要接收事件
- 双击事件需要由外层 overlayer 接收
- 子元素（如 CellEditor）可以设置 `pointerEvents: 'auto'` 来接收事件

## 坐标系统图解

### 修复前（双重偏移）

```
视口坐标: (200, 150)

overlayer (100, 100)
  └─ overlayer-content (160, 125) [偏移 60, 25]
       └─ selection-area
            计算: left = (200-100) + 60 = 160  ❌
                 top = (150-100) + 25 = 75   ❌
            
            实际位置: (160, 125) + (160, 75) = (220, 150)
            期望位置: (160, 125) + (100, 50) = (260, 175)
            偏差: (60, 25) - 正好是一倍的偏移量！
```

### 修复后（正确）

```
视口坐标: (200, 150)

overlayer (100, 100)
  └─ overlayer-content (160, 125) [偏移 60, 25]
       └─ selection-area
            计算: left = (200-100) = 100  ✅
                 top = (150-100) = 50   ✅
            
            实际位置: (160, 125) + (100, 50) = (260, 175)  ✅ 正确！
```

## 规则总结

### 坐标计算规则

1. **外层 overlayer**: 
   - 覆盖整个表格（包括行头列头）
   - 位置: (0, 0)
   - 接收鼠标事件
   - 计算相对于 overlayer 的坐标

2. **overlayer-content**:
   - 只覆盖单元格内容区域
   - 位置: (cols.indexWidth, rows.height)
   - 不接收事件 (pointerEvents: 'none')
   - 作为偏移容器

3. **SelectionOverlay 和 CellEditor**:
   - 在 overlayer-content 内部
   - 位置: 相对于 overlayer-content
   - **不需要**再添加 cols.indexWidth 和 rows.height
   - 直接使用 data.getSelectedRect() 返回的坐标

### 关键原则

**一个坐标只能有一次偏移！**

- ❌ 错误: overlayer-content 偏移 + 子元素再偏移 = 双重偏移
- ✅ 正确: overlayer-content 偏移 + 子元素不偏移 = 正确位置

## 修改的文件

1. **src/sheet/components/Selection/SelectionOverlay.tsx**
   - 移除 `+ cols.indexWidth` 和 `+ rows.height`

2. **src/sheet/components/Editor/CellEditor.tsx**
   - 移除 `+ cols.indexWidth` 和 `+ rows.height`

3. **src/sheet/components/Overlayer/OverlayerInteraction.tsx**
   - 添加 `pointerEvents: 'none'` 到 overlayer-content

## 测试验证

### 选区框对齐测试

1. 点击单元格 B15
2. 选区框应该**完全对齐** B15 单元格
3. 不应该有任何偏移

### 编辑功能测试

1. 双击单元格 B15
2. 应该立即进入编辑状态
3. 光标应该在单元格内
4. 能够输入文字
5. 输入的文字应该显示在正确的位置

### 视觉测试清单

- [ ] 单击选择：选区框完全对齐
- [ ] 拖拽选择：选区框跟随鼠标准确扩展
- [ ] 双击编辑：编辑器出现在正确位置
- [ ] 输入文字：能够正常输入
- [ ] 文字显示：文字显示在单元格内
- [ ] Enter 完成：按 Enter 完成编辑并移到下一行
- [ ] Tab 完成：按 Tab 完成编辑并移到下一列
- [ ] Esc 取消：按 Esc 取消编辑

## 相关问题

### 为什么会发生双重偏移？

在迁移到 React 时，我们保留了原始代码的偏移逻辑：

```typescript
// 原始代码 (DOM)
overlayerEl.offset(vRect);  // 整个表格
overlayerCEl.offset(tOffset);  // 内容区域

// React 代码
<div style={{ left: 0, top: 0 }}>  {/* overlayer */}
  <div style={{ left: 60, top: 25 }}>  {/* overlayer-content */}
```

但是在计算选区位置时，原始代码中的 `selector` 是相对于 `overlayerCEl` 的，所以不需要偏移。而我们的 React 代码最初错误地添加了偏移。

### 为什么原始代码没有这个问题？

原始代码中：
```javascript
// selector 直接添加到 overlayerCEl
this.overlayerCEl = h('div', `${cssPrefix}-overlayer-content`).children(
  this.editor.el,
  this.selector.el,  // 直接作为子元素，坐标相对于 overlayerCEl
);
```

selector 的坐标本来就是相对于 overlayerCEl 的，所以不需要额外偏移。

### 如何避免类似问题？

1. **理解容器结构**: 明确每个元素的父容器
2. **理解坐标系统**: 子元素坐标相对于父容器
3. **避免重复计算**: 如果父容器已经有偏移，子元素不应该再加偏移
4. **测试验证**: 用视觉方式验证位置是否对齐

## 性能影响

这个修复对性能有积极影响：
- 减少了不必要的坐标计算
- 简化了组件逻辑
- 提高了代码可维护性

## 总结

**核心问题**: 双重偏移导致选区框和编辑器位置错误

**解决方案**: 
1. 移除子组件中的偏移计算
2. 添加 `pointerEvents: 'none'` 确保事件正确传递

**关键原则**: 一个坐标只能有一次偏移！

现在选区框和编辑器应该完全对齐，文字输入也应该正常工作了！🎉

