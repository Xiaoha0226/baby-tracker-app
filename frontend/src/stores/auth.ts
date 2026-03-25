import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type User } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function init() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  async function register(username: string, password: string, nickname?: string) {
    loading.value = true
    error.value = null
    try {
      const res: any = await authApi.register({ username, password, nickname })
      if (res.code === 0) {
        token.value = res.data.access_token
        user.value = res.data.user
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        return true
      } else {
        error.value = res.message
        return false
      }
    } catch (e: any) {
      error.value = e.message || '注册失败'
      return false
    } finally {
      loading.value = false
    }
  }

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res: any = await authApi.login({ username, password })
      // 检查响应格式，适应API拦截器的行为
      if (res.access_token) {
        // 直接返回了data字段的情况
        token.value = res.access_token
        user.value = res.user
        localStorage.setItem('token', res.access_token)
        localStorage.setItem('user', JSON.stringify(res.user))
        return true
      } else if (res.code === 0 && res.data?.access_token) {
        // 完整响应格式的情况
        token.value = res.data.access_token
        user.value = res.data.user
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        return true
      } else {
        error.value = res.message || '登录失败'
        return false
      }
    } catch (e: any) {
      error.value = e.message || '登录失败'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const res: any = await authApi.getProfile()
      if (res.code === 0) {
        user.value = res.data
        localStorage.setItem('user', JSON.stringify(res.data))
      }
    } catch (e) {
      logout()
    }
  }

  async function updateProfile(nickname: string) {
    loading.value = true
    error.value = null
    try {
      const res: any = await authApi.updateProfile({ nickname })
      if (res.code === 0) {
        user.value = res.data
        localStorage.setItem('user', JSON.stringify(res.data))
        return { success: true, message: res.message }
      } else {
        error.value = res.message
        return { success: false, message: res.message }
      }
    } catch (e: any) {
      const msg = e.message || '更新失败'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    loading.value = true
    error.value = null
    try {
      const res: any = await authApi.changePassword({ currentPassword, newPassword, confirmPassword })
      if (res.code === 0) {
        return { success: true, message: res.message }
      } else {
        error.value = res.message
        return { success: false, message: res.message }
      }
    } catch (e: any) {
      const msg = e.message || '密码修改失败'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    init,
    register,
    login,
    logout,
    fetchProfile,
    updateProfile,
    changePassword
  }
})
