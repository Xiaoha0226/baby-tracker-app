import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { babiesApi, type Baby, type CreateBabyDto } from '@/api'

export const useBabiesStore = defineStore('babies', () => {
  const babies = ref<Baby[]>([])
  const currentBabyId = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentBaby = computed(() => {
    return babies.value.find(b => b.id === currentBabyId.value) || babies.value[0] || null
  })

  const hasBabies = computed(() => babies.value.length > 0)

  function loadCurrentBabyFromStorage() {
    const stored = localStorage.getItem('currentBabyId')
    if (stored) {
      currentBabyId.value = parseInt(stored)
    }
  }

  function saveCurrentBabyToStorage() {
    if (currentBabyId.value) {
      localStorage.setItem('currentBabyId', currentBabyId.value.toString())
    }
  }

  async function fetchBabies() {
    loading.value = true
    error.value = null
    try {
      const res: any = await babiesApi.getAll()
      babies.value = res.data || res
      
      if (!currentBabyId.value && babies.value.length > 0) {
        currentBabyId.value = babies.value[0].id
        saveCurrentBabyToStorage()
      }
      
      return babies.value
    } catch (e: any) {
      error.value = e.message || '获取宝宝列表失败'
      return []
    } finally {
      loading.value = false
    }
  }

  async function createDefaultBaby() {
    loading.value = true
    error.value = null
    try {
      const res: any = await babiesApi.createDefault()
      const newBaby = res.data || res
      babies.value.push(newBaby)
      if (!currentBabyId.value) {
        currentBabyId.value = newBaby.id
        saveCurrentBabyToStorage()
      }
      return newBaby
    } catch (e: any) {
      error.value = e.message || '创建默认宝宝失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createBaby(data: CreateBabyDto) {
    loading.value = true
    error.value = null
    try {
      const res: any = await babiesApi.create(data)
      const newBaby = res.data || res
      babies.value.push(newBaby)
      if (!currentBabyId.value) {
        currentBabyId.value = newBaby.id
        saveCurrentBabyToStorage()
      }
      return newBaby
    } catch (e: any) {
      error.value = e.message || '创建宝宝失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateBaby(id: number, data: Partial<CreateBabyDto>) {
    loading.value = true
    error.value = null
    try {
      const res: any = await babiesApi.update(id, data)
      const updatedBaby = res.data || res
      const index = babies.value.findIndex(b => b.id === id)
      if (index !== -1) {
        babies.value[index] = updatedBaby
      }
      return updatedBaby
    } catch (e: any) {
      error.value = e.message || '更新宝宝失败'
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteBaby(id: number) {
    loading.value = true
    error.value = null
    try {
      await babiesApi.delete(id)
      babies.value = babies.value.filter(b => b.id !== id)
      
      if (currentBabyId.value === id) {
        currentBabyId.value = babies.value[0]?.id || null
        saveCurrentBabyToStorage()
      }
      
      return true
    } catch (e: any) {
      error.value = e.message || '删除宝宝失败'
      return false
    } finally {
      loading.value = false
    }
  }

  function setCurrentBaby(id: number) {
    const baby = babies.value.find(b => b.id === id)
    if (baby) {
      currentBabyId.value = id
      saveCurrentBabyToStorage()
    }
  }

  async function initBabies() {
    loadCurrentBabyFromStorage()
    await fetchBabies()
    
    if (babies.value.length === 0) {
      await createDefaultBaby()
    }
  }

  return {
    babies,
    currentBabyId,
    currentBaby,
    hasBabies,
    loading,
    error,
    fetchBabies,
    createBaby,
    createDefaultBaby,
    updateBaby,
    deleteBaby,
    setCurrentBaby,
    initBabies,
  }
})
