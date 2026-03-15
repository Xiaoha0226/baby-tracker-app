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
    
    <div class="summary-section">
      <SummaryCard
        title="今日奶量"
        :value="todaySummary?.totalMilk || 0"
        unit="ml"
        icon="🍼"
        color="pink"
      />
      <SummaryCard
        title="换尿布"
        :value="todaySummary?.diaperCount || 0"
        unit="次"
        icon="👶"
        color="blue"
      />
      <SummaryCard
        title="睡眠时长"
        :value="formatDuration(todaySummary?.sleepDuration || 0)"
        unit=""
        icon="😴"
        color="purple"
      />
      <SummaryCard
        title="大便次数"
        :value="todaySummary?.poopCount || 0"
        unit="次"
        icon="💩"
        color="yellow"
      />
    </div>
    
    <div class="filter-section">
      <div class="date-picker">
        <input
          type="date"
          v-model="selectedDate"
          class="date-input"
          @change="handleDateChange"
        />
      </div>
      <div class="type-filter">
        <button
          v-for="(name, type) in RECORD_TYPE_NAME"
          :key="type"
          :class="['filter-btn', { active: selectedType === type }]"
          @click="selectedType = selectedType === type ? '' : type as RecordType"
        >
          {{ RECORD_TYPE_EMOJI[type as RecordType] }} {{ name }}
        </button>
      </div>
    </div>
    
    <div class="records-section">
      <Timeline :records="filteredRecords" @delete="handleDelete" />
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
const selectedType = ref<RecordType | ''>('')

const todaySummary = computed(() => recordsStore.todaySummary)
const filteredRecords = computed(() => recordsStore.filteredRecords)

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

async function handleDelete(id: number) {
  if (confirm('确定要删除这条记录吗？')) {
    await recordsStore.deleteRecord(id)
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

.summary-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.filter-section {
  margin-bottom: 20px;
}

.date-picker {
  margin-bottom: 12px;
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  background: var(--white);
  border: 2px solid var(--primary-pink-light);
  padding: 8px 12px;
  border-radius: var(--border-radius-full);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.filter-btn.active {
  background: var(--primary-pink);
  border-color: var(--primary-pink);
  color: var(--white);
}

.records-section {
  min-height: 200px;
}
</style>
