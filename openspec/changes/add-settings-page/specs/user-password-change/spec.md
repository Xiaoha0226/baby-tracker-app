## ADDED Requirements

### Requirement: 修改密码功能
系统 SHALL 允许用户修改自己的登录密码。

#### Scenario: 成功修改密码
- **WHEN** 用户输入当前密码
- **AND** 用户输入新密码（至少 6 个字符）
- **AND** 用户确认新密码（与输入一致）
- **AND** 点击修改密码按钮
- **THEN** 系统验证当前密码正确
- **AND** 系统更新密码
- **AND** 显示成功提示"密码修改成功"
- **AND** 清空密码输入字段

#### Scenario: 当前密码错误
- **WHEN** 用户输入错误的当前密码
- **AND** 输入有效的新密码和确认密码
- **AND** 点击修改密码按钮
- **THEN** 系统拒绝修改
- **AND** 显示错误提示"当前密码错误"

#### Scenario: 新密码太短
- **WHEN** 用户输入当前密码
- **AND** 用户输入少于 6 个字符的新密码
- **AND** 点击修改密码按钮
- **THEN** 系统拒绝修改
- **AND** 显示错误提示"新密码至少需要 6 个字符"

#### Scenario: 密码确认不匹配
- **WHEN** 用户输入当前密码
- **AND** 用户输入新密码
- **AND** 用户输入不匹配的确认密码
- **AND** 点击修改密码按钮
- **THEN** 系统拒绝修改
- **AND** 显示错误提示"两次输入的密码不一致"

### Requirement: 密码修改 API
系统 SHALL 提供 API 端点用于修改用户密码。

#### Scenario: 调用密码修改 API
- **WHEN** 发送 POST 请求到 `/users/change-password`
- **AND** 请求体包含 currentPassword、newPassword 和 confirmPassword
- **AND** 所有验证通过
- **THEN** 系统更新用户密码
- **AND** 返回成功消息
- **AND** HTTP 状态码为 200

#### Scenario: API 当前密码错误
- **WHEN** 发送 POST 请求到 `/users/change-password`
- **AND** currentPassword 不正确
- **THEN** 系统返回 400 错误
- **AND** 返回错误信息"当前密码错误"

#### Scenario: API 新密码验证失败
- **WHEN** 发送 POST 请求到 `/users/change-password`
- **AND** newPassword 少于 6 个字符或与 confirmPassword 不匹配
- **THEN** 系统返回 400 错误
- **AND** 返回具体的验证错误信息

### Requirement: 未认证用户限制
系统 SHALL 拒绝未认证用户调用密码修改 API。

#### Scenario: 未认证调用密码修改 API
- **WHEN** 未提供有效 JWT 令牌调用 POST `/users/change-password`
- **THEN** 系统返回 401 未授权错误
