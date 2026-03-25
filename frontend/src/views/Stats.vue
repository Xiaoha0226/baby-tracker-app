<template>
  <div class="stats-page">
    <header class="page-header">
      <router-link to="/" class="back-btn">
        ← 返回
      </router-link>
      <h1 class="page-title">数据分析</h1>
      <div class="placeholder"></div>
    </header>
    
    <div class="baby-info-bar" v-if="currentBaby">
      <span class="baby-label">当前宝宝:</span>
      <span class="baby-name">{{ currentBaby.name }}</span>
    </div>
    
    <div class="chart-section">
      <div class="chart-card">
        <h3 class="chart-title">🍼 奶量趋势</h3>
        <div class="chart-container">
          <Line :data="milkChartData" :options="chartOptions" v-if="milkChartData.labels.length" />
          <div v-else class="no-data">暂无数据</div>
        </div>
      </div>
      
      <div class="chart-card">
        <h3 class="chart-title">👶 换尿布次数</h3>
        <div class="chart-container">
          <Line :data="diaperChartData" :options="chartOptions" v-if="diaperChartData.labels.length" />
          <div v-else class="no-data">暂无数据</div>
        </div>
      </div>
      
      <div class="chart-card">
        <h3 class="chart-title">💩 大便次数</h3>
        <div class="chart-container">
          <Line :data="poopChartData" :options="chartOptions" v-if="poopChartData.labels.length" />
          <div v-else class="no-data">暂无数据</div>
        </div>
      </div>
      
      <div class="chart-card">
        <h3 class="chart-title">😴 睡眠时长</h3>
        <div class="chart-container">
          <Line :data="sleepChartData" :options="chartOptions" v-if="sleepChartData.labels.length" />
          <div v-else class="no-data">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useRecordsStore } from '@/stores/records'
import { useBabiesStore } from '@/stores/babies'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const recordsStore = useRecordsStore()
const babiesStore = useBabiesStore()

const milkData = ref<{ date: string; value: number }[]>([])
const diaperData = ref<{ date: string; value: number }[]>([])
const poopData = ref<{ date: string; value: number }[]>([])
const sleepData = ref<{ date: string; value: number }[]>([])

const currentBaby = computed(() => babiesStore.currentBaby)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 182, 193, 0.2)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const milkChartData = computed(() => ({
  labels: milkData.value.map(d => d.date),
  datasets: [{
    data: milkData.value.map(d => d.value),
    borderColor: '#FFB6C1',
    backgroundColor: 'rgba(255, 182, 193, 0.2)',
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#FFB6C1'
  }]
}))

const diaperChartData = computed(() => ({
  labels: diaperData.value.map(d => d.date),
  datasets: [{
    data: diaperData.value.map(d => d.value),
    borderColor: '#BBDEFB',
    backgroundColor: 'rgba(187, 222, 251, 0.2)',
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#BBDEFB'
  }]
}))

const poopChartData = computed(() => ({
  labels: poopData.value.map(d => d.date),
  datasets: [{
    data: poopData.value.map(d => d.value),
    borderColor: '#FFE0B2',
    backgroundColor: 'rgba(255, 224, 178, 0.2)',
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#FFE0B2'
  }]
}))

const sleepChartData = computed(() => ({
  labels: sleepData.value.map(d => d.date),
  datasets: [{
    data: sleepData.value.map(d => d.value),
    borderColor: '#E1BEE7',
    backgroundColor: 'rgba(225, 190, 231, 0.2)',
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#E1BEE7'
  }]
}))

async function loadStats() {
  if (!currentBaby.value) return
  
  const babyId = currentBaby.value.id
  
  await recordsStore.fetchStats('feeding', 30, babyId)
  milkData.value = recordsStore.statsData.map(d => ({
    date: d.date.slice(5),
    value: d.value
  }))
  
  await recordsStore.fetchStats('diaper', 30, babyId)
  diaperData.value = recordsStore.statsData.map(d => ({
    date: d.date.slice(5),
    value: d.value
  }))
  
  await recordsStore.fetchStats('poop', 30, babyId)
  poopData.value = recordsStore.statsData.map(d => ({
    date: d.date.slice(5),
    value: d.value
  }))
  
  await recordsStore.fetchStats('sleep', 30, babyId)
  sleepData.value = recordsStore.statsData.map(d => ({
    date: d.date.slice(5),
    value: Math.round(d.value / 60)
  }))
}

onMounted(async () => {
  await babiesStore.initBabies()
  await loadStats()
})

watch(() => babiesStore.currentBabyId, async () => {
  await loadStats()
})
</script>

<style scoped>
.stats-page {
  padding: 0 20px;
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  margin-bottom: 20px;
}

.back-btn {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.placeholder {
  width: 40px;
}

.baby-info-bar {
  background: var(--soft-pink);
  padding: 10px 16px;
  border-radius: var(--border-radius-md);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.baby-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.baby-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-card);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.chart-container {
  height: 200px;
}

.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: 14px;
}
</style>
