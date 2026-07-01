<script setup lang="ts">
import KanbanCard from '../KanbanCard/KanbanCard.vue'
import { useKanbanColumn } from './useKanbanColumn'
import type { Status, Task } from '../../../types'

const props = defineProps<{
    status: Status
    tasks: Task[]
    isDoneStatus: boolean
}>()

const emit = defineEmits<{
    toggleTask: [task: Task]
    editTask: [task: Task]
    deleteTask: [task: Task]
    editStatus: [status: Status]
    addTask: [statusId: string]
    taskDropped: [payload: { taskId: string; targetStatusId: string; insertBeforeTaskId: string | null }]
}>()

const { t, draggingTask, isDragOver, dropIndicatorIndex, onDragOver, onDragLeave, onDrop } = useKanbanColumn(props, (e, payload) => emit(e, payload))
</script>

<template>
    <div class="kanban-col" :class="{ 'kanban-col--drag-active': isDragOver && !!draggingTask }">
        <div class="kanban-col__header">
            <div class="kanban-col__header-left">
                <div class="kanban-col__dot" :style="{ background: status.color }" />
                <span class="kanban-col__title">{{ status.title }}</span>
                <span class="kanban-col__count">{{ tasks.length }}</span>
            </div>
            <div class="kanban-col__actions">
                <button class="kanban-col__action-btn" @click="emit('editStatus', status)" :title="t('common.edit') + ' status'">
                    <q-icon name="edit" size="14px" />
                </button>
                <button class="kanban-col__action-btn" @click="emit('addTask', status.id)" :title="t('common.newTask')">
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
                <div v-if="dropIndicatorIndex === tasks.length" class="drop-indicator" />
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
    width: 292px;
    min-width: 292px;
    display: flex;
    flex-direction: column;
    background: #f7f8fa;
    border-radius: 16px;
    border: 1.5px solid #eaecef;
    transition: border-color 0.15s, box-shadow 0.15s;

    &--drag-active {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 14px 12px;
        background: #ffffff;
        border-radius: 14px 14px 0 0;
        border-bottom: 1px solid #f0f1f3;
    }

    &__header-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    &__title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__count {
        font-size: 0.6875rem;
        font-weight: 600;
        color: #9aa3af;
        background: #f0f1f3;
        border-radius: 5px;
        padding: 1px 7px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 2px;
        opacity: 0;
        transition: opacity 0.15s;

        .kanban-col:hover & {
            opacity: 1;
        }
    }

    &__action-btn {
        width: 26px;
        height: 26px;
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
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 100px;
        max-height: calc(100vh - 270px);
        transition: background 0.15s;

        &--empty-over {
            background: rgba(99, 102, 241, 0.04);
        }

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: #d0d5dd;
            border-radius: 99px;
        }
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 7px;
        padding: 28px 16px;
        color: #c4c9d0;
        font-size: 0.8125rem;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__empty-icon {
        opacity: 0.6;
    }

    &__add-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 11px 14px;
        background: none;
        border: none;
        border-top: 1px solid #eaecef;
        border-radius: 0 0 14px 14px;
        color: #9aa3af;
        font-size: 0.8125rem;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        cursor: pointer;
        transition: color 0.12s, background 0.12s;
        text-align: left;

        &:hover {
            color: #374151;
            background: #f0f1f3;
        }
    }
}

.drop-indicator {
    height: 3px;
    background: #6366f1;
    border-radius: 2px;
    flex-shrink: 0;
    pointer-events: none;
    margin: -4px 0;
}
</style>
