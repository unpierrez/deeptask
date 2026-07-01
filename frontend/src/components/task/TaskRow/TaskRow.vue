<script setup lang="ts">
import type { Task } from '../../../types'
import { useTaskRow } from './useTaskRow'

const props = defineProps<{
    task: Task
    isDone: boolean
}>()

const emit = defineEmits<{
    toggle: [task: Task]
    edit: [task: Task]
    delete: [task: Task]
}>()

const { t, priorityConfig, formatDate, draggingTask, startDrag, endDrag } = useTaskRow(props)
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
            <div class="task-row__checkbox-inner" :class="{ 'task-row__checkbox-inner--checked': isDone }">
                <q-icon v-if="isDone" name="check" size="12px" />
            </div>
        </button>

        <div class="task-row__body">
            <span class="task-row__title">{{ task.title }}</span>
            <p v-if="task.description" class="task-row__description">{{ task.description }}</p>
            <div v-if="task.tags.length" class="task-row__tags">
                <span v-for="tag in task.tags" :key="tag" class="task-row__tag">{{ tag }}</span>
            </div>
        </div>

        <div class="task-row__meta">
            <div class="task-row__priority" :style="{ color: priorityConfig[task.priority].color }">
                <div class="task-row__priority-dot" :style="{ background: priorityConfig[task.priority].color }" />
                <span>{{ priorityConfig[task.priority].label }}</span>
            </div>

            <div class="task-row__due" :class="{ 'task-row__due--empty': !task.dueDate }">
                <q-icon name="calendar_today" size="13px" />
                <span>{{ formatDate(task.dueDate) ?? '—' }}</span>
            </div>

            <q-btn flat round dense size="sm" icon="more_vert" class="task-row__menu-btn">
                <q-menu anchor="bottom right" self="top right" class="task-row__menu">
                    <q-list dense>
                        <q-item clickable v-close-popup @click="emit('edit', task)">
                            <q-item-section avatar><q-icon name="edit" size="16px" /></q-item-section>
                            <q-item-section>{{ t('common.edit') }}</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="emit('toggle', task)">
                            <q-item-section avatar>
                                <q-icon :name="isDone ? 'refresh' : 'check_circle'" size="16px" />
                            </q-item-section>
                            <q-item-section>{{ isDone ? t('common.reopen') : t('common.complete') }}</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable v-close-popup @click="emit('delete', task)" class="task-row__menu-delete">
                            <q-item-section avatar><q-icon name="delete" size="16px" /></q-item-section>
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
    gap: 10px;
    padding: 10px 16px;
    border-bottom: 1px solid #f4f5f6;
    transition: background 0.1s, opacity 0.15s;
    cursor: grab;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #fafbfc;
    }

    &:active {
        cursor: grabbing;
    }

    &--done .task-row__title {
        color: #9aa3af;
        text-decoration: line-through;
    }

    &--dragging {
        opacity: 0.35;
        cursor: grabbing;
    }

    &__drag-handle {
        color: #d0d5dd;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        cursor: grab;
        transition: color 0.12s;

        .task-row:hover & {
            color: #9aa3af;
        }
    }

    &__checkbox {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        flex-shrink: 0;
    }

    &__checkbox-inner {
        width: 18px;
        height: 18px;
        border-radius: 5px;
        border: 1.5px solid #d0d5dd;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, border-color 0.15s;
        color: #fff;

        &--checked {
            background: #141414;
            border-color: #141414;
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
        font-size: 0.9rem;
        font-weight: 500;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__description {
        font-size: 0.8rem;
        color: #9aa3af;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
    }

    &__tags {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    &__tag {
        font-size: 0.6875rem;
        font-weight: 500;
        color: #6b7280;
        background: #f0f1f3;
        border-radius: 5px;
        padding: 2px 7px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__meta {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-shrink: 0;
    }

    &__priority {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8125rem;
        font-weight: 500;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__priority-dot {
        width: 7px;
        height: 7px;
        border-radius: 2px;
        flex-shrink: 0;
    }

    &__due {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8125rem;
        color: #6b7280;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;

        &--empty {
            color: #c4c9d0;
        }
    }

    &__menu-btn {
        color: #9aa3af;

        &:hover {
            color: #141414;
        }
    }
}

@media (max-width: 768px) {
    .task-row {
        padding: 10px 12px;
        gap: 8px;

        &__drag-handle {
            display: none;
        }

        &__priority {
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

:deep(.task-row__menu) {
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    .q-item {
        font-size: 0.875rem;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        min-height: 36px;
    }
}

.task-row__menu-delete {
    color: #dd5a4b !important;
}
</style>
