import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recordsApi, aiApi, type BabyRecord, type CreateRecordDto, type TodaySummary, type StatsData } from '@/api'

export type RecordType = 'feeding' | 'diaper' | 'poop' | 'food' | 'sleep' | 'other'

export const RECORD_TYPE_EMOJI: Record<RecordType, string> = {
  feeding: '🍼',
  diaper: '👶',
  poop: '💩',
  food: '🥣',
  sleep: '😴',
  other: '📝'
}

export const RECORD_TYPE_NAME: Record<RecordType, string> = {
  feeding: '喂奶',
  diaper: '换尿布',
  poop: '大便',
  food: '辅食',
  sleep: '睡眠',
  other: '其他'
}

export const useRecordsStore = defineStore('records', () => {
  const records = ref<BabyRecord[]>([])
  const todaySummary = ref<TodaySummary | null>(null)
  const statsData = ref<StatsData[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedDate = ref(new Date().toISOString().split('T')[0])
  const selectedType = ref<RecordType | ''>('')

  const filteredRecords = computed(() => {
    let result = records.value
    if (selectedType.value) {
      result = result.filter(r => r.type === selectedType.value)
    }
    return result.sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime())
  })

  async function fetchRecords(date?: string, babyId?: number) {
    loading.value = true
    error.value = null
    try {
      const params: any = {}
      if (date) {
        params.date = date
      }
      if (babyId) {
        params.babyId = babyId
      }
      const res: any = await recordsApi.getAll(params)
      records.value = res.data || res
    } catch (e: any) {
      error.value = e.message || '获取记录失败'
    } finally {
      loading.value = false
    }
  }

  async function fetchTodaySummary(babyId?: number) {
    try {
      const res: any = await recordsApi.getTodaySummary(babyId)
      todaySummary.value = res.data || res
    } catch (e) {
      console.error('获取今日汇总失败', e)
    }
  }

  async function createRecord(data: CreateRecordDto) {
    loading.value = true
    error.value = null
    try {
      const res: any = await recordsApi.create(data)
      const newRecord = res.data || res
      records.value.unshift(newRecord)
      await fetchTodaySummary(data.babyId)
      return newRecord
    } catch (e: any) {
      error.value = e.message || '创建记录失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteRecord(id: number) {
    try {
      await recordsApi.delete(id)
      records.value = records.value.filter(r => r.id !== id)
      await fetchTodaySummary()
      return true
    } catch (e: any) {
      console.error('删除记录失败:', e)
      error.value = e.message || '删除记录失败'
      return false
    }
  }

  async function updateRecord(id: number, data: Partial<CreateRecordDto>) {
    loading.value = true
    error.value = null
    try {
      const res: any = await recordsApi.update(id, data)
      const updatedRecord = res.data || res
      const index = records.value.findIndex(r => r.id === id)
      if (index !== -1) {
        records.value[index] = updatedRecord
      }
      await fetchTodaySummary()
      return updatedRecord
    } catch (e: any) {
      error.value = e.message || '更新记录失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function analyzeVoiceText(text: string): Promise<CreateRecordDto[] | null> {
    loading.value = true
    error.value = null
    try {
      const res: any = await aiApi.analyze(text)
      return res.data || res
    } catch (e: any) {
      error.value = e.message || 'AI分析失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchStats(type: string, days: number = 30, babyId?: number) {
    loading.value = true
    try {
      const res: any = await recordsApi.getStats(type, babyId, days)
      statsData.value = res.data || res
    } catch (e) {
      console.error('获取统计数据失败', e)
    } finally {
      loading.value = false
    }
  }

  return {
    records,
    todaySummary,
    statsData,
    loading,
    error,
    selectedDate,
    selectedType,
    filteredRecords,
    fetchRecords,
    fetchTodaySummary,
    createRecord,
    deleteRecord,
    updateRecord,
    analyzeVoiceText,
    fetchStats
  }
})
