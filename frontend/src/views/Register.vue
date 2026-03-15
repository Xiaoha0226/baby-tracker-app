<template>
  <div class="register-page">
    <div class="register-container">
      <div class="logo-section">
        <div class="logo-icon animate-float">👶</div>
        <h1 class="app-title">注册账号</h1>
        <p class="app-subtitle">开始记录宝宝的成长</p>
      </div>
      
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名</label>
          <input
            v-model="username"
            type="text"
            class="input-field"
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label>昵称</label>
          <input
            v-model="nickname"
            type="text"
            class="input-field"
            placeholder="请输入昵称（选填）"
          />
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-group">
          <label>确认密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="input-field"
            placeholder="请再次输入密码"
            required
          />
        </div>
        
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
        
        <div v-if="localError" class="error-message">
          {{ localError }}
        </div>
        
        <button type="submit" class="btn-primary btn-full" :disabled="authStore.loading">
          {{ authStore.loading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
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
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref('')

async function handleRegister() {
  localError.value = ''
  
  if (password.value !== confirmPassword.value) {
    localError.value = '两次输入的密码不一致'
    return
  }
  
  if (password.value.length < 6) {
    localError.value = '密码长度至少6位'
    return
  }
  
  const success = await authStore.register(username.value, password.value, nickname.value || undefined)
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 360px;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  font-size: 60px;
  margin-bottom: 12px;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.register-form {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 32px 24px;
  box-shadow: var(--shadow-card);
}

.form-group {
  margin-bottom: 16px;
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

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-secondary);
}

.login-link a {
  color: var(--primary-pink-dark);
  text-decoration: none;
  font-weight: 500;
}
</style>
