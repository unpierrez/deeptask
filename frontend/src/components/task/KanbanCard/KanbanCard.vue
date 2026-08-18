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
        class="kanban-card__priority-badge"
        :style="{
          color: priorityConfig[task.priority].color,
          background: priorityConfig[task.priority].bg,
        }"
      >
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
      <span v-for="tag in task.tags" :key="tag" class="kanban-card__tag">{{
        tag
      }}</span>
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
  background: #ffffff;
  border: 1px solid #eaecef;
  border-radius: 12px;
  padding: 14px 14px 12px;
  cursor: grab;
  transition:
    box-shadow 0.15s,
    opacity 0.15s;
  user-select: none;

  &:hover {
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07);
    border-color: #d8dce2;
  }

  &:active {
    cursor: grabbing;
  }

  &--done .kanban-card__title {
    color: #9aa3af;
    text-decoration: line-through;
  }

  &--dragging {
    opacity: 0.35;
    cursor: grabbing;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__priority-badge {
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    letter-spacing: 0.01em;
  }

  &__menu-btn {
    color: #c4c9d0;
    width: 24px;
    height: 24px;

    &:hover {
      color: #6b7280;
    }
  }

  &__title-btn {
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    cursor: pointer;
    width: 100%;
    margin-bottom: 10px;
    display: block;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #141414;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    line-height: 1.5;
    display: block;
  }

  &__description {
    font-size: 0.8rem;
    color: #9aa3af;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    line-height: 1.45;
    margin: -4px 0 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 12px;
  }

  &__tag {
    font-size: 0.6875rem;
    font-weight: 500;
    color: #6b7280;
    background: #f0f1f3;
    border-radius: 5px;
    padding: 2px 7px;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__checkbox {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
  }

  &__checkbox-inner {
    width: 17px;
    height: 17px;
    border-radius: 5px;
    border: 1.5px solid #d0d5dd;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.15s,
      border-color 0.15s;
    color: #fff;

    &--checked {
      background: #141414;
      border-color: #141414;
    }
  }

  &__due {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: #9aa3af;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__spacer {
    flex: 1;
  }

  &__drag-handle {
    color: #d0d5dd;
    display: flex;
    align-items: center;
    cursor: grab;
    transition: color 0.12s;

    .kanban-card:hover & {
      color: #9aa3af;
    }
  }
}

:deep(.kanban-card-menu) {
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  .q-item {
    font-size: 0.875rem;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    min-height: 36px;
  }
}

.kanban-card-menu__delete {
  color: #dd5a4b !important;
}
</style>
