<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import TaskGroup from '../../components/task/TaskGroup/TaskGroup.vue';
import KanbanBoard from '../../components/task/KanbanBoard.vue';
import TaskModal from '../../components/task/TaskModal/TaskModal.vue';
import StatusModal from '../../components/status/StatusModal/StatusModal.vue';
import { useTasks } from '../../composables/useTasks';
import { useStatuses } from '../../composables/useStatuses';
import { useViewPreference } from '../../composables/useViewPreference';
import type { Task, Status, TaskFilter } from '../../types';

const {
  tasks,
  filter,
  searchQuery,
  fetchTasks,
  createTask,
  updateTask,
  completeTask,
  reopenTask,
  deleteTask,
  reorderTasks,
} = useTasks();
const { statuses, fetchStatuses, createStatus, updateStatus, deleteStatus } =
  useStatuses();
const { viewMode, setViewMode } = useViewPreference();
const { t } = useI18n();

// Separate visual state from filter state so the button repaints immediately
// before the list re-render runs in the next task
const activeFilter = ref<TaskFilter>(filter.value);

function setFilter(value: TaskFilter) {
  activeFilter.value = value;
  setTimeout(() => {
    filter.value = value;
  }, 0);
}

// Force list view on mobile
const isMobile = ref(false);

function handleResize() {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value && viewMode.value === 'kanban') {
    setViewMode('list');
  }
}

const taskModalOpen = ref(false);
const statusModalOpen = ref(false);
const editingTask = ref<Task | null>(null);
const editingStatus = ref<Status | null>(null);
const defaultStatusId = ref<string | undefined>();

const doneStatusIds = computed(
  () => new Set(statuses.value.filter((s) => s.isDone).map((s) => s.id)),
);

const filters = computed<{ label: string; value: TaskFilter }[]>(() => [
  { label: t('tasks.filterAll'), value: 'all' },
  { label: t('tasks.filterActive'), value: 'active' },
  { label: t('tasks.filterDone'), value: 'done' },
]);

const filterCounts = computed(() => ({
  all: tasks.value.length,
  active: tasks.value.filter((t) => !doneStatusIds.value.has(t.statusId))
    .length,
  done: tasks.value.filter((t) => doneStatusIds.value.has(t.statusId)).length,
}));

const allExpanded = ref(true);
const groupStates = ref<Record<string, boolean>>({});

function isGroupCollapsed(statusId: string) {
  return groupStates.value[statusId] ?? false;
}

function toggleAll() {
  const newState = allExpanded.value;
  statuses.value.forEach((s) => {
    groupStates.value[s.id] = newState;
  });
  allExpanded.value = !newState;
}

const expandLabel = computed(() =>
  allExpanded.value ? t('tasks.collapseAll') : t('tasks.expandAll'),
);

function getTasksForStatus(statusId: string) {
  let list = tasks.value.filter((t) => t.statusId === statusId);

  if (filter.value === 'done') {
    list = list.filter((t) => doneStatusIds.value.has(t.statusId));
  } else if (filter.value === 'active') {
    list = list.filter((t) => !doneStatusIds.value.has(t.statusId));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }

  return list.sort((a, b) => a.position - b.position);
}

function shouldShowGroup(statusId: string) {
  if (filter.value === 'all' && !searchQuery.value.trim()) return true;
  return getTasksForStatus(statusId).length > 0;
}

function openNewTask(statusId?: string) {
  editingTask.value = null;
  defaultStatusId.value = statusId;
  taskModalOpen.value = true;
}

function openEditTask(task: Task) {
  editingTask.value = task;
  defaultStatusId.value = undefined;
  taskModalOpen.value = true;
}

function openNewStatus() {
  editingStatus.value = null;
  statusModalOpen.value = true;
}

function openEditStatus(status: Status) {
  editingStatus.value = status;
  statusModalOpen.value = true;
}

async function handleToggleTask(task: Task) {
  if (doneStatusIds.value.has(task.statusId)) {
    await reopenTask(task.id);
  } else {
    await completeTask(task.id);
  }
}

async function handleDeleteTask(task: Task) {
  await deleteTask(task.id);
}

async function handleSaveTask(data: {
  title: string;
  statusId: string;
  priority: string;
  tags: string[];
  dueDate: string | null;
}) {
  if (editingTask.value) {
    await updateTask(editingTask.value.id, {
      ...data,
      dueDate: data.dueDate ?? undefined,
    });
  } else {
    const created = await createTask({
      ...data,
      dueDate: data.dueDate ?? undefined,
    });
    groupStates.value[created.statusId] = false;
    allExpanded.value = true;
  }
}

async function handleSaveStatus(data: {
  title: string;
  color: string;
  isDone: boolean;
}) {
  if (editingStatus.value) {
    await updateStatus(editingStatus.value.id, data);
  } else {
    await createStatus(data);
  }
}

async function handleDeleteStatus(status: Status) {
  await deleteStatus(status.id);
}

