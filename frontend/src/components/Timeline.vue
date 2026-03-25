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
            <div class="action-buttons">
              <button class="edit-btn" @click="handleEdit(record)">✏️</button>
              <button class="delete-btn" @click="emit('delete', record.id)">×</button>
            </div>
          </div>
          <div v-if="editingRecord?.id !== record.id" class="record-details">
            {{ formatDetails(record) }}
          </div>
          <div v-else class="edit-form">
            <div class="form-group">
              <label>记录时间</label>
              <input 
                type="datetime-local" 
                v-model="editForm.recordTime" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>备注</label>
              <textarea 
                v-model="editForm.note" 
                class="form-textarea"
                placeholder="添加备注..."
              ></textarea>
            </div>
            <!-- 详情编辑部分 -->
            <div v-if="editingRecord?.type === 'feeding'" class="form-group">
              <label>奶量 (ml)</label>
              <input 
                type="number" 
                v-model.number="editForm.details.amount" 
                class="form-input"
                placeholder="输入奶量"
                min="0"
              />
              <label class="mt-2">侧边</label>
              <select v-model="editForm.details.side" class="form-input">
                <option value="">请选择</option>
                <option value="left">左边</option>
                <option value="right">右边</option>
              </select>
            </div>
            <div v-else-if="editingRecord?.type === 'sleep'" class="form-group">
              <label>睡眠时长 (分钟)</label>
              <input 
                type="number" 
                v-model.number="editForm.details.duration" 
                class="form-input"
                placeholder="输入睡眠时长"
                min="0"
              />
            </div>
            <div v-else-if="editingRecord?.type === 'food'" class="form-group">
              <label>辅食名称</label>
              <input 
                type="text" 
                v-model="editForm.details.food" 
                class="form-input"
                placeholder="输入辅食名称"
              />
              <label class="mt-2">辅食量</label>
              <input 
                type="text" 
                v-model="editForm.details.amount" 
                class="form-input"
                placeholder="输入辅食量"
              />
            </div>
            <div v-else-if="editingRecord?.type === 'poop'" class="form-group">
              <label>大便情况</label>
              <input 
                type="text" 
                v-model="editForm.details.consistency" 
                class="form-input"
                placeholder="输入大便情况"
              />
            </div>
            <div v-else-if="editingRecord?.type === 'diaper'" class="form-group">
              <label>尿布情况</label>
              <div class="checkbox-group">
                <label>
                  <input type="checkbox" v-model="editForm.details.wet" />
                  湿了
                </label>
                <label>
                  <input type="checkbox" v-model="editForm.details.dirty" />
                  脏了
                </label>
              </div>
            </div>
            <div v-else-if="editingRecord?.type === 'other'" class="form-group">
              <label>描述</label>
              <input 
                type="text" 
                v-model="editForm.details.description" 
                class="form-input"
                placeholder="输入描述"
              />
            </div>
            <div class="form-actions">
              <button class="cancel-btn" @click="cancelEdit">取消</button>
              <button class="save-btn" @click="saveEdit">保存</button>
            </div>
          </div>
          <div v-if="editingRecord?.id !== record.id && record.note" class="record-note">
            {{ record.note }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BabyRecord } from '@/api'
import { RECORD_TYPE_EMOJI, RECORD_TYPE_NAME } from '@/stores/records'

defineProps<{
  records: BabyRecord[]
}>()

const emit = defineEmits<{
  delete: [id: number]
  edit: [record: BabyRecord]
}>()

const editingRecord = ref<BabyRecord | null>(null)
const editForm = ref<{
  recordTime: string
  note: string
  details: Record<string, any>
}>({
  recordTime: '',
  note: '',
  details: {}
})

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

function handleEdit(record: BabyRecord) {
  editingRecord.value = record
  // 确保recordTime格式正确转换为datetime-local格式（北京时间）
  let formattedRecordTime = ''
  try {
    if (record.recordTime) {
      // 将UTC时间转换为北京时间（UTC+8）
      const utcTime = new Date(record.recordTime)
      const beijingTime = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000)
      formattedRecordTime = beijingTime.toISOString().substring(0, 16)
    }
  } catch (error) {
    console.error('Error parsing recordTime:', error)
  }
  // 回填备注信息，确保卡片里的文案能够正确回填
  const note = record.note || ''
  // 回填详情信息，确保语音识别出来的文案能够正确回填
  const details = record.details || {}
  editForm.value.recordTime = formattedRecordTime
  editForm.value.note = note
  editForm.value.details = { ...details }
  console.log('Editing record:', record)
  console.log('Record recordTime (UTC):', record.recordTime)
  console.log('Formatted recordTime (Beijing):', formattedRecordTime)
  console.log('Note:', note)
  console.log('Details:', details)
}

function cancelEdit() {
  editingRecord.value = null
}

function saveEdit() {
  if (editingRecord.value) {
    const updatedRecord = {
      ...editingRecord.value,
      recordTime: editForm.value.recordTime,
      note: editForm.value.note,
      details: editForm.value.details
    }
    emit('edit', updatedRecord)
    editingRecord.value = null
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

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  color: var(--primary-pink);
}

.delete-btn:hover {
  color: #C62828;
}

.edit-form {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--primary-pink-light);
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-weight: 500;
}

.form-group label.mt-2 {
  margin-top: 8px;
}

.checkbox-group {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 0;
  cursor: pointer;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--primary-pink-light);
  border-radius: var(--border-radius-md);
  font-size: 14px;
  background: var(--white);
  color: var(--text-primary);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.cancel-btn, .save-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.save-btn {
  background: var(--primary-pink);
  color: white;
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
