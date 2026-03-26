## Requirements

### Requirement: 修改显示名称
系统 SHALL 允许用户修改自己的显示名称（nickname）。

#### Scenario: 成功修改显示名称
- **WHEN** 用户在设置页面输入新的 nickname
- **AND** 点击保存按钮
- **THEN** 系统更新用户的 nickname
- **AND** 显示成功提示
- **AND** 更新本地存储的用户信息

#### Scenario: 显示名称验证失败
- **WHEN** 用户输入空的 nickname
- **AND** 点击保存按钮
- **THEN** 系统拒绝保存
- **AND** 显示错误提示"显示名称不能为空"

#### Scenario: 显示名称过长
- **WHEN** 用户输入超过 50 个字符的 nickname
- **AND** 点击保存按钮
- **THEN** 系统拒绝保存
- **AND** 显示错误提示"显示名称不能超过 50 个字符"

### Requirement: 登录名不可修改
系统 SHALL 禁止用户修改登录名（username）。

#### Scenario: 查看登录名
- **WHEN** 用户查看个人信息区域
- **THEN** username 字段显示为只读状态
- **AND** 用户无法编辑该字段

### Requirement: 资料更新 API
系统 SHALL 提供 API 端点用于更新用户资料。

#### Scenario: 调用更新 API
- **WHEN** 发送 PATCH 请求到 `/users/me`
- **AND** 请求体包含有效的 nickname
- **THEN** 系统返回更新后的用户信息
- **AND** HTTP 状态码为 200

#### Scenario: API 验证失败
- **WHEN** 发送 PATCH 请求到 `/users/me`
- **AND** 请求体包含无效的 nickname（空或过长）
- **THEN** 系统返回 400 错误
- **AND** 返回具体的验证错误信息

### Requirement: 未认证用户限制
系统 SHALL 拒绝未认证用户调用资料更新 API。

#### Scenario: 未认证调用 API
- **WHEN** 未提供有效 JWT 令牌调用 PATCH `/users/me`
- **THEN** 系统返回 401 未授权错误
