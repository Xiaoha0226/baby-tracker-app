<template>
  <div class="home-page">
    <header class="page-header">
      <router-link to="/stats" class="stats-btn" role="link" aria-label="统计数据">
        📊 统计
      </router-link>
      <div class="date-display">
        {{ formatDate(selectedDate) }}
      </div>
      <button class="logout-btn" @click="handleLogout" type="button" aria-label="退出登录">
        退出
      </button>
    </header>
    
    <div class="summary-card-container">
      <div class="summary-card">
        <h3 class="summary-title">今日汇总</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-icon">🍼</div>
            <div class="summary-content">
              <div class="summary-value">{{ todaySummary?.totalMilk || 0 }}<span class="summary-unit">ml</span></div>
              <div class="summary-label">奶量</div>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-icon">👶</div>
            <div class="summary-content">
              <div class="summary-value">{{ todaySummary?.diaperCount || 0 }}<span class="summary-unit">次</span></div>
              <div class="summary-label">换尿布</div>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-icon">😴</div>
            <div class="summary-content">
              <div class="summary-value">{{ formatDuration(todaySummary?.sleepDuration || 0) }}</div>
              <div class="summary-label">睡眠</div>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-icon">💩</div>
            <div class="summary-content">
              <div class="summary-value">{{ todaySummary?.poopCount || 0 }}<span class="summary-unit">次</span></div>
              <div class="summary-label">大便</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="filter-section">
      <div class="filter-row">
        <div class="date-picker">
          <input
            type="date"
            v-model="selectedDate"
            class="date-input"
            @change="handleDateChange"
          />
        </div>
        <div class="type-filter">
          <select
            v-model="selectedType"
            class="filter-select"
            @change="handleTypeChange"
          >
            <option value="">全部类型</option>
            <option
              v-for="(name, type) in RECORD_TYPE_NAME"
              :key="type"
              :value="type"
            >
              {{ RECORD_TYPE_EMOJI[type as RecordType] }} {{ name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="records-section">
      <Timeline :records="filteredRecords" @delete="handleDelete" @edit="handleEdit" />
    </div>
    
    <VoiceInput @record="handleVoiceRecord" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRecordsStore, RECORD_TYPE_EMOJI, RECORD_TYPE_NAME, type RecordType } from '@/stores/records'
import SummaryCard from '@/components/SummaryCard.vue'
import Timeline from '@/components/Timeline.vue'
import VoiceInput from '@/components/VoiceInput.vue'

const router = useRouter()
const authStore = useAuthStore()
const recordsStore = useRecordsStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])

const todaySummary = computed(() => recordsStore.todaySummary)
const filteredRecords = computed(() => recordsStore.filteredRecords)
const selectedType = computed({
  get: () => recordsStore.selectedType,
  set: (value) => { recordsStore.selectedType = value }
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  
  if (isToday) {
    return '今天'
  }
  
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h${mins > 0 ? mins + 'm' : ''}`
  }
  return `${mins}m`
}

async function handleDateChange() {
  await recordsStore.fetchRecords(selectedDate.value)
}

function handleTypeChange() {
  // 类型筛选自动应用，不需要额外操作
  // filteredRecords 计算属性会自动处理
}

async function handleDelete(id: number) {
  if (confirm('确定要删除这条记录吗？')) {
    await recordsStore.deleteRecord(id)
  }
}

async function handleEdit(record: any) {
  try {
    // 确保recordTime格式正确
    const recordTime = new Date(record.recordTime)
    if (!isNaN(recordTime.getTime())) {
      await recordsStore.updateRecord(record.id, {
        type: record.type,
        recordTime: record.recordTime,
        note: record.note,
        details: record.details
      })
    } else {
      console.error('Invalid recordTime:', record.recordTime)
    }
  } catch (error) {
    console.error('编辑记录失败:', error)
  }
}

async function handleVoiceRecord(records: any[]) {
  for (const record of records) {
    await recordsStore.createRecord({
      type: record.type,
      recordTime: record.recordTime,
      details: record.details,
      note: record.note
    })
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  await recordsStore.fetchRecords(selectedDate.value)
  await recordsStore.fetchTodaySummary()
})

watch(selectedDate, async () => {
  await recordsStore.fetchRecords(selectedDate.value)
})
</script>

<style scoped>
.home-page {
  padding: 0 20px;
  padding-bottom: 120px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  margin-bottom: 20px;
}

.stats-btn {
  background: var(--soft-blue);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: var(--border-radius-full);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.date-display {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.logout-btn {
  background: var(--soft-orange);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: var(--border-radius-full);
  border: none;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.summary-card-container {
  margin-bottom: 20px;
}

.summary-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}

.summary-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.summary-content {
  text-align: center;
}

.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.summary-unit {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
  margin-left: 2px;
}

.summary-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-picker {
  flex: 1;
}

.date-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--primary-pink-light);
  border-radius: var(--border-radius-md);
  font-size: 16px;
  background: var(--white);
  color: var(--text-primary);
}

.type-filter {
  flex: 1;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--primary-pink-light);
  border-radius: var(--border-radius-md);
  font-size: 16px;
  background: var(--white);
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238D6E63' viewBox='0 0 16 16'%3E%3Cpath d='M8 11.5a.5.5 0 0 1-.5-.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11a.5.5 0 0 1-.5.5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.filter-select:focus {
  border-color: var(--primary-pink);
  box-shadow: 0 0 0 4px rgba(255, 182, 193, 0.2);
}

.records-section {
  min-height: 200px;
}
</style>
