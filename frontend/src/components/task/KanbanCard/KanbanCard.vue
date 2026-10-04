<script setup lang="ts">
import type { Task } from '../../../types';
import { useKanbanCard } from './useKanbanCard';

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
  useKanbanCard(props);
</script>

<template>
  <div
    class="kanban-card"
    :class="{
      'kanban-card--done': isDone,
      'kanban-card--dragging': draggingTask?.id === task.id,
    }"
    draggable="true"
    :data-task-id="task.id"
    @dragstart="startDrag(task, $event)"
    @dragend="endDrag()"
  >
    <div class="kanban-card__top">
      <div
        class="kanban-card__priority"
        :style="{ color: priorityConfig[task.priority].color }"
      >
        <span
          class="kanban-card__priority-dot"
          :style="{ background: priorityConfig[task.priority].color }"
        />
        {{ priorityConfig[task.priority].label }}
      </div>
      <q-btn
        flat
        round
        dense
        size="xs"
        icon="more_horiz"
        class="kanban-card__menu-btn"
      >
        <q-menu anchor="bottom right" self="top right" class="kanban-card-menu">
          <q-list dense>
            <q-item v-close-popup clickable @click="emit('edit', task)">
              <q-item-section avatar
                ><q-icon name="edit" size="15px"
              /></q-item-section>
              <q-item-section>{{ t('common.edit') }}</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="emit('toggle', task)">
              <q-item-section avatar>
                <q-icon
                  :name="isDone ? 'refresh' : 'check_circle'"
                  size="15px"
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
              class="kanban-card-menu__delete"
              @click="emit('delete', task)"
            >
              <q-item-section avatar
                ><q-icon name="delete" size="15px"
              /></q-item-section>
              <q-item-section>{{ t('common.delete') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <button class="kanban-card__title-btn" @click="emit('edit', task)">
      <span class="kanban-card__title">{{ task.title }}</span>
    </button>

    <p v-if="task.description" class="kanban-card__description">
      {{ task.description }}
    </p>

    <div v-if="task.tags.length" class="kanban-card__tags">
      <span v-for="tag in task.tags" :key="tag" class="kanban-card__tag"
        >#{{ tag }}</span
      >
    </div>

    <div class="kanban-card__footer">
      <button class="kanban-card__checkbox" @click.stop="emit('toggle', task)">
        <div
          class="kanban-card__checkbox-inner"
          :class="{ 'kanban-card__checkbox-inner--checked': isDone }"
        >
          <q-icon v-if="isDone" name="check" size="11px" />
        </div>
      </button>
      <div v-if="task.dueDate" class="kanban-card__due">
        <q-icon name="calendar_today" size="12px" />
        <span>{{ formatDate(task.dueDate) }}</span>
      </div>
      <div class="kanban-card__spacer" />
      <div class="kanban-card__drag-handle">
        <q-icon name="drag_indicator" size="15px" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kanban-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  padding: 14px;
  cursor: grab;
  transition:
    border-color 0.15s,
    opacity 0.15s;
  user-select: none;

  &:hover {
    border-color: var(--line-strong);
  }

  &:active {
    cursor: grabbing;
  }

  &--done .kanban-card__title {
    color: var(--muted);
    text-decoration: line-through;
  }

  &--dragging {
    opacity: 0.4;
    cursor: grabbing;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__priority {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11.5px;
    font-weight: 500;
  }

  &__priority-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__menu-btn {
    color: var(--muted);
    width: 24px;
    height: 24px;

    &:hover {
      color: var(--text);
    }
  }

  &__title-btn {
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    cursor: pointer;
    width: 100%;
    margin-bottom: 8px;
    display: block;
    border-radius: 4px;
  }

  &__title {
    font-size: 14.5px;
    font-weight: 500;
    color: var(--text);
    line-height: 1.45;
    display: block;
  }

  &__description {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.45;
    margin: -2px 0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
  }

  &__tag {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid var(--line-soft);
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

    .kanban-card__checkbox:hover & {
      border-color: var(--muted);
    }

    &--checked,
    .kanban-card__checkbox:hover &--checked {
      background: var(--accent);
      border-color: var(--accent);
    }
  }

  &__due {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
  }

  &__spacer {
    flex: 1;
  }

  &__drag-handle {
    color: var(--faint);
    display: flex;
    align-items: center;
    cursor: grab;
    transition: color 0.12s;

    .kanban-card:hover & {
      color: var(--muted);
    }
  }
}

.kanban-card-menu__delete,
.kanban-card-menu__delete :deep(.q-item__section--avatar) {
  color: var(--danger) !important;
}
</style>
