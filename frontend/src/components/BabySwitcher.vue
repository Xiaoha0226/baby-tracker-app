<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBabiesStore } from '@/stores/babies'

const router = useRouter()
const babiesStore = useBabiesStore()
const isOpen = ref(false)

const currentBaby = computed(() => babiesStore.currentBaby)
const babies = computed(() => babiesStore.babies)
const hasMultipleBabies = computed(() => babies.value.length > 1)

function toggleDropdown() {
  if (babies.value.length > 0) {
    isOpen.value = !isOpen.value
  }
}

function selectBaby(babyId: number) {
  babiesStore.setCurrentBaby(babyId)
  isOpen.value = false
}

function goToManageBabies() {
  router.push('/babies')
  isOpen.value = false
}

function closeDropdown() {
  isOpen.value = false
}
</script>

<template>
  <div class="baby-switcher" v-click-outside="closeDropdown">
    <button 
      class="baby-switcher-btn"
      @click="toggleDropdown"
      :class="{ 'has-dropdown': hasMultipleBabies }"
    >
      <span class="baby-avatar" v-if="currentBaby?.avatar">
        <img :src="currentBaby.avatar" :alt="currentBaby.name" />
      </span>
      <span class="baby-avatar default" v-else>👶</span>
      <span class="baby-name">{{ currentBaby?.name || '选择宝宝' }}</span>
      <span class="dropdown-arrow" v-if="hasMultipleBabies">▼</span>
    </button>
    
    <div class="dropdown-menu" v-if="isOpen && babies.length > 0">
      <div class="dropdown-header">切换宝宝</div>
      <div 
        v-for="baby in babies" 
        :key="baby.id"
        class="dropdown-item"
        :class="{ active: baby.id === currentBaby?.id }"
        @click="selectBaby(baby.id)"
      >
        <span class="item-avatar" v-if="baby.avatar">
          <img :src="baby.avatar" :alt="baby.name" />
        </span>
        <span class="item-avatar default" v-else>👶</span>
        <span class="item-name">{{ baby.name }}</span>
        <span class="check-mark" v-if="baby.id === currentBaby?.id">✓</span>
      </div>
      <div class="dropdown-divider"></div>
      <div class="dropdown-item manage" @click="goToManageBabies">
        <span class="item-icon">⚙️</span>
        <span class="item-name">管理宝宝</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.baby-switcher {
  position: relative;
  display: inline-block;
}

.baby-switcher-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--soft-pink);
  border: none;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.baby-switcher-btn:hover {
  background: var(--primary-pink-light);
}

.baby-switcher-btn.has-dropdown {
  padding-right: 10px;
}

.baby-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.baby-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.baby-avatar.default {
  background: var(--soft-blue);
}

.baby-name {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 10px;
  color: var(--text-secondary);
  margin-left: 2px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-card);
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-header {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--bg-secondary);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: var(--bg-secondary);
}

.dropdown-item.active {
  background: var(--soft-pink);
}

.dropdown-item.manage {
  color: var(--text-secondary);
  font-size: 13px;
}

.dropdown-item.manage:hover {
  background: var(--bg-secondary);
}

.item-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: var(--soft-blue);
  flex-shrink: 0;
}

.item-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.item-icon {
  font-size: 16px;
}

.check-mark {
  color: var(--primary-pink);
  font-weight: bold;
  font-size: 14px;
}

.dropdown-divider {
  height: 1px;
  background: var(--bg-secondary);
  margin: 4px 0;
}
</style>
