## 1. 样式系统准备

- [ ] 1.1 在 theme.css 中定义响应式断点变量
  - 添加 `breakpoint-sm: 320px`, `breakpoint-md: 375px`, `breakpoint-lg: 414px`
- [ ] 1.2 添加媒体查询混入或工具类
  - 实现移动优先的断点系统

## 2. Home.vue 顶部导航栏响应式改造

- [ ] 2.1 修改 `.page-header` 容器布局
  - 使用 CSS Grid 或 Flexbox 实现响应式框架
  - 配置 `flex-wrap` 支持多行布局

- [ ] 2.2 配置 `.header-left` 区域样式
  - 设置 `flex-shrink: 0` 保护按钮区域
  - 添加响应式间距调整

- [ ] 2.3 配置日期显示 `.date-display` 样式
  - 设置 `min-width` 防止文本截断
  - 添加 `white-space: nowrap` 保持日期完整
  - 配置 `flex: 1` 自适应但有最小宽度约束

- [ ] 2.4 配置按钮响应式尺寸
  - 确保所有按钮 `min-width: 44px`, `min-height: 44px`
  - 添加 `flex-shrink: 0` 防止按钮被压缩过小

## 3. 断点布局实现

- [ ] 3.1 实现 sm 断点样式 (320px-374px)
  - 减小按钮 padding 至 6px 10px
  - 调整 header 为紧凑两行布局
  - 日期区域保持最小宽度

- [ ] 3.2 实现 md 断点样式 (375px-413px)
  - 调整按钮 padding 至 8px 12px
  - 实现两行布局，日期独占一行居中
  - 确保 logout 按钮位置合理

- [ ] 3.3 实现 lg 断点样式 (414px+)
  - 恢复当前单行水平布局
  - 按钮 padding 8px 16px
  - 日期显示完整格式

## 4. 触控友好性保障

- [ ] 4.1 添加触控区域验证
  - 使用浏览器开发者工具验证 44px 最小尺寸
  - 测试实际设备上的触控准确性

- [ ] 4.2 添加无障碍支持
  - 确保 `aria-label` 在日期等元素上正确设置
  - 验证键盘导航顺序

## 5. 测试与验证

- [ ] 5.1 浏览器模拟器测试
  - 测试 iPhone SE (375px) 布局
  - 测试 iPhone 12/13/14 (390px-393px) 布局
  - 测试 iPhone Plus/Max (414px-428px) 布局
  - 测试 Android 主流尺寸 (360px-412px)

- [ ] 5.2 视觉一致性验证
  - 验证各断点间布局切换流畅
  - 检查日期文本显示完整性
  - 确认按钮样式一致性