async function handleTaskDropped(payload: {
  taskId: string;
  targetStatusId: string;
  insertBeforeTaskId: string | null;
}) {
  const { taskId, targetStatusId, insertBeforeTaskId } = payload;

  const dragged = tasks.value.find((t) => t.id === taskId);
  if (!dragged) return;

  const sourceStatusId = dragged.statusId;

  // Full sorted list for the target group, without the dragged task
  const targetList = tasks.value
    .filter((t) => t.statusId === targetStatusId && t.id !== taskId)
    .sort((a, b) => a.position - b.position);

  const insertAt = insertBeforeTaskId
    ? targetList.findIndex((t) => t.id === insertBeforeTaskId)
    : -1;

  targetList.splice(insertAt === -1 ? targetList.length : insertAt, 0, dragged);

  const items: { id: string; statusId: string; position: number }[] = [];

  // Reorder source group only if the task moved to a different status
  if (sourceStatusId !== targetStatusId) {
    tasks.value
      .filter((t) => t.statusId === sourceStatusId && t.id !== taskId)
      .sort((a, b) => a.position - b.position)
      .forEach((t, i) =>
        items.push({ id: t.id, statusId: sourceStatusId, position: i }),
      );
  }

  targetList.forEach((t, i) =>
    items.push({ id: t.id, statusId: targetStatusId, position: i }),
  );

  await reorderTasks(items);
}

onMounted(async () => {
  handleResize();
  window.addEventListener('resize', handleResize);
  await Promise.all([fetchStatuses(), fetchTasks()]);
  statuses.value.forEach((s) => {
    groupStates.value[s.id] = s.isDone;
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

defineExpose({ openNewTask });
</script>

<template>
  <div class="tasks-view">
    <div class="tasks-view__toolbar">
      <div class="tasks-view__filters">
        <button
          v-for="f in filters"
          :key="f.value"
          class="tasks-view__filter-btn"
          :class="{
            'tasks-view__filter-btn--active': activeFilter === f.value,
          }"
          @click="setFilter(f.value)"
        >
          {{ f.label }}
          <span class="tasks-view__filter-count">{{
            filterCounts[f.value]
          }}</span>
        </button>
      </div>

      <div v-if="!isMobile" class="tasks-view__toolbar-right">
        <div class="tasks-view__view-toggle">
          <button
            class="tasks-view__view-btn"
            :class="{ 'tasks-view__view-btn--active': viewMode === 'list' }"
            :title="t('tasks.viewList')"
            @click="setViewMode('list')"
          >
            <q-icon name="view_list" size="18px" />
          </button>
          <button
            class="tasks-view__view-btn"
            :class="{ 'tasks-view__view-btn--active': viewMode === 'kanban' }"
            :title="t('tasks.viewKanban')"
            @click="setViewMode('kanban')"
          >
            <q-icon name="grid_view" size="16px" />
          </button>
        </div>

        <button
          v-if="viewMode === 'list'"
          class="tasks-view__expand-btn"
          @click="toggleAll"
        >
          <q-icon
            :name="allExpanded ? 'unfold_less' : 'unfold_more'"
            size="16px"
          />
          {{ expandLabel }}
        </button>
      </div>

      <div v-else class="tasks-view__toolbar-right">
        <button class="tasks-view__expand-btn" @click="toggleAll">
          <q-icon
            :name="allExpanded ? 'unfold_less' : 'unfold_more'"
            size="16px"
          />
        </button>
      </div>
    </div>

    <template v-if="viewMode === 'list' || isMobile">
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
          {{ t('common.newStatus') }}
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
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__filters,
  &__view-toggle {
    display: flex;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 3px;
    gap: 2px;
  }

  &__filter-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 30px;
    padding: 0 12px;
    border-radius: 6px;
    border: none;
    background: none;
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition:
      background 0.12s,
      color 0.12s;

    &:hover {
      color: var(--text-2);
    }

    &--active,
    &--active:hover {
      background: var(--line);
      color: var(--text);
    }
  }

  &__filter-count {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
  }

  &__toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 30px;
    border-radius: 6px;
    border: none;
    background: none;
    color: var(--muted);
    cursor: pointer;
    transition:
      background 0.12s,
      color 0.12s;

    &:hover {
      color: var(--text-2);
    }

    &--active,
    &--active:hover {
      background: var(--line);
      color: var(--text);
    }
  }

  &__expand-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 12px;
    border-radius: var(--radius);
    border: 1px solid var(--line);
    background: none;
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-2);
    cursor: pointer;
    transition:
      background 0.12s,
      color 0.12s;

    &:hover {
      background: var(--raised);
      color: var(--text);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__new-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 44px;
    border-radius: var(--radius);
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

    &:hover {
      border-color: var(--muted);
      color: var(--text);
    }
  }
}

@media (max-width: 768px) {
  .tasks-view {
    padding: 16px 12px;
    gap: 16px;

    &__filters {
      flex: 1;
    }

    &__filter-btn {
      flex: 1;
      height: 38px;
      padding: 0 8px;
      gap: 6px;
    }

    &__expand-btn {
      width: 44px;
      height: 44px;
      padding: 0;
      justify-content: center;
      gap: 0;
    }
  }
}
</style>
