<script setup lang="ts">
import type { Task, Status } from '../../../types';
import { useTaskModal } from './useTaskModal';

const props = defineProps<{
  modelValue: boolean;
  statuses: Status[];
  task?: Task | null;
  defaultStatusId?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [
    data: {
      title: string;
      statusId: string;
      priority: string;
      tags: string[];
      dueDate: string | null;
      description: string | null;
    },
  ];
  delete: [task: Task];
}>();

const {
  t,
  title,
  description,
  statusId,
  priority,
  tagsInput,
  dueDate,
  isMobile,
  isEdit,
  priorities,
  close,
  handleSave,
  handleDelete,
} = useTaskModal(props, emit);
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    :position="isMobile ? 'bottom' : 'standard'"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="task-modal">
      <div class="task-modal__header">
        <h2 class="task-modal__title">
          {{ isEdit ? t('taskModal.titleEdit') : t('taskModal.titleNew') }}
        </h2>
        <button class="task-modal__close" @click="close">
          <q-icon name="close" size="18px" />
        </button>
      </div>

      <div class="task-modal__body">
        <div class="task-modal__field">
          <label class="task-modal__label">{{
            t('taskModal.labelTitle')
          }}</label>
          <input
            v-model="title"
            class="task-modal__input"
            :placeholder="t('taskModal.placeholderTitle')"
            autofocus
            @keydown.enter="handleSave"
          />
        </div>

        <div class="task-modal__field">
          <label class="task-modal__label">{{
            t('taskModal.labelDescription')
          }}</label>
          <textarea
            v-model="description"
            class="task-modal__input task-modal__input--textarea"
            :placeholder="t('taskModal.placeholderDescription')"
            rows="3"
          />
        </div>

        <div class="task-modal__field">
          <label class="task-modal__label">{{
            t('taskModal.labelPriority')
          }}</label>
          <div class="task-modal__priority-group">
            <button
              v-for="p in priorities"
              :key="p.value"
              class="task-modal__priority-btn"
              :class="{
                'task-modal__priority-btn--active': priority === p.value,
              }"
              :style="priority === p.value ? { color: p.color } : {}"
              @click="priority = p.value"
            >
              <div
                class="task-modal__priority-dot"
                :style="{ background: p.color }"
              />
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="task-modal__field">
          <label class="task-modal__label">{{
            t('taskModal.labelStatus')
          }}</label>
          <div class="task-modal__status-group">
            <button
              v-for="s in statuses"
              :key="s.id"
              class="task-modal__status-btn"
              :class="{ 'task-modal__status-btn--active': statusId === s.id }"
              :style="
                statusId === s.id
                  ? {
                      borderColor: s.color,
                      background: `color-mix(in srgb, ${s.color} 12%, var(--surface))`,
                    }
                  : {}
              "
              @click="statusId = s.id"
            >
              <div
                class="task-modal__status-dot"
                :style="{ background: s.color }"
              />
              {{ s.title }}
            </button>
          </div>
        </div>

        <div class="task-modal__row">
          <div class="task-modal__field">
            <label class="task-modal__label">{{
              t('taskModal.labelTags')
            }}</label>
            <input
              v-model="tagsInput"
              class="task-modal__input"
              :placeholder="t('taskModal.placeholderTags')"
            />
            <span class="task-modal__hint">{{ t('taskModal.hintTags') }}</span>
          </div>

          <div class="task-modal__field">
            <label class="task-modal__label">{{
              t('taskModal.labelDueDate')
            }}</label>
            <input
              v-model="dueDate"
              type="date"
              class="task-modal__input task-modal__input--date"
            />
          </div>
        </div>
      </div>

      <div class="task-modal__footer">
        <button
          v-if="isEdit"
          class="task-modal__delete-btn"
          @click="handleDelete"
        >
          <q-icon name="delete" size="16px" />
          {{ t('common.delete') }}
        </button>
        <div class="task-modal__footer-right">
          <button class="task-modal__cancel-btn" @click="close">
            {{ t('common.cancel') }}
          </button>
          <button
            class="task-modal__save-btn"
            :disabled="!title.trim()"
            @click="handleSave"
          >
            {{ isEdit ? t('common.save') : t('taskModal.btnCreate') }}
          </button>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
.task-modal {
  width: 520px;
  max-width: calc(100vw - 32px);
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-modal);
  overflow: hidden;
  color: var(--text);

  @media (max-width: 768px) {
    width: 100vw;
    max-width: 100vw;
    border-bottom: none;
    border-radius: var(--radius-modal) var(--radius-modal) 0 0;
  }

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
    gap: 18px;
    max-height: 70vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    @media (max-width: 768px) {
      padding: 16px 20px;
      max-height: 65vh;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
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

  &__hint {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
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

    &--date {
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: 13px;
    }

    &--textarea {
      height: auto;
      padding: 10px 12px;
      resize: vertical;
      min-height: 72px;
      line-height: 1.5;
    }
  }

  &__priority-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    padding: 3px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
  }

  &__priority-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 34px;
    border-radius: 6px;
    border: none;
    background: none;
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition:
      background 0.12s,
      color 0.12s;

    &:hover {
      color: var(--text-2);
    }

    &--active {
      background: var(--line);
    }
  }

  &__status-group {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__status-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 12px;
    border-radius: var(--radius);
    border: 1px solid var(--line);
    background: none;
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-2);
    cursor: pointer;
    transition:
      border-color 0.12s,
      color 0.12s;

    &:hover {
      border-color: var(--line-strong);
      color: var(--text);
    }

    &--active {
      color: var(--text);
    }
  }

  &__priority-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
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
