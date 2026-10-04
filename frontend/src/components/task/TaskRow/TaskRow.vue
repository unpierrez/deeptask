<script setup lang="ts">
import type { Task } from '../../../types';
import { useTaskRow } from './useTaskRow';

const props = defineProps<{
  task: Task;
  isDone: boolean;
}>();

const emit = defineEmits<{
  toggle: [task: Task];
  edit: [task: Task];
  delete: [task: Task];
}>();

const { t, priorityConfig, formatDate, draggingTask, startDrag, endDrag } =
  useTaskRow(props);
</script>

<template>
  <div
    class="task-row"
    :class="{
      'task-row--done': isDone,
      'task-row--dragging': draggingTask?.id === task.id,
    }"
    draggable="true"
    :data-task-id="task.id"
    @dragstart="startDrag(task, $event)"
    @dragend="endDrag()"
  >
    <div class="task-row__drag-handle">
      <q-icon name="drag_indicator" size="16px" />
    </div>

    <button class="task-row__checkbox" @click="emit('toggle', task)">
      <div
        class="task-row__checkbox-inner"
        :class="{ 'task-row__checkbox-inner--checked': isDone }"
      >
        <q-icon v-if="isDone" name="check" size="12px" />
      </div>
    </button>

    <div class="task-row__body">
      <span class="task-row__title">{{ task.title }}</span>
      <p v-if="task.description" class="task-row__description">
        {{ task.description }}
      </p>
      <div v-if="task.tags.length" class="task-row__tags">
        <span v-for="tag in task.tags" :key="tag" class="task-row__tag"
          >#{{ tag }}</span
        >
      </div>
    </div>

    <div class="task-row__meta">
      <div
        class="task-row__priority"
        :style="{ color: priorityConfig[task.priority].color }"
      >
        <div
          class="task-row__priority-dot"
          :style="{ background: priorityConfig[task.priority].color }"
        />
        <span>{{ priorityConfig[task.priority].label }}</span>
      </div>

      <div
        class="task-row__due"
        :class="{ 'task-row__due--empty': !task.dueDate }"
      >
        <q-icon name="calendar_today" size="13px" />
        <span>{{ formatDate(task.dueDate) ?? '—' }}</span>
      </div>

      <q-btn
        flat
        round
        dense
        size="sm"
        icon="more_vert"
        class="task-row__menu-btn"
      >
        <q-menu anchor="bottom right" self="top right" class="task-row__menu">
          <q-list dense>
            <q-item v-close-popup clickable @click="emit('edit', task)">
              <q-item-section avatar
                ><q-icon name="edit" size="16px"
              /></q-item-section>
              <q-item-section>{{ t('common.edit') }}</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="emit('toggle', task)">
              <q-item-section avatar>
                <q-icon
                  :name="isDone ? 'refresh' : 'check_circle'"
                  size="16px"
                />
              </q-item-section>
              <q-item-section>{{
                isDone ? t('common.reopen') : t('common.complete')
              }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              v-close-popup
              clickable
              class="task-row__menu-delete"
              @click="emit('delete', task)"
            >
              <q-item-section avatar
                ><q-icon name="delete" size="16px"
              /></q-item-section>
              <q-item-section>{{ t('common.delete') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--line-soft);
  transition:
    background 0.1s,
    opacity 0.15s;
  cursor: grab;

  &:hover {
    background: var(--surface);
  }

  &:active {
    cursor: grabbing;
  }

  &--done .task-row__title {
    color: var(--muted);
    text-decoration: line-through;
  }

  &--dragging {
    opacity: 0.4;
    cursor: grabbing;
  }

  &__drag-handle {
    color: var(--faint);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    cursor: grab;
    transition: color 0.12s;

    .task-row:hover & {
      color: var(--muted);
    }
  }

  &__checkbox {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    border-radius: 5px;
  }

  &__checkbox-inner {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1.5px solid var(--faint);
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.15s,
      border-color 0.15s;
    color: var(--on-accent);

    .task-row__checkbox:hover & {
      border-color: var(--muted);
    }

    &--checked,
    .task-row__checkbox:hover &--checked {
      background: var(--accent);
      border-color: var(--accent);
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: 14.5px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__description {
    font-size: 13px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  &__tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__tag {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  &__priority {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 72px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
  }

  &__priority-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__due {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 92px;
    white-space: nowrap;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);

    &--empty {
      color: var(--faint);
    }
  }

  &__menu-btn {
    color: var(--muted);

    &:hover {
      color: var(--text);
    }
  }
}

@media (max-width: 768px) {
  .task-row {
    padding: 12px 4px;
    gap: 12px;

    &__drag-handle {
      display: none;
    }

    &__priority {
      width: auto;

      span {
        display: none;
      }
    }

    &__due {
      display: none;
    }

    &__meta {
      gap: 8px;
    }
  }
}

.task-row__menu-delete,
.task-row__menu-delete :deep(.q-item__section--avatar) {
  color: var(--danger) !important;
}
</style>
