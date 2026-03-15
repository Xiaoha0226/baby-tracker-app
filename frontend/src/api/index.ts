import axios from 'axios'
import type { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

export interface ApiResponse<T = any> {
  code?: number
  message?: string
  data?: T
}

export interface User {
  id: number
  username: string
  nickname: string
}

export interface LoginResponse {
  message: string
  user: User
  token: string
}

export interface BabyRecord {
  id: number
  type: 'feeding' | 'diaper' | 'poop' | 'food' | 'sleep' | 'other'
  recordTime: string
  details: Record<string, any>
  note?: string
  createdAt: string
}

export interface CreateRecordDto {
  type: string
  recordTime: string
  details?: Record<string, any>
  note?: string
}

export interface TodaySummary {
  totalMilk: number
  diaperCount: number
  sleepDuration: number
  poopCount: number
  foodCount: number
}

export interface StatsData {
  date: string
  value: number
}

export const authApi = {
  register: (data: { username: string; password: string; nickname?: string }) =>
    api.post<any, any>('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post<any, any>('/auth/login', data),
  
  getProfile: () =>
    api.get<any, any>('/auth/profile')
}

export const recordsApi = {
  create: (data: CreateRecordDto) =>
    api.post<any, any>('/records', data),
  
  getAll: (params?: { type?: string; date?: string; startDate?: string; endDate?: string }) =>
    api.get<any, any>('/records', { params }),
  
  getById: (id: number) =>
    api.get<any, any>(`/records/${id}`),
  
  update: (id: number, data: Partial<CreateRecordDto>) =>
    api.put<any, any>(`/records/${id}`, data),
  
  delete: (id: number) =>
    api.delete<any, any>(`/records/${id}`),
  
  getTodaySummary: () =>
    api.get<any, any>('/records/today-summary'),
  
  getStats: (type: string, days?: number) =>
    api.get<any, any>('/records/stats', { params: { type, days } })
}

export const aiApi = {
  analyze: (text: string) =>
    api.post<any, any>('/ai/analyze', { text }),
  
  chat: (message: string) =>
    api.post<any, any>('/ai/chat', { message })
}

export default api
