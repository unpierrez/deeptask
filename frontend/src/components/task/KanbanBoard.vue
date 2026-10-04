<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import KanbanColumn from './KanbanColumn/KanbanColumn.vue';
import type { Status, Task } from '../../types';

const { t } = useI18n();

defineProps<{
  statuses: Status[];
  doneStatusIds: Set<string>;
  getTasksForStatus: (statusId: string) => Task[];
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
  addStatus: [];
}>();
</script>

<template>
  <div class="kanban-board">
    <div class="kanban-board__track">
      <KanbanColumn
        v-for="status in statuses"
        :key="status.id"
        :status="status"
        :tasks="getTasksForStatus(status.id)"
        :is-done-status="doneStatusIds.has(status.id)"
        @toggle-task="emit('toggleTask', $event)"
        @edit-task="emit('editTask', $event)"
        @delete-task="emit('deleteTask', $event)"
        @edit-status="emit('editStatus', $event)"
        @add-task="emit('addTask', $event)"
        @task-dropped="emit('taskDropped', $event)"
      />

      <button class="kanban-board__new-col" @click="emit('addStatus')">
        <q-icon name="add" size="18px" />
        <span>{{ t('common.newStatus') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.kanban-board {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--line-strong);
    border-radius: 99px;
  }

  &__track {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    min-width: max-content;
    padding: 2px 1px 4px;
  }

  &__new-col {
    width: 240px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: var(--radius-card);
    border: 1px dashed var(--line-strong);
    background: none;
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition:
      border-color 0.12s,
      color 0.12s;
    align-self: flex-start;

    &:hover {
      border-color: var(--muted);
      color: var(--text);
    }
  }
}
</style>
