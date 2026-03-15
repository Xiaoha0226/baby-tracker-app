<template>
  <div :class="['summary-card', `card-${color}`]">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-content">
      <div class="card-value">
        {{ value }}<span class="card-unit">{{ unit }}</span>
      </div>
      <div class="card-title">{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: number | string
  unit: string
  icon: string
  color: 'pink' | 'blue' | 'purple' | 'yellow'
}>()
</script>

<style scoped>
.summary-card {
  background: var(--white);
  border-radius: var(--border-radius-md);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-soft);
}

.card-pink {
  border-left: 4px solid var(--primary-pink);
}

.card-blue {
  border-left: 4px solid var(--soft-blue);
}

.card-purple {
  border-left: 4px solid var(--soft-purple);
}

.card-yellow {
  border-left: 4px solid var(--soft-orange);
}

.card-icon {
  font-size: 32px;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.card-unit {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
  margin-left: 4px;
}

.card-title {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
</style>
