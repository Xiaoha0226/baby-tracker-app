## Why

当前宝宝记录应用缺少用户设置功能，用户无法修改自己的用户名和密码。这限制了用户管理个人账户的能力，降低了用户体验。添加设置页面将允许用户自主管理账户信息，提升应用的完整性和用户满意度。

## What Changes

- 新增设置页面 (`/settings`)，包含用户账户管理功能
- 支持修改用户名：用户可以更新自己的显示名称
- 支持修改密码：用户可以更改登录密码，需要验证当前密码
- 在导航栏或用户菜单中添加设置入口
- 后端 API 扩展：添加用户资料更新和密码修改接口

## Capabilities

### New Capabilities
- `settings-page`: 用户设置页面，包含账户信息展示和编辑功能
- `user-profile-update`: 用户资料更新 API，支持修改用户名
- `user-password-change`: 用户密码修改 API，需要当前密码验证

### Modified Capabilities
- 无

## Impact

- **前端**: 新增 Settings.vue 页面组件，更新路由配置，更新 auth store
- **后端**: 扩展 UsersController 和 UsersService，新增 DTO 类
- **数据库**: 无需变更，使用现有 users 表结构
- **API**: 新增 `PATCH /users/me` 和 `POST /users/change-password` 端点
