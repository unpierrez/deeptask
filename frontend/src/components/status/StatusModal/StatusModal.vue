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
              :aria-pressed="color === c"
              @click="color = c"
            />
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
            role="switch"
            :aria-checked="isDone"
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
  width: 400px;
  max-width: calc(100vw - 32px);
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-modal);
  overflow: hidden;
  color: var(--text);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px 0 24px;
    border-bottom: 1px solid var(--line);
  }

  &__title {
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin: 0;
    line-height: 1.2;
  }

  &__close {
    width: 32px;
    height: 32px;
    border-radius: var(--radius);
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.12s,
      color 0.12s;

    &:hover {
      background: var(--raised);
      color: var(--text);
    }
  }

  &__body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-2);
    text-transform: lowercase;
  }

  &__input {
    height: 40px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 0 12px;
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--text);
    background: var(--bg);
    outline: none;
    transition: border-color 0.15s;

    &:hover {
      border-color: var(--line-strong);
    }

    &:focus {
      border-color: var(--accent);
    }

    &::placeholder {
      color: var(--muted);
    }
  }

  &__colors {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 10px;
  }

  &__color-btn {
    aspect-ratio: 1;
    width: 100%;
    border-radius: var(--radius);
    border: none;
    cursor: pointer;
    transition: box-shadow 0.12s;

    &--selected {
      box-shadow:
        0 0 0 2px var(--surface),
        0 0 0 4px var(--text);
    }
  }

  &__toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border: 1px solid var(--line);
    border-radius: var(--radius-card);
    padding: 12px 14px;
  }

  &__toggle-label {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    margin: 0 0 4px;
  }

  &__toggle-hint {
    font-size: 12.5px;
    color: var(--muted);
    margin: 0;
  }

  &__toggle {
    width: 40px;
    height: 22px;
    min-width: 40px;
    border-radius: 11px;
    background: var(--line-strong);
    border: none;
    cursor: pointer;
    position: relative;
    transition: background 0.2s;

    &--on {
      background: var(--accent);
    }
  }

  &__toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--muted);
    transition:
      left 0.2s,
      background 0.2s;

    .status-modal__toggle--on & {
      left: 21px;
      background: var(--bg);
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-top: 1px solid var(--line);
  }

  &__footer-right {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  &__cancel-btn,
  &__save-btn,
  &__delete-btn {
    height: 38px;
    border-radius: var(--radius);
    font-family: var(--font-mono);
    font-size: 13px;
    cursor: pointer;
  }

  &__cancel-btn {
    padding: 0 16px;
    border: 1px solid var(--line-strong);
    background: none;
    font-weight: 500;
    color: var(--text-2);
    transition:
      background 0.12s,
      color 0.12s;

    &:hover {
      background: var(--raised);
      color: var(--text);
    }
  }

  &__save-btn {
    padding: 0 18px;
    border: none;
    background: var(--primary-bg);
    font-weight: 600;
    color: var(--primary-fg);
    transition: opacity 0.12s;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__delete-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    margin-left: -10px;
    border: none;
    background: none;
    font-weight: 500;
    color: var(--danger);
    transition: background 0.12s;

    &:hover {
      background: var(--raised);
    }
  }
}
</style>
