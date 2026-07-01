<script setup lang="ts">
import TaskRow from '../TaskRow/TaskRow.vue'
import { useTaskGroup } from './useTaskGroup'
import type { Status, Task } from '../../../types'

const props = defineProps<{
    status: Status
    tasks: Task[]
    isDoneStatus: boolean
    startCollapsed?: boolean
}>()

const emit = defineEmits<{
    toggleTask: [task: Task]
    editTask: [task: Task]
    deleteTask: [task: Task]
    editStatus: [status: Status]
    addTask: [statusId: string]
    taskDropped: [payload: { taskId: string; targetStatusId: string; insertBeforeTaskId: string | null }]
}>()

const { t, collapsed, isDragOver, dropIndicatorIndex, onDragOver, onDragLeave, onDrop } = useTaskGroup(props, (e, payload) => emit(e, payload))
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
                <button class="task-group__action-btn" @click="emit('editStatus', status)" :title="t('common.edit') + ' status'">
                    <q-icon name="edit" size="15px" />
                </button>
                <button class="task-group__action-btn" @click="emit('addTask', status.id)" :title="t('common.newTask')">
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
                    <div v-if="dropIndicatorIndex === tasks.length" class="drop-indicator" />
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
    background: #ffffff;
    border: 1px solid #ebebec;
    border-radius: 14px;
    overflow: hidden;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 13px 16px;
        cursor: pointer;
        user-select: none;

        &:hover {
            background: #fafbfc;
        }
    }

    &__header-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &__chevron {
        color: #9aa3af;
        transition: transform 0.2s;

        &--open {
            transform: rotate(90deg);
        }
    }

    &__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    &__title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__count {
        font-size: 0.75rem;
        font-weight: 600;
        color: #9aa3af;
        background: #f0f1f3;
        border-radius: 5px;
        padding: 1px 7px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    &__action-btn {
        width: 28px;
        height: 28px;
        border-radius: 7px;
        border: none;
        background: none;
        color: #9aa3af;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.12s, color 0.12s;

        &:hover {
            background: #f0f1f3;
            color: #141414;
        }
    }

    &__body {
        border-top: 1px solid #f0f1f3;

        &--drag-over {
            min-height: 56px;
            background: #f8f9ff;
        }
    }

    &__empty {
        padding: 12px 16px;
        font-size: 0.875rem;
        color: #9aa3af;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        margin: 0;
        min-height: 44px;
        display: flex;
        align-items: center;
    }

    &__add-row {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 16px;
        width: 100%;
        background: none;
        border: none;
        border-top: 1px solid #f4f5f6;
        color: #9aa3af;
        font-size: 0.875rem;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        cursor: pointer;
        transition: color 0.12s, background 0.12s;
        text-align: left;

        &:hover {
            color: #141414;
            background: #fafbfc;
        }
    }
}

.drop-indicator {
    height: 2px;
    background: #6366f1;
    border-radius: 2px;
    margin: 0 16px;
    pointer-events: none;
    flex-shrink: 0;

    &--fill {
        width: calc(100% - 32px);
        height: 2px;
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
