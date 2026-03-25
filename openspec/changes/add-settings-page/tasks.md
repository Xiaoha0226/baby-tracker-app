## 1. 后端 API 开发

- [x] 1.1 创建 UpdateProfileDto 类，包含 nickname 字段验证
- [x] 1.2 创建 ChangePasswordDto 类，包含当前密码、新密码和确认密码验证
- [x] 1.3 扩展 UsersService，添加 updateProfile 方法
- [x] 1.4 扩展 UsersService，添加 changePassword 方法
- [x] 1.5 扩展 UsersController，添加 PATCH /users/me 端点
- [x] 1.6 扩展 UsersController，添加 POST /users/change-password 端点
- [x] 1.7 测试后端 API 功能

## 2. 前端 API 层开发

- [x] 2.1 在 api/index.ts 中添加 updateProfile API 函数
- [x] 2.2 在 api/index.ts 中添加 changePassword API 函数
- [x] 2.3 扩展 auth store，添加 updateProfile action
- [x] 2.4 扩展 auth store，添加 changePassword action

## 3. 前端页面开发

- [x] 3.1 创建 Settings.vue 页面组件
- [x] 3.2 实现个人信息卡片区域（显示 username、编辑 nickname）
- [x] 3.3 实现修改密码卡片区域（当前密码、新密码、确认密码）
- [x] 3.4 添加表单验证和错误提示
- [x] 3.5 添加成功操作反馈

## 4. 路由和导航

- [x] 4.1 在 router/index.ts 中添加 /settings 路由
- [x] 4.2 在 App.vue 或其他导航组件中添加设置入口
- [x] 4.3 确保未登录用户访问设置页面时重定向到登录页

## 5. 测试和验证

- [x] 5.1 测试修改显示名称功能
- [x] 5.2 测试修改密码功能（包括各种错误场景）
- [x] 5.3 验证页面样式与现有 UI 一致
- [x] 5.4 验证移动端显示效果
