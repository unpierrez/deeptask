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
      <q-spinner-oval size="18px" color="white" />
    </template>
  </q-btn>
</template>

<style scoped lang="scss">
.dt-btn {
  width: 100%;
  height: 52px;
  padding: 0 24px;
  border-radius: 13px;
  background: #141414;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  transition:
    background 0.2s,
    transform 0.15s,
    box-shadow 0.15s;

  &:hover:not(.disabled) {
    background: #262626 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(20, 20, 20, 0.22) !important;
  }
  &:active:not(.disabled) {
    transform: translateY(0) scale(0.99);
  }
  &.disabled {
    opacity: 0.45 !important;
    background: #141414 !important;
  }

  &__text {
    flex: 1;
  }

  &__icon-right {
    margin-left: 8px;
  }
}
</style>
