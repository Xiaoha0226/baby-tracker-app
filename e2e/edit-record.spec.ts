import { test, expect } from '@playwright/test';

test.describe('编辑记录功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 登录测试用户
    await page.goto('/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('编辑记录功能测试', async ({ page }) => {
    // 等待记录加载
    await page.waitForSelector('.timeline-item');

    // 获取第一个记录项
    const firstRecord = page.locator('.timeline-item').first();
    await firstRecord.scrollIntoViewIfNeeded();

    // 点击编辑按钮
    await firstRecord.locator('.edit-btn').click();

    // 等待编辑表单出现
    await page.waitForSelector('.edit-form');

    // 检查表单是否正确回填数据
    const recordTimeInput = firstRecord.locator('.form-input[type="datetime-local"]');
    const noteTextarea = firstRecord.locator('.form-textarea');

    // 验证记录时间输入框有值
    const recordTimeValue = await recordTimeInput.inputValue();
    expect(recordTimeValue).toBeTruthy();

    // 输入新的备注
    const newNote = '测试编辑功能';
    await noteTextarea.fill(newNote);

    // 点击保存按钮
    await firstRecord.locator('.save-btn').click();

    // 等待编辑表单消失
    await page.waitForSelector('.edit-form', { state: 'hidden' });

    // 验证备注已更新
    const updatedNote = firstRecord.locator('.record-note');
    await expect(updatedNote).toHaveText(newNote);
  });

  test('取消编辑功能测试', async ({ page }) => {
    // 等待记录加载
    await page.waitForSelector('.timeline-item');

    // 获取第一个记录项
    const firstRecord = page.locator('.timeline-item').first();
    await firstRecord.scrollIntoViewIfNeeded();

    // 点击编辑按钮
    await firstRecord.locator('.edit-btn').click();

    // 等待编辑表单出现
    await page.waitForSelector('.edit-form');

    // 输入新的备注
    const noteTextarea = firstRecord.locator('.form-textarea');
    await noteTextarea.fill('测试取消编辑');

    // 点击取消按钮
    await firstRecord.locator('.cancel-btn').click();

    // 等待编辑表单消失
    await page.waitForSelector('.edit-form', { state: 'hidden' });

    // 验证备注未更新（应该保持原始值）
    const recordNote = firstRecord.locator('.record-note');
    // 这里我们假设原始备注不是"测试取消编辑"
    await expect(recordNote).not.toHaveText('测试取消编辑');
  });
});
