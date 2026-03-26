## Requirements

### Requirement: 设置页面可访问
系统 SHALL 提供一个设置页面，登录用户可以通过导航访问。

#### Scenario: 从导航进入设置页面
- **WHEN** 用户点击导航栏中的设置图标或菜单项
- **THEN** 系统导航到 `/settings` 页面
- **AND** 页面显示用户当前的账户信息

### Requirement: 个人信息展示
系统 SHALL 在设置页面显示用户的个人信息，包括登录名和显示名称。

#### Scenario: 查看个人信息
- **WHEN** 用户进入设置页面
- **THEN** 页面显示当前用户的 username（只读）
- **AND** 显示当前用户的 nickname（可编辑）

### Requirement: 设置页面布局
系统 SHALL 使用卡片式布局组织设置页面内容。

#### Scenario: 页面布局展示
- **WHEN** 用户进入设置页面
- **THEN** 页面包含"个人信息"卡片区域
- **AND** 页面包含"修改密码"卡片区域
- **AND** 两个区域视觉分隔清晰

### Requirement: 设置入口可见性
系统 SHALL 在主导航或用户菜单中提供设置入口。

#### Scenario: 设置入口显示
- **WHEN** 用户已登录并查看导航栏
- **THEN** 导航栏显示设置入口（图标或文字链接）
- **AND** 点击后跳转到设置页面

### Requirement: 未登录访问限制
系统 SHALL 阻止未登录用户访问设置页面。

#### Scenario: 未登录用户访问设置
- **WHEN** 未登录用户直接访问 `/settings`
- **THEN** 系统重定向到登录页面
