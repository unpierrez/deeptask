<script setup lang="ts">
defineProps<{ message: string; type?: 'error' | 'success' | 'info' }>();
</script>

<template>
  <div class="dt-alert" :class="`dt-alert--${type ?? 'error'}`">
    <q-icon
      :name="type === 'success' ? 'check_circle_outline' : 'error_outline'"
      size="16px"
      class="dt-alert__icon"
    />
    <span>{{ message }}</span>
  </div>
</template>

<style scoped lang="scss">
.dt-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.8125rem;
  margin-bottom: 18px;

  &--error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    .dt-alert__icon {
      color: #dc2626;
    }
  }

  &--success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    .dt-alert__icon {
      color: #16a34a;
    }
  }

  &--info {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    color: #0284c7;
    .dt-alert__icon {
      color: #0284c7;
    }
  }
}
</style>
