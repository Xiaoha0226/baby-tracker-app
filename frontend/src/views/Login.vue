<template>
  <div class="login-page">
    <div class="login-container">
      <div class="logo-section">
        <div class="logo-icon animate-float">👶</div>
        <h1 class="app-title">宝宝记录</h1>
        <p class="app-subtitle">记录宝宝成长的每一天</p>
      </div>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input
            v-model="username"
            type="text"
            name="username"
            class="input-field"
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="password"
            type="password"
            name="password"
            class="input-field"
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
        
        <button type="submit" class="btn-primary btn-full" :disabled="authStore.loading">
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 360px;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-form {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 32px 24px;
  box-shadow: var(--shadow-card);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.btn-full {
  width: 100%;
  margin-top: 8px;
}

.error-message {
  background: #FFEBEE;
  color: #C62828;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  margin-bottom: 16px;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-secondary);
}

.register-link a {
  color: var(--primary-pink-dark);
  text-decoration: none;
  font-weight: 500;
}
</style>
