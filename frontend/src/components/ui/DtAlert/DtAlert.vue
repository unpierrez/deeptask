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
  --dt-alert-color: var(--danger);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius);
  font-size: 0.8125rem;
  margin-bottom: 18px;
  background: var(--surface);
  border: 1px solid var(--dt-alert-color);
  color: var(--dt-alert-color);

  &__icon {
    color: var(--dt-alert-color);
  }

  &--success {
    --dt-alert-color: var(--accent);
  }

  &--info {
    --dt-alert-color: var(--prio-baixa);
  }
}
</style>
