<script setup lang="ts">
defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: string;
  hint?: string;
  icon?: string;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <q-input
    :model-value="modelValue"
    :label="label"
    :type="type as any"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :error="!!error"
    :error-message="error"
    :hint="hint"
    outlined
    dense
    class="dt-input"
    :input-class="'dt-input__native'"
    @update:model-value="$emit('update:modelValue', $event as string)"
  >
    <template v-if="icon" #prepend>
      <q-icon :name="icon" class="dt-input__icon" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </q-input>
</template>

<style lang="scss">
/* Injected globally — not scoped — so Quasar deep styles apply */
.dt-input {
  .q-field__control {
    background: var(--surface) !important;
    border-radius: var(--radius) !important;
    min-height: 44px !important;
    height: 44px;

    &::before {
      z-index: 1;
      border: 1px solid var(--line) !important;
      border-radius: var(--radius) !important;
      transition: border-color 0.15s;
    }
    &::after {
      display: none !important;
    }
    &:hover::before {
      border-color: var(--line-strong) !important;
    }
  }

  &.q-field--focused .q-field__control::before {
    border-color: var(--accent) !important;
  }

  .q-field__label {
    display: none !important;
  }

  .q-field__control-container {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .q-field__native,
  .q-field__input {
    color: var(--text) !important;
    font-family: var(--font-sans) !important;
    font-size: 0.9375rem !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 44px !important;
    line-height: 44px !important;
    background: transparent !important;
    border: none !important;
    border-radius: 0;

    &::placeholder {
      color: var(--muted) !important;
      opacity: 1;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:autofill {
      -webkit-text-fill-color: var(--text);
      caret-color: var(--text);
      -webkit-box-shadow: 0 0 0 1000px var(--surface) inset;
      box-shadow: 0 0 0 1000px var(--surface) inset;
      transition: background-color 9999s ease-in-out 0s;
    }
  }

  .q-field__prepend,
  .q-field__append {
    height: 100%;
    align-self: stretch;
    display: flex;
    align-items: center;
  }
  .q-field__prepend .q-icon {
    color: var(--muted);
    transition: color 0.2s;
    font-size: 18px;
  }
  &.q-field--focused .q-field__prepend .q-icon {
    color: var(--text-2);
  }
  .q-field__messages {
    color: var(--muted) !important;
  }
  &.q-field--error .q-field__control::before {
    border-color: var(--danger) !important;
  }
  &.q-field--error .q-field__messages,
  &.q-field--error .q-field__bottom {
    color: var(--danger) !important;
  }
}
</style>
