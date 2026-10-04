<script setup lang="ts">
import TaskRow from '../TaskRow/TaskRow.vue';
import { useTaskGroup } from './useTaskGroup';
import type { Status, Task } from '../../../types';

const props = defineProps<{
  status: Status;
  tasks: Task[];
  isDoneStatus: boolean;
  startCollapsed?: boolean;
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
  collapsed,
  isDragOver,
  dropIndicatorIndex,
  onDragOver,
  onDragLeave,
  onDrop,
} = useTaskGroup(props, (e, payload) => emit(e, payload));
</script>

<template>
  <div class="task-group">
    <div class="task-group__header" @click="collapsed = !collapsed">
      <div class="task-group__header-left">
        <q-icon
          name="chevron_right"
          size="18px"
          class="task-group__chevron"
          :class="{ 'task-group__chevron--open': !collapsed }"
        />
        <div class="task-group__dot" :style="{ background: status.color }" />
        <span class="task-group__title">{{ status.title }}</span>
        <span class="task-group__count">{{ tasks.length }}</span>
      </div>
      <div class="task-group__header-actions" @click.stop>
        <button
          class="task-group__action-btn"
          :title="t('tasks.editStatus')"
          @click="emit('editStatus', status)"
        >
          <q-icon name="edit" size="15px" />
        </button>
        <button
          class="task-group__action-btn"
          :title="t('common.newTask')"
          @click="emit('addTask', status.id)"
        >
          <q-icon name="add" size="16px" />
        </button>
      </div>
    </div>

    <Transition name="expand">
      <div
        v-if="!collapsed"
        class="task-group__body"
        :class="{ 'task-group__body--drag-over': isDragOver && !tasks.length }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <template v-if="tasks.length">
          <template v-for="(task, i) in tasks" :key="task.id">
            <div v-if="dropIndicatorIndex === i" class="drop-indicator" />
            <TaskRow
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

        <div v-else class="task-group__empty">
          <div v-if="isDragOver" class="drop-indicator drop-indicator--fill" />
          <span v-else>{{ t('common.noTasks') }}</span>
        </div>

        <button class="task-group__add-row" @click="emit('addTask', status.id)">
          <q-icon name="add" size="15px" />
          <span>{{ t('common.addTask') }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.task-group {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 4px;
    border-bottom: 1px solid var(--line-soft);
    cursor: pointer;
    user-select: none;

    &:hover .task-group__chevron {
      color: var(--text-2);
    }
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  &__chevron {
    color: var(--muted);
    transition:
      transform 0.2s,
      color 0.12s;

    &--open {
      transform: rotate(90deg);
    }
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

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 2px;
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
    border-radius: var(--radius);

    &--drag-over {
      min-height: 56px;
      outline: 1px dashed var(--accent);
      outline-offset: -1px;
    }
  }

  &__empty {
    padding: 12px 4px 12px 62px;
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--muted);
    margin: 0;
    min-height: 48px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--line-soft);
  }

  &__add-row {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 4px 0 32px;
    width: 100%;
    background: none;
    border: none;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12.5px;
    cursor: pointer;
    transition: color 0.12s;
    text-align: left;

    .q-icon {
      width: 18px;
    }

    &:hover {
      color: var(--text);
    }
  }
}

.drop-indicator {
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
  pointer-events: none;
  flex-shrink: 0;

  &--fill {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .task-group {
    &__empty {
      padding-left: 34px;
    }

    &__add-row {
      padding-left: 4px;
    }
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
