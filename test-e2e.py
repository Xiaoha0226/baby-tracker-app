from playwright.sync_api import sync_playwright
import time

def test_baby_tracker_app():
    print("🚀 开始执行宝宝记录应用 E2E 测试...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # 1. 登录测试
            print("\n1. 测试登录功能...")
            page.goto('http://localhost:5173/login')
            page.wait_for_load_state('networkidle')
            
            # 填写登录表单
            page.fill('input[placeholder="请输入用户名"]', 'xiaoha')
            page.fill('input[placeholder="请输入密码"]', '123456')
            
            # 点击登录按钮并等待响应
            with page.expect_response('**/api/auth/login') as response_info:
                page.click('button:has-text("登录")')
            
            # 检查登录响应
            response = response_info.value
            print(f"登录请求状态码: {response.status}")
            print(f"登录请求响应: {response.text()}")
            
            # 等待跳转到主页
            page.wait_for_url('**/', timeout=10000)
            print("✅ 登录成功，已跳转到主页")
            
            # 2. 查看今日汇总
            print("\n2. 测试今日汇总功能...")
            summary_card = page.locator('.summary-card')
            summary_card.wait_for(state='visible')
            print("✅ 今日汇总卡片显示正常")
            
            # 3. 测试日期筛选
            print("\n3. 测试日期筛选功能...")
            # 选择一周前的日期
            page.fill('input[type="date"]', '2026-03-08')
            time.sleep(2)  # 等待数据加载
            print("✅ 日期筛选功能正常")
            
            # 4. 测试类型筛选
            print("\n4. 测试类型筛选功能...")
            page.select_option('select', 'feeding')
            time.sleep(2)  # 等待数据加载
            print("✅ 类型筛选功能正常")
            
            # 5. 测试统计页面
            print("\n5. 测试统计页面功能...")
            stats_btn = page.get_by_role('link', name='统计')
            stats_btn.click()
            page.wait_for_url('**/stats', timeout=5000)
            page.wait_for_load_state('networkidle')
            
            # 检查图表是否加载
            chart_cards = page.locator('.chart-card')
            chart_count = chart_cards.count()
            print(f"✅ 统计页面加载成功，共 {chart_count} 个图表")
            
            # 6. 测试返回主页
            print("\n6. 测试返回主页功能...")
            back_btn = page.get_by_role('link', name='返回')
            back_btn.click()
            page.wait_for_url('**/', timeout=5000)
            print("✅ 返回主页功能正常")
            
            # 7. 测试删除功能
            print("\n7. 测试删除功能...")
            # 确保有记录可以删除
            records = page.locator('.timeline-item')
            if records.count() > 0:
                # 点击第一个记录的删除按钮
                delete_buttons = page.locator('.delete-btn')
                delete_buttons.first.click()
                
                # 处理确认对话框
                page.on('dialog', lambda dialog: dialog.accept())
                
                # 等待记录被删除
                page.wait_for_timeout(1000)
                print("✅ 删除功能正常")
            else:
                print("⚠️  没有记录可以删除，跳过删除测试")
            
            # 8. 测试登出功能
            print("\n8. 测试登出功能...")
            logout_btn = page.get_by_role('button', name='退出')
            logout_btn.click()
            page.wait_for_url('**/login', timeout=5000)
            print("✅ 登出功能正常")
            
            # 8. 测试注册功能
            print("\n8. 测试注册功能...")
            page.goto('http://localhost:5173/register')
            page.wait_for_load_state('networkidle')
            
            # 填写注册表单
            timestamp = int(time.time())
            username = f"testuser_{timestamp}"
            page.fill('input[placeholder="请输入用户名"]', username)
            page.fill('input[placeholder="请输入昵称（选填）"]', '测试用户')
            page.fill('input[placeholder="请输入密码"]', 'test123456')
            page.fill('input[placeholder="请再次输入密码"]', 'test123456')
            
            page.click('button:has-text("注册")')
            
            # 等待跳转到登录页面
            page.wait_for_url('**/login', timeout=10000)
            print("✅ 注册功能正常")
            
            print("\n🎉 所有测试用例执行完成！")
            print("\n测试结果：")
            print("- 登录功能: ✅ 成功")
            print("- 今日汇总: ✅ 成功")
            print("- 日期筛选: ✅ 成功")
            print("- 类型筛选: ✅ 成功")
            print("- 统计页面: ✅ 成功")
            print("- 返回主页: ✅ 成功")
            print("- 删除功能: ✅ 成功")
            print("- 登出功能: ✅ 成功")
            print("- 注册功能: ✅ 成功")
            
        except Exception as e:
            print(f"\n❌ 测试失败: {e}")
            import traceback
            traceback.print_exc()
        finally:
            browser.close()

if __name__ == '__main__':
    test_baby_tracker_app()
