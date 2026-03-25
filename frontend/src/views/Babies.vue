<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabiesStore } from '@/stores/babies'
import type { CreateBabyDto } from '@/api'

const router = useRouter()
const babiesStore = useBabiesStore()

const showAddForm = ref(false)
const editingBaby = ref<number | null>(null)

const formData = ref<CreateBabyDto>({
  name: '',
  birthDate: new Date().toISOString().split('T')[0],
  gender: 'unknown'
})

const babies = computed(() => babiesStore.babies)
const loading = computed(() => babiesStore.loading)

onMounted(async () => {
  await babiesStore.fetchBabies()
})

function goBack() {
  router.push('/')
}

function resetForm() {
  formData.value = {
    name: '',
    birthDate: new Date().toISOString().split('T')[0],
    gender: 'unknown'
  }
}

function startAdd() {
  resetForm()
  showAddForm.value = true
  editingBaby.value = null
}

function startEdit(baby: any) {
  formData.value = {
    name: baby.name,
    birthDate: baby.birthDate.split('T')[0],
    gender: baby.gender
  }
  editingBaby.value = baby.id
  showAddForm.value = true
}

function cancelEdit() {
  showAddForm.value = false
  editingBaby.value = null
  resetForm()
}

async function saveBaby() {
  if (!formData.value.name) return
  
  if (editingBaby.value) {
    await babiesStore.updateBaby(editingBaby.value, formData.value)
  } else {
    await babiesStore.createBaby(formData.value)
  }
  
  showAddForm.value = false
  editingBaby.value = null
  resetForm()
}

async function deleteBaby(id: number) {
  if (confirm('确定要删除这个宝宝吗？相关的所有记录也会被删除。')) {
    await babiesStore.deleteBaby(id)
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function getGenderText(gender: string) {
  const map: Record<string, string> = {
    boy: '男宝',
    girl: '女宝',
    unknown: '未知'
  }
  return map[gender] || '未知'
}
</script>

<template>
  <div class="babies-page">
    <header class="page-header">
      <button class="back-btn" @click="goBack">
        ← 返回
      </button>
      <h1 class="page-title">宝宝管理</h1>
      <div class="placeholder"></div>
    </header>

    <div class="babies-list" v-if="!showAddForm">
      <div v-if="babies.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">👶</div>
        <p>还没有添加宝宝</p>
        <button class="add-btn" @click="startAdd">添加宝宝</button>
      </div>

      <div v-else class="baby-cards">
        <div v-for="baby in babies" :key="baby.id" class="baby-card">
          <div class="baby-info">
            <div class="baby-avatar">
              <img v-if="baby.avatar" :src="baby.avatar" :alt="baby.name" />
              <span v-else>👶</span>
            </div>
            <div class="baby-details">
              <h3 class="baby-name">{{ baby.name }}</h3>
              <p class="baby-meta">
                <span class="gender">{{ getGenderText(baby.gender) }}</span>
                <span class="birth-date">{{ formatDate(baby.birthDate) }}</span>
              </p>
            </div>
          </div>
          <div class="baby-actions">
            <button class="action-btn edit" @click="startEdit(baby)">编辑</button>
            <button class="action-btn delete" @click="deleteBaby(baby.id)">删除</button>
          </div>
        </div>

        <button class="add-baby-btn" @click="startAdd">
          <span class="plus">+</span>
          <span>添加宝宝</span>
        </button>
      </div>
    </div>

    <div class="baby-form" v-else>
      <h2>{{ editingBaby ? '编辑宝宝' : '添加宝宝' }}</h2>
      
      <div class="form-group">
        <label>姓名 <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="formData.name" 
          placeholder="请输入宝宝姓名"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label>出生日期 <span class="required">*</span></label>
        <input 
          type="date" 
          v-model="formData.birthDate"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label>性别</label>
        <div class="gender-options">
          <label class="gender-option" :class="{ active: formData.gender === 'boy' }">
            <input type="radio" v-model="formData.gender" value="boy" />
            <span>👦 男宝</span>
          </label>
          <label class="gender-option" :class="{ active: formData.gender === 'girl' }">
            <input type="radio" v-model="formData.gender" value="girl" />
            <span>👧 女宝</span>
          </label>
          <label class="gender-option" :class="{ active: formData.gender === 'unknown' }">
            <input type="radio" v-model="formData.gender" value="unknown" />
            <span>🤔 未知</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-secondary" @click="cancelEdit">取消</button>
        <button class="btn-primary" @click="saveBaby" :disabled="!formData.name">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.babies-page {
  padding: 0 20px;
  padding-bottom: 40px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  margin-bottom: 20px;
}

.back-btn {
  background: var(--soft-blue);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: var(--border-radius-full);
  border: none;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.placeholder {
  width: 60px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.add-btn {
  background: var(--primary-pink);
  color: white;
  padding: 12px 32px;
  border-radius: var(--border-radius-full);
  border: none;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
}

.baby-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.baby-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.baby-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.baby-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--soft-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  overflow: hidden;
}

.baby-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.baby-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.baby-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.baby-meta {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  display: flex;
  gap: 12px;
}

.baby-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: var(--border-radius-md);
  border: none;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
}

.action-btn.edit {
  background: var(--soft-blue);
  color: var(--text-primary);
}

.action-btn.delete {
  background: var(--soft-orange);
  color: var(--text-primary);
}

.add-baby-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: var(--white);
  border: 2px dashed var(--primary-pink-light);
  border-radius: var(--border-radius-lg);
  color: var(--primary-pink);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
}

.add-baby-btn:hover {
  background: var(--soft-pink);
}

.plus {
  font-size: 20px;
  font-weight: 300;
}

.baby-form {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-card);
}

.baby-form h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.required {
  color: var(--primary-pink);
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--primary-pink-light);
  border-radius: var(--border-radius-md);
  font-size: 16px;
  background: var(--white);
  color: var(--text-primary);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-pink);
  box-shadow: 0 0 0 4px rgba(255, 182, 193, 0.2);
}

.gender-options {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--primary-pink-light);
  border-radius: var(--border-radius-md);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gender-option input {
  display: none;
}

.gender-option.active {
  border-color: var(--primary-pink);
  background: var(--soft-pink);
}

.gender-option span {
  font-size: 14px;
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.form-actions button {
  flex: 1;
  padding: 12px 24px;
  border-radius: var(--border-radius-md);
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-primary {
  background: var(--primary-pink);
  color: white;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
