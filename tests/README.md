# 宝宝记录应用 - 测试目录

## 目录结构

```
tests/
├── README.md              # 本文档
├── docs/                  # 测试文档
│   └── test-plan.md       # 完整测试计划
├── e2e/                   # 端到端测试
│   ├── python/             # Python Playwright 测试脚本
│   │   ├── test-e2e.py            # 基础 E2E 测试脚本
│   │   ├── test_register_login.py  # 注册登录专项测试
│   │   └── test-e2e-complete.py    # 完整 E2E 测试套件
│   └── playwright/         # Playwright TypeScript 测试
│       ├── playwright.config.ts     # Playwright 配置文件
│       └── edit-record.spec.ts      # 编辑记录功能测试
└── backend/               # 后端测试
    └── test/              # NestJS E2E 测试
        └── app.e2e-spec.ts         # 后端 API E2E 测试

backend/                   # 后端源代码（保留原始位置）
```

## 测试类型

### 1. Python E2E 测试 (`e2e/python/`)
使用 Playwright Python API 编写的端到端测试。

#### 依赖安装
```bash
pip install playwright requests
playwright install chromium
```

#### 运行测试
```bash
# 使用 with_server.py 脚本启动服务器并运行测试
python /path/to/with_server.py \
  --server "cd backend && npm run start:dev" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python3 tests/e2e/python/test-e2e-complete.py

# 或者直接运行（需要服务器已启动）
python3 tests/e2e/python/test-e2e-complete.py
```

#### 测试脚本说明

| 脚本 | 描述 | 测试用例数 |
|-----|------|----------|
| `test-e2e.py` | 基础 E2E 测试脚本 | 9 |
| `test_register_login.py` | 注册登录功能专项测试 | 5 |
| `test-e2e-complete.py` | 完整 E2E 测试套件 | 25 |

### 2. Playwright TypeScript 测试 (`e2e/playwright/`)
使用 Playwright Test 框架编写的 TypeScript 测试。

#### 依赖安装
```bash
npm install -D @playwright/test
npx playwright install
```

#### 运行测试
```bash
cd tests/e2e/playwright
npx playwright test
```

### 3. 后端 E2E 测试 (`backend/test/`)
NestJS 框架的后端 API 端到端测试。

#### 依赖安装
```bash
cd backend
npm install
```

#### 运行测试
```bash
cd backend
npm run test:e2e
```

## 测试计划

完整的测试计划文档请参考 [test-plan.md](docs/test-plan.md)

### 测试用例覆盖

| 模块 | 测试用例数 | 优先级 |
|-----|----------|-------|
| 用户认证 | 3 | P0 |
| 记录管理 | 8 | P0-P1 |
| 数据统计 | 4 | P0-P1 |
| 界面交互 | 3 | P0-P1 |
| 性能测试 | 2 | P1 |
| 兼容性测试 | 2 | P2 |
| 边界测试 | 3 | P2 |

### 测试用例列表

| ID | 测试用例名称 | 优先级 |
|----|-------------|-------|
| TC-001 | 用户注册功能测试 | P0 |
| TC-002 | 用户登录功能测试 | P0 |
| TC-003 | 登录失败测试 | P1 |
| TC-004 | 今日汇总显示测试 | P0 |
| TC-005 | 记录列表显示测试 | P0 |
| TC-006 | 日期筛选功能测试 | P0 |
| TC-007 | 类型筛选功能测试 | P0 |
| TC-008 | 创建记录测试 | P0 |
| TC-009 | 语音输入记录测试 | P1 |
| TC-010 | 编辑记录测试 | P1 |
| TC-011 | 删除记录测试 | P0 |
| TC-012 | 统计页面导航测试 | P0 |
| TC-013 | 奶量趋势图表测试 | P0 |
| TC-014 | 换尿布次数图表测试 | P1 |
| TC-015 | 大便次数图表测试 | P1 |
| TC-016 | 用户登出测试 | P0 |
| TC-017 | 未认证访问测试 | P1 |
| TC-018 | 表单验证测试 | P1 |
| TC-019 | 页面加载性能测试 | P1 |
| TC-020 | API响应性能测试 | P1 |
| TC-021 | 响应式布局测试 | P2 |
| TC-022 | 跨浏览器兼容性测试 | P2 |
| TC-023 | 数据持久化测试 | P0 |
| TC-024 | 并发操作测试 | P2 |
| TC-025 | 边界值测试 | P2 |

## 测试数据

### 测试账号
- **主测试账号**: `xiaoha` / `123456`
- **临时测试账号**: `testuser_{timestamp}` / `test123456`

### 数据初始化
使用 `init-test-data.sh` 脚本生成测试数据：
```bash
cd tests
chmod +x init-test-data.sh
./init-test-data.sh
```

## 常见问题

### Q: 测试脚本无法找到输入框
**A**: 确保页面已完全加载，使用 `wait_for_selector` 等待元素出现：
```python
page.wait_for_selector('input[placeholder="请输入用户名"]', timeout=10000)
```

### Q: 登录测试返回 502 错误
**A**: 服务器可能还未完全启动，增加等待时间：
```python
time.sleep(5)  # 等待服务器初始化
```

### Q: 页面跳转超时
**A**: 增加超时时间或检查应用是否有错误：
```python
page.wait_for_url('**/', timeout=15000)
```

## 持续集成

### GitHub Actions 示例
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run E2E Tests
        run: |
          pip install playwright requests
          playwright install chromium
          python tests/e2e/python/test-e2e-complete.py
```

## 报告生成

测试完成后，会在终端输出测试报告，包含：
- 总测试用例数
- 通过/失败数量
- 通过率
- 每个测试用例的详细结果

---

**最后更新**: 2026-03-18
**版本**: 1.0
