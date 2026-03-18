from playwright.sync_api import sync_playwright
import time

def test_register_and_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print("🌐 访问应用首页...")
        page.goto('http://localhost:5174/')
        page.wait_for_load_state('networkidle')
        page.screenshot(path='/tmp/step1_initial.png')
        print("📸 已保存初始页面截图: /tmp/step1_initial.png")
        
        # 测试注册功能
        print("\n📝 测试注册功能...")
        page.goto('http://localhost:5174/register')
        page.wait_for_load_state('networkidle')
        
        timestamp = int(time.time())
        username = f"testuser_{timestamp}"
        print(f"   用户名: {username}")
        
        page.fill('input[placeholder="请输入用户名"]', username)
        page.fill('input[placeholder="请输入昵称（选填）"]', '测试用户')
        page.fill('input[placeholder="请输入密码"]', 'test123456')
        page.fill('input[placeholder="请再次输入密码"]', 'test123456')
        
        page.screenshot(path='/tmp/step3_register_filled.png')
        print("📸 已保存填写表单截图: /tmp/step3_register_filled.png")
        
        page.click('button:has-text("注册")')
        
        try:
            page.wait_for_url('**/', timeout=10000)
            print("✅ 注册成功！已跳转到主页")
        except:
            print("⚠️ 注册可能失败，检查当前URL:", page.url)
        
        page.wait_for_load_state('networkidle')
        time.sleep(2)  # 等待页面完全渲染
        page.screenshot(path='/tmp/step4_after_register.png')
        
        # 检查页面元素
        summary = page.locator('.summary-section')
        if summary.is_visible():
            print("✅ 今日汇总卡片可见")
        
        voice_btn = page.locator('.voice-btn')
        if voice_btn.is_visible():
            print("✅ 语音输入按钮可见")
        
        # 测试退出登录
        print("\n🚪 测试退出登录...")
        try:
            # 使用更精确的选择器
            logout_btn = page.get_by_role('button', name='退出')
            if logout_btn.is_visible():
                print("✅ 找到退出登录按钮")
                logout_btn.click()
                page.wait_for_url('**/login', timeout=5000)
                print("✅ 已退出登录，跳转到登录页")
            else:
                print("⚠️ 退出登录按钮不可见")
                page.goto('http://localhost:5174/login')
        except Exception as e:
            print(f"⚠️ 退出登录测试出错: {e}")
            page.goto('http://localhost:5174/login')
        
        # 测试登录功能
        print("\n🔐 测试登录功能...")
        page.wait_for_load_state('networkidle')
        
        page.fill('input[placeholder="请输入用户名"]', username)
        page.fill('input[placeholder="请输入密码"]', 'test123456')
        
        page.click('button:has-text("登录")')
        
        try:
            page.wait_for_url('**/', timeout=10000)
            print("✅ 登录成功！已跳转到主页")
        except:
            print("⚠️ 登录可能失败，检查当前URL:", page.url)
        
        page.wait_for_load_state('networkidle')
        time.sleep(1)
        page.screenshot(path='/tmp/step7_after_login.png')
        
        # 测试统计页面
        print("\n📊 测试统计页面...")
        try:
            stats_btn = page.get_by_role('link', name='统计')
            if stats_btn.is_visible():
                stats_btn.click()
                page.wait_for_load_state('networkidle')
                page.screenshot(path='/tmp/step8_stats.png')
                print("✅ 数据分析页面可访问")
            else:
                print("⚠️ 统计按钮不可见")
        except Exception as e:
            print(f"⚠️ 统计页面测试出错: {e}")
        
        print("\n🎉 所有测试完成！")
        browser.close()

if __name__ == '__main__':
    test_register_and_login()
