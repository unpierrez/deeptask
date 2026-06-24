<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TaskGroup from '../../components/task/TaskGroup.vue'
import KanbanBoard from '../../components/task/KanbanBoard.vue'
import TaskModal from '../../components/task/TaskModal.vue'
import StatusModal from '../../components/status/StatusModal.vue'
import { useTasks } from '../../composables/useTasks'
import { useStatuses } from '../../composables/useStatuses'
import { useViewPreference } from '../../composables/useViewPreference'
import type { Task, Status, TaskFilter } from '../../types'

const { tasks, filter, searchQuery, fetchTasks, createTask, updateTask, completeTask, reopenTask, deleteTask, reorderTasks } = useTasks()
const { statuses, fetchStatuses, createStatus, updateStatus, deleteStatus } = useStatuses()
const { viewMode, setViewMode } = useViewPreference()

const taskModalOpen = ref(false)
const statusModalOpen = ref(false)
const editingTask = ref<Task | null>(null)
const editingStatus = ref<Status | null>(null)
const defaultStatusId = ref<string | undefined>()

const doneStatusIds = computed(() => new Set(statuses.value.filter((s) => s.isDone).map((s) => s.id)))

const filters: { label: string; value: TaskFilter }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Em aberto', value: 'active' },
    { label: 'Concluídas', value: 'done' },
]

const filterCounts = computed(() => ({
    all: tasks.value.length,
    active: tasks.value.filter((t) => !doneStatusIds.value.has(t.statusId)).length,
    done: tasks.value.filter((t) => doneStatusIds.value.has(t.statusId)).length,
}))

const allExpanded = ref(true)
const groupStates = ref<Record<string, boolean>>({})

function isGroupCollapsed(statusId: string) {
    return groupStates.value[statusId] ?? false
}

function toggleAll() {
    const newState = allExpanded.value
    statuses.value.forEach((s) => { groupStates.value[s.id] = newState })
    allExpanded.value = !newState
}

const expandLabel = computed(() =>
    allExpanded.value ? 'Recolher tudo' : 'Expandir tudo',
)

function getTasksForStatus(statusId: string) {
    let list = tasks.value.filter((t) => t.statusId === statusId)

    if (filter.value === 'done') {
        list = list.filter((t) => doneStatusIds.value.has(t.statusId))
    } else if (filter.value === 'active') {
        list = list.filter((t) => !doneStatusIds.value.has(t.statusId))
    }

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                t.tags.some((tag) => tag.toLowerCase().includes(q)),
        )
    }

    return list.sort((a, b) => a.position - b.position)
}

function shouldShowGroup(statusId: string) {
    if (filter.value === 'all' && !searchQuery.value.trim()) return true
    return getTasksForStatus(statusId).length > 0
}

function openNewTask(statusId?: string) {
    editingTask.value = null
    defaultStatusId.value = statusId
    taskModalOpen.value = true
}

function openEditTask(task: Task) {
    editingTask.value = task
    defaultStatusId.value = undefined
    taskModalOpen.value = true
}

function openNewStatus() {
    editingStatus.value = null
    statusModalOpen.value = true
}

function openEditStatus(status: Status) {
    editingStatus.value = status
    statusModalOpen.value = true
}

async function handleToggleTask(task: Task) {
    if (doneStatusIds.value.has(task.statusId)) {
        await reopenTask(task.id)
    } else {
        await completeTask(task.id)
    }
}

async function handleDeleteTask(task: Task) {
    await deleteTask(task.id)
}

async function handleSaveTask(data: {
    title: string
    statusId: string
    priority: string
    tags: string[]
    dueDate: string | null
}) {
    if (editingTask.value) {
        await updateTask(editingTask.value.id, data)
    } else {
        const created = await createTask(data)
        groupStates.value[created.statusId] = false
        allExpanded.value = true
    }
}

async function handleSaveStatus(data: { title: string; color: string; isDone: boolean }) {
    if (editingStatus.value) {
        await updateStatus(editingStatus.value.id, data)
    } else {
        await createStatus(data)
    }
}

async function handleDeleteStatus(status: Status) {
    await deleteStatus(status.id)
}

async function handleTaskDropped(payload: {
    taskId: string
    targetStatusId: string
    insertBeforeTaskId: string | null
}) {
    const { taskId, targetStatusId, insertBeforeTaskId } = payload

    const dragged = tasks.value.find((t) => t.id === taskId)
    if (!dragged) return

    const sourceStatusId = dragged.statusId

    // Full sorted list for the target group, without the dragged task
    const targetList = tasks.value
        .filter((t) => t.statusId === targetStatusId && t.id !== taskId)
        .sort((a, b) => a.position - b.position)

    const insertAt = insertBeforeTaskId
        ? targetList.findIndex((t) => t.id === insertBeforeTaskId)
        : -1

    targetList.splice(insertAt === -1 ? targetList.length : insertAt, 0, dragged)

    const items: { id: string; statusId: string; position: number }[] = []

    // Reorder source group only if the task moved to a different status
    if (sourceStatusId !== targetStatusId) {
        tasks.value
            .filter((t) => t.statusId === sourceStatusId && t.id !== taskId)
            .sort((a, b) => a.position - b.position)
            .forEach((t, i) => items.push({ id: t.id, statusId: sourceStatusId, position: i }))
    }

    targetList.forEach((t, i) => items.push({ id: t.id, statusId: targetStatusId, position: i }))

    await reorderTasks(items)
}

