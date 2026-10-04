<script setup lang="ts">
import KanbanCard from '../KanbanCard/KanbanCard.vue';
import { useKanbanColumn } from './useKanbanColumn';
import type { Status, Task } from '../../../types';

const props = defineProps<{
  status: Status;
  tasks: Task[];
  isDoneStatus: boolean;
}>();

const emit = defineEmits<{
  toggleTask: [task: Task];
  editTask: [task: Task];
  deleteTask: [task: Task];
  editStatus: [status: Status];
  addTask: [statusId: string];
  taskDropped: [
    payload: {
      taskId: string;
      targetStatusId: string;
      insertBeforeTaskId: string | null;
    },
  ];
}>();

const {
  t,
  draggingTask,
  isDragOver,
  dropIndicatorIndex,
  onDragOver,
  onDragLeave,
  onDrop,
} = useKanbanColumn(props, (e, payload) => emit(e, payload));
</script>

<template>
  <div
    class="kanban-col"
    :class="{ 'kanban-col--drag-active': isDragOver && !!draggingTask }"
  >
    <div class="kanban-col__header">
      <div class="kanban-col__header-left">
        <div class="kanban-col__dot" :style="{ background: status.color }" />
        <span class="kanban-col__title">{{ status.title }}</span>
        <span class="kanban-col__count">{{ tasks.length }}</span>
      </div>
      <div class="kanban-col__actions">
        <button
          class="kanban-col__action-btn"
          :title="t('tasks.editStatus')"
          @click="emit('editStatus', status)"
        >
          <q-icon name="edit" size="14px" />
        </button>
        <button
          class="kanban-col__action-btn"
          :title="t('common.newTask')"
          @click="emit('addTask', status.id)"
        >
          <q-icon name="add" size="16px" />
        </button>
      </div>
    </div>

    <div
      class="kanban-col__body"
      :class="{ 'kanban-col__body--empty-over': isDragOver && !tasks.length }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <template v-if="tasks.length">
        <template v-for="(task, i) in tasks" :key="task.id">
          <div v-if="dropIndicatorIndex === i" class="drop-indicator" />
          <KanbanCard
            :task="task"
            :is-done="isDoneStatus"
            @toggle="emit('toggleTask', $event)"
            @edit="emit('editTask', $event)"
            @delete="emit('deleteTask', $event)"
          />
        </template>
        <div
          v-if="dropIndicatorIndex === tasks.length"
          class="drop-indicator"
        />
      </template>

      <div v-else class="kanban-col__empty">
        <q-icon name="inbox" size="22px" class="kanban-col__empty-icon" />
        <span>{{ t('common.noTasks') }}</span>
      </div>
    </div>

    <button class="kanban-col__add-btn" @click="emit('addTask', status.id)">
      <q-icon name="add" size="15px" />
      <span>{{ t('common.addTask') }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.kanban-col {
  width: 288px;
  min-width: 288px;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 4px;
    border-bottom: 1px solid var(--line-soft);
    margin-bottom: 10px;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  &__title {
    font-family: var(--font-mono);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__count {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s;

    .kanban-col:hover &,
    &:focus-within {
      opacity: 1;
    }
  }

  &__action-btn {
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
    flex: 1;
    overflow-y: auto;
    padding: 2px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 100px;
    max-height: calc(100vh - 290px);
    border: 1px dashed transparent;
    border-radius: var(--radius-card);
    transition: border-color 0.15s;

    .kanban-col--drag-active &,
    &--empty-over {
      border-color: var(--accent);
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--line-strong);
      border-radius: 99px;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 28px 16px;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12.5px;
  }

  &__empty-icon {
    color: var(--faint);
  }

  &__add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 6px;
    margin-top: 4px;
    background: none;
    border: none;
    border-radius: var(--radius);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12.5px;
    cursor: pointer;
    transition: color 0.12s;
    text-align: left;

    &:hover {
      color: var(--text);
    }
  }
}

.drop-indicator {
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
  flex-shrink: 0;
  pointer-events: none;
  margin: -3px 0;
}
</style>
