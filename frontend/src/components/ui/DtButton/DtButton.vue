<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    type?: 'submit' | 'button' | 'reset';
    outline?: boolean;
    flat?: boolean;
    size?: string;
    iconRight?: string;
  }>(),
  {
    type: 'submit',
    loading: false,
    disabled: false,
    outline: false,
    flat: false,
    size: 'md',
  },
);
</script>

<template>
  <q-btn
    :loading="loading"
    :disabled="disabled"
    :type="type"
    :outline="outline"
    :flat="flat"
    :size="size"
    unelevated
    no-caps
    class="dt-btn"
  >
    <template #default>
      <slot v-if="$slots.default" />
      <template v-else>
        <span class="dt-btn__text">{{ label }}</span>
        <q-icon
          v-if="iconRight"
          :name="iconRight"
          size="16px"
          class="dt-btn__icon-right"
        />
      </template>
    </template>
    <template #loading>
      <q-spinner-oval size="18px" class="dt-btn__spinner" />
    </template>
  </q-btn>
</template>

<style scoped lang="scss">
.dt-btn {
  width: 100%;
  height: 44px;
  padding: 0 20px;
  border-radius: var(--radius);
  background: var(--primary-bg);
  color: var(--primary-fg);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-mono);
  transition: opacity 0.15s;

  &:hover:not(.disabled) {
    opacity: 0.9;
  }
  &.disabled {
    opacity: 0.45 !important;
  }

  &__text {
    flex: 1;
  }

  &__icon-right {
    margin-left: 8px;
  }

  &__spinner {
    color: var(--primary-fg);
  }
}
</style>
