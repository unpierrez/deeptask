<script setup lang="ts">
import type { Status } from '../../../types';
import { useStatusModal } from './useStatusModal';

const props = defineProps<{
  modelValue: boolean;
  status?: Status | null;
  canDelete?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: { title: string; color: string; isDone: boolean }];
  delete: [status: Status];
}>();

const {
  t,
  COLOR_PALETTE,
  title,
  color,
  isDone,
  isEdit,
  close,
  handleSave,
  handleDelete,
} = useStatusModal(props, emit);
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="status-modal">
      <div class="status-modal__header">
        <h2 class="status-modal__title">
          {{ isEdit ? t('statusModal.titleEdit') : t('statusModal.titleNew') }}
        </h2>
        <button class="status-modal__close" @click="close">
          <q-icon name="close" size="18px" />
        </button>
      </div>

      <div class="status-modal__body">
        <div class="status-modal__field">
          <label class="status-modal__label">{{
            t('statusModal.labelName')
          }}</label>
          <input
            v-model="title"
            class="status-modal__input"
            :placeholder="t('statusModal.placeholderName')"
            autofocus
            @keydown.enter="handleSave"
          />
        </div>

        <div class="status-modal__field">
          <label class="status-modal__label">{{
            t('statusModal.labelColor')
          }}</label>
          <div class="status-modal__colors">
            <button
              v-for="c in COLOR_PALETTE"
              :key="c"
              class="status-modal__color-btn"
              :style="{ background: c }"
              :class="{ 'status-modal__color-btn--selected': color === c }"
              @click="color = c"
            >
              <q-icon
                v-if="color === c"
                name="check"
                size="14px"
                style="color: white"
              />
            </button>
          </div>
        </div>

        <div class="status-modal__toggle-row">
          <div>
            <p class="status-modal__toggle-label">
              {{ t('statusModal.labelIsDone') }}
            </p>
            <p class="status-modal__toggle-hint">
              {{ t('statusModal.hintIsDone') }}
            </p>
          </div>
          <button
            class="status-modal__toggle"
            :class="{ 'status-modal__toggle--on': isDone }"
            @click="isDone = !isDone"
          >
            <div class="status-modal__toggle-knob" />
          </button>
        </div>
      </div>

      <div class="status-modal__footer">
        <button
          v-if="isEdit && canDelete"
          class="status-modal__delete-btn"
          @click="handleDelete"
        >
          <q-icon name="delete" size="16px" />
          {{ t('common.delete') }}
        </button>
        <div class="status-modal__footer-right">
          <button class="status-modal__cancel-btn" @click="close">
            {{ t('common.cancel') }}
          </button>
          <button
            class="status-modal__save-btn"
            :disabled="!title.trim()"
            @click="handleSave"
          >
            {{ isEdit ? t('common.save') : t('statusModal.btnCreate') }}
          </button>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
.status-modal {
  width: 420px;
  max-width: calc(100vw - 32px);
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
  }

  &__title {
    font-size: 1.0625rem;
    font-weight: 700;
    color: #141414;
    margin: 0;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__close {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: none;
    background: #f0f1f3;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s;

    &:hover {
      background: #e5e6e8;
      color: #141414;
    }
  }

  &__body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__input {
    height: 40px;
    border: 1.5px solid #e5e7eb;
    border-radius: 9px;
    padding: 0 12px;
    font-size: 0.9rem;
    color: #141414;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background: #f9fafb;
    outline: none;
    transition:
      border-color 0.15s,
      background 0.15s;

    &:focus {
      border-color: #a0a0a0;
      background: #ffffff;
    }

    &::placeholder {
      color: #c4c9d0;
    }
  }

  &__colors {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__color-btn {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    border: 2px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s;

    &:hover {
      transform: scale(1.1);
    }

    &--selected {
      border-color: #141414;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8) inset;
    }
  }

  &__toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px 14px;
  }

  &__toggle-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #141414;
    margin: 0 0 2px;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__toggle-hint {
    font-size: 0.75rem;
    color: #9aa3af;
    margin: 0;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__toggle {
    width: 40px;
    height: 22px;
    min-width: 40px;
    border-radius: 11px;
    background: #d0d5dd;
    border: none;
    cursor: pointer;
    position: relative;
    transition: background 0.2s;

    &--on {
      background: #141414;
    }
  }

  &__toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);

    .status-modal__toggle--on & {
      left: 21px;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-top: 1px solid #f0f1f3;
  }

  &__footer-right {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  &__cancel-btn {
    height: 38px;
    padding: 0 16px;
    border-radius: 9px;
    border: 1.5px solid #e5e7eb;
    background: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    transition: background 0.12s;

    &:hover {
      background: #f9fafb;
    }
  }

  &__save-btn {
    height: 38px;
    padding: 0 20px;
    border-radius: 9px;
    border: none;
    background: #141414;
    font-size: 0.875rem;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    transition: background 0.12s;

    &:hover:not(:disabled) {
      background: #2a2a2a;
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__delete-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 38px;
    padding: 0 14px;
    border-radius: 9px;
    border: 1.5px solid #fde8e8;
    background: #fff5f5;
    font-size: 0.875rem;
    font-weight: 500;
    color: #dd5a4b;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    transition: background 0.12s;

    &:hover {
      background: #fde8e8;
    }
  }
}
</style>
