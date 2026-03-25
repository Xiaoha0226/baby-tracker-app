<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">设置</h1>
      <p class="page-subtitle">管理您的账户信息</p>
    </div>

    <!-- 个人信息卡片 -->
    <div class="settings-card">
      <div class="card-header">
        <span class="card-icon">👤</span>
        <h2 class="card-title">个人信息</h2>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">登录名</label>
          <input
            type="text"
            class="input-field readonly"
            :value="authStore.user?.username"
            readonly
          />
          <span class="field-hint">登录名不可修改</span>
        </div>
        <div class="form-group">
          <label class="form-label">显示名称</label>
          <input
            v-model="nickname"
            type="text"
            class="input-field"
            placeholder="请输入显示名称"
            :disabled="updatingProfile"
          />
          <span v-if="profileError" class="error-text">{{ profileError }}</span>
        </div>
        <button
          class="btn-primary"
          :disabled="updatingProfile || !nickname"
          @click="handleUpdateProfile"
        >
          {{ updatingProfile ? '保存中...' : '保存修改' }}
        </button>
      </div>
    </div>

    <!-- 修改密码卡片 -->
    <div class="settings-card">
      <div class="card-header">
        <span class="card-icon">🔒</span>
        <h2 class="card-title">修改密码</h2>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">当前密码</label>
          <input
            v-model="currentPassword"
            type="password"
            class="input-field"
            placeholder="请输入当前密码"
            :disabled="changingPassword"
          />
        </div>
        <div class="form-group">
          <label class="form-label">新密码</label>
          <input
            v-model="newPassword"
            type="password"
            class="input-field"
            placeholder="请输入新密码（至少6位）"
            :disabled="changingPassword"
          />
        </div>
        <div class="form-group">
          <label class="form-label">确认新密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="input-field"
            placeholder="请再次输入新密码"
            :disabled="changingPassword"
          />
          <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
        </div>
        <button
          class="btn-primary"
          :disabled="changingPassword || !canChangePassword"
          @click="handleChangePassword"
        >
          {{ changingPassword ? '修改中...' : '修改密码' }}
        </button>
      </div>
    </div>

    <!-- 成功提示 -->
    <Transition name="fade">
      <div v-if="successMessage" class="success-toast">
        <span class="success-icon">✓</span>
        {{ successMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 个人信息
const nickname = ref('')
const updatingProfile = ref(false)
const profileError = ref('')

// 修改密码
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const changingPassword = ref(false)
const passwordError = ref('')

// 成功提示
const successMessage = ref('')

const canChangePassword = computed(() => {
  return currentPassword.value && newPassword.value && confirmPassword.value
})

onMounted(() => {
  if (authStore.user?.nickname) {
    nickname.value = authStore.user.nickname
  }
})

function showSuccess(message: string) {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

async function handleUpdateProfile() {
  if (!nickname.value.trim()) {
    profileError.value = '显示名称不能为空'
    return
  }

  if (nickname.value.length > 50) {
    profileError.value = '显示名称不能超过 50 个字符'
    return
  }

  profileError.value = ''
  updatingProfile.value = true

  const result = await authStore.updateProfile(nickname.value.trim())

  if (result.success) {
    showSuccess('资料更新成功')
  } else {
    profileError.value = result.message
  }

  updatingProfile.value = false
}

async function handleChangePassword() {
  passwordError.value = ''

  if (newPassword.value.length < 6) {
    passwordError.value = '新密码至少需要 6 个字符'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = '两次输入的密码不一致'
    return
  }

  changingPassword.value = true

  const result = await authStore.changePassword(
    currentPassword.value,
    newPassword.value,
    confirmPassword.value
  )

  if (result.success) {
    showSuccess('密码修改成功')
    // 清空密码字段
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } else {
    passwordError.value = result.message
  }

  changingPassword.value = false
}
</script>

<style scoped>
.settings-page {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.settings-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-card);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--primary-pink-light);
}

.card-icon {
  font-size: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--primary-pink-light);
  border-radius: var(--border-radius-full);
  font-size: 15px;
  background: var(--white);
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  border-color: var(--primary-pink);
  box-shadow: 0 0 0 4px rgba(255, 182, 193, 0.2);
}

.input-field.readonly {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.field-hint {
  font-size: 12px;
  color: var(--text-light);
}

.error-text {
  font-size: 13px;
  color: #e53935;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-pink) 0%, var(--primary-pink-dark) 100%);
  color: var(--white);
  border: none;
  padding: 12px 24px;
  border-radius: var(--border-radius-full);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: all 0.3s ease;
  align-self: flex-start;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #4caf50;
  color: white;
  padding: 12px 24px;
  border-radius: var(--border-radius-full);
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
}

.success-icon {
  font-size: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
