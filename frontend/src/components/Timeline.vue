<template>
  <div class="timeline">
    <div v-if="records.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p>暂无记录</p>
      <p class="empty-hint">长按下方按钮开始语音记录</p>
    </div>
    
    <div v-else class="timeline-list">
      <div
        v-for="record in records"
        :key="record.id"
        class="timeline-item"
      >
        <div class="timeline-time">
          {{ formatTime(record.recordTime) }}
        </div>
        <div class="timeline-dot" :class="`dot-${record.type}`"></div>
        <div class="timeline-content">
          <div class="record-header">
            <span class="record-icon">{{ RECORD_TYPE_EMOJI[record.type] }}</span>
            <span class="record-type">{{ RECORD_TYPE_NAME[record.type] }}</span>
            <button class="delete-btn" @click="$emit('delete', record.id)">×</button>
          </div>
          <div class="record-details">
            {{ formatDetails(record) }}
          </div>
          <div v-if="record.note" class="record-note">
            {{ record.note }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BabyRecord } from '@/api'
import { RECORD_TYPE_EMOJI, RECORD_TYPE_NAME } from '@/stores/records'

defineProps<{
  records: BabyRecord[]
}>()

defineEmits<{
  delete: [id: number]
}>()

function formatTime(datetime: string) {
  const date = new Date(datetime)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function formatDetails(record: BabyRecord) {
  const details = record.details || {}
  switch (record.type) {
    case 'feeding':
      return `${details.amount || 0}ml${details.side ? ` (${details.side === 'left' ? '左边' : '右边'})` : ''}`
    case 'diaper':
      return details.wet && details.dirty ? '湿了+脏了' : details.wet ? '湿了' : details.dirty ? '脏了' : '已更换'
    case 'poop':
      return details.consistency || '正常'
    case 'food':
      return `${details.food || '辅食'}${details.amount ? ` ${details.amount}` : ''}`
    case 'sleep':
      const duration = details.duration || 0
      const hours = Math.floor(duration / 60)
      const mins = duration % 60
      return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
    default:
      return details.description || ''
  }
}
</script>

<style scoped>
.timeline {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 8px;
}

.timeline-list {
  position: relative;
  padding-left: 60px;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 50px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary-pink-light), var(--soft-blue));
}

.timeline-item {
  position: relative;
  padding: 12px 0;
  display: flex;
  align-items: flex-start;
}

.timeline-time {
  position: absolute;
  left: -60px;
  width: 45px;
  text-align: right;
  font-size: 12px;
  color: var(--text-secondary);
  padding-top: 4px;
}

.timeline-dot {
  position: absolute;
  left: -16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--white);
  border: 3px solid var(--primary-pink);
  z-index: 1;
}

.dot-feeding { border-color: var(--primary-pink); }
.dot-diaper { border-color: var(--soft-blue); }
.dot-poop { border-color: var(--soft-orange); }
.dot-food { border-color: var(--mint-green); }
.dot-sleep { border-color: var(--soft-purple); }
.dot-other { border-color: var(--text-light); }

.timeline-content {
  flex: 1;
  background: var(--white);
  border-radius: var(--border-radius-md);
  padding: 12px 16px;
  box-shadow: var(--shadow-soft);
}

.record-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.record-icon {
  font-size: 18px;
}

.record-type {
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.delete-btn:hover {
  color: #C62828;
}

.record-details {
  font-size: 14px;
  color: var(--text-secondary);
}

.record-note {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed var(--primary-pink-light);
}
</style>