onMounted(async () => {
    await Promise.all([fetchStatuses(), fetchTasks()])
    statuses.value.forEach((s) => {
        groupStates.value[s.id] = s.isDone
    })
})

defineExpose({ openNewTask })
</script>

<template>
    <div class="tasks-view">
        <div class="tasks-view__toolbar">
            <div class="tasks-view__filters">
                <button
                    v-for="f in filters"
                    :key="f.value"
                    class="tasks-view__filter-btn"
                    :class="{ 'tasks-view__filter-btn--active': filter === f.value }"
                    @click="filter = f.value"
                >
                    {{ f.label }}
                    <span class="tasks-view__filter-count">{{ filterCounts[f.value] }}</span>
                </button>
            </div>

            <div class="tasks-view__toolbar-right">
                <div class="tasks-view__view-toggle">
                    <button
                        class="tasks-view__view-btn"
                        :class="{ 'tasks-view__view-btn--active': viewMode === 'list' }"
                        title="Visualização em lista"
                        @click="setViewMode('list')"
                    >
                        <q-icon name="view_list" size="18px" />
                    </button>
                    <button
                        class="tasks-view__view-btn"
                        :class="{ 'tasks-view__view-btn--active': viewMode === 'kanban' }"
                        title="Visualização kanban"
                        @click="setViewMode('kanban')"
                    >
                        <q-icon name="grid_view" size="16px" />
                    </button>
                </div>

                <button v-if="viewMode === 'list'" class="tasks-view__expand-btn" @click="toggleAll">
                    <q-icon :name="allExpanded ? 'unfold_less' : 'unfold_more'" size="16px" />
                    {{ expandLabel }}
                </button>
            </div>
        </div>

        <template v-if="viewMode === 'list'">
            <div class="tasks-view__list">
                <template v-for="status in statuses" :key="status.id">
                    <TaskGroup
                        v-if="shouldShowGroup(status.id)"
                        :status="status"
                        :tasks="getTasksForStatus(status.id)"
                        :is-done-status="status.isDone"
                        :start-collapsed="isGroupCollapsed(status.id)"
                        @toggle-task="handleToggleTask"
                        @edit-task="openEditTask"
                        @delete-task="handleDeleteTask"
                        @edit-status="openEditStatus"
                        @add-task="openNewTask"
                        @task-dropped="handleTaskDropped"
                    />
                </template>

                <button class="tasks-view__new-status" @click="openNewStatus">
                    <q-icon name="add" size="16px" />
                    Novo status
                </button>
            </div>
        </template>

        <template v-else>
            <KanbanBoard
                :statuses="statuses"
                :done-status-ids="doneStatusIds"
                :get-tasks-for-status="getTasksForStatus"
                @toggle-task="handleToggleTask"
                @edit-task="openEditTask"
                @delete-task="handleDeleteTask"
                @edit-status="openEditStatus"
                @add-task="openNewTask"
                @add-status="openNewStatus"
                @task-dropped="handleTaskDropped"
            />
        </template>

        <TaskModal
            v-model="taskModalOpen"
            :statuses="statuses"
            :task="editingTask"
            :default-status-id="defaultStatusId"
            @save="handleSaveTask"
            @delete="handleDeleteTask"
        />

        <StatusModal
            v-model="statusModalOpen"
            :status="editingStatus"
            :can-delete="statuses.length > 1"
            @save="handleSaveStatus"
            @delete="handleDeleteStatus"
        />
    </div>
</template>

<style scoped lang="scss">
.tasks-view {
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    &__filters {
        display: flex;
        gap: 4px;
    }

    &__filter-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 7px 14px;
        border-radius: 8px;
        border: 1.5px solid transparent;
        background: none;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: all 0.12s;

        &:hover {
            background: #f0f1f3;
            color: #374151;
        }

        &--active {
            background: #141414;
            color: #ffffff;
            border-color: #141414;

            .tasks-view__filter-count {
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
            }
        }
    }

    &__filter-count {
        font-size: 0.75rem;
        font-weight: 600;
        background: #f0f1f3;
        color: #9aa3af;
        border-radius: 5px;
        padding: 1px 6px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &__view-toggle {
        display: flex;
        align-items: center;
        background: #f0f1f3;
        border-radius: 9px;
        padding: 3px;
        gap: 2px;
    }

    &__view-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 28px;
        border-radius: 6px;
        border: none;
        background: none;
        color: #9aa3af;
        cursor: pointer;
        transition: background 0.12s, color 0.12s;

        &:hover {
            color: #374151;
        }

        &--active {
            background: #ffffff;
            color: #141414;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
    }

    &__expand-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 7px 14px;
        border-radius: 8px;
        border: 1.5px solid #e5e7eb;
        background: #ffffff;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: background 0.12s, color 0.12s;

        &:hover {
            background: #f0f1f3;
            color: #141414;
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &__new-status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px;
        border-radius: 12px;
        border: 1.5px dashed #d0d5dd;
        background: none;
        font-size: 0.875rem;
        font-weight: 500;
        color: #9aa3af;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: all 0.12s;

        &:hover {
            border-color: #9aa3af;
            color: #374151;
            background: #f9fafb;
        }
    }
}
</style>
