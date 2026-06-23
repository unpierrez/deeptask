<script setup lang="ts">
import { useDtInput } from './useDtInput'

defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  error?: string
  hint?: string
  icon?: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const {} = useDtInput()
</script>

<template>
  <q-input
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event as string)"
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
    background: #f4f5f6 !important;
    border-radius: 13px !important;
    min-height: 50px !important;

    &::before {
      border: 1.5px solid #f4f5f6 !important;
      border-radius: 13px !important;
    }
    &::after {
      display: none !important;
    }
    &:hover::before {
      border-color: #e6e8eb !important;
    }
  }

  &.q-field--focused .q-field__control {
    background: #fff !important;

    &::before {
      border-color: #c4c9d0 !important;
    }
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
    color: #141414 !important;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif !important;
    font-size: 0.9375rem !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: 50px !important;
    line-height: 50px !important;

    &::placeholder {
      color: #c4c9d0 !important;
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
    color: #9aa0a8;
    transition: color 0.2s;
    font-size: 18px;
  }
  &.q-field--focused .q-field__prepend .q-icon {
    color: #3a414c;
  }
  .q-field__messages {
    color: #6b7280 !important;
  }
  &.q-field--error .q-field__control::before {
    border-color: #ef4444 !important;
  }
}
</style>
