import { ref, computed } from 'vue';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api';
import { getToken } from '../lib/auth';
import type { Task, TaskFilter } from '../types';

const tasks = ref<Task[]>([]);
const loading = ref(false);
const filter = ref<TaskFilter>('all');
const searchQuery = ref('');

export function useTasks() {
  async function fetchTasks() {
    loading.value = true;
    try {
      tasks.value = await apiGet<Task[]>('tasks', getToken() ?? undefined);
    } finally {
      loading.value = false;
    }
  }

  async function createTask(data: {
    title: string;
    statusId: string;
    priority?: string;
    tags?: string[];
    dueDate?: string;
    description?: string | null;
  }) {
    const created = await apiPost<Task>('tasks', data, getToken() ?? undefined);
    tasks.value.unshift(created);
    return created;
  }

  async function updateTask(
    id: string,
    data: {
      title?: string;
      statusId?: string;
      priority?: string;
      tags?: string[];
      dueDate?: string | null;
      description?: string | null;
    },
  ) {
    const updated = await apiPatch<Task>(
      `tasks/${id}`,
      data,
      getToken() ?? undefined,
    );
    const idx = tasks.value.findIndex((t) => t.id === id);
    if (idx !== -1) tasks.value[idx] = updated;
    return updated;
  }

  async function completeTask(id: string) {
    const updated = await apiPost<Task>(
      `tasks/${id}/complete`,
      undefined,
      getToken() ?? undefined,
    );
    const idx = tasks.value.findIndex((t) => t.id === id);
    if (idx !== -1) tasks.value[idx] = updated;
    return updated;
  }

  async function reopenTask(id: string) {
    const updated = await apiPost<Task>(
      `tasks/${id}/reopen`,
      undefined,
      getToken() ?? undefined,
    );
    const idx = tasks.value.findIndex((t) => t.id === id);
    if (idx !== -1) tasks.value[idx] = updated;
    return updated;
  }

  async function deleteTask(id: string) {
    await apiDelete(`tasks/${id}`, getToken() ?? undefined);
    tasks.value = tasks.value.filter((t) => t.id !== id);
  }

  async function reorderTasks(
    items: { id: string; statusId: string; position: number }[],
  ) {
    // Optimistic update — apply locally before the server responds
    items.forEach(({ id, statusId, position }) => {
      const task = tasks.value.find((t) => t.id === id);
      if (task) {
        task.statusId = statusId;
        task.position = position;
      }
    });
    try {
      await apiPatch('tasks/reorder', { items }, getToken() ?? undefined);
    } catch {
      // Rollback on failure by refetching the server state
      await fetchTasks();
    }
  }

  function getTasksByStatus(statusId: string, doneStatusIds: Set<string>) {
    return computed(() => {
      let list = tasks.value.filter((t) => t.statusId === statusId);

      if (filter.value === 'done') {
        list = list.filter((t) => doneStatusIds.has(t.statusId));
      } else if (filter.value === 'active') {
        list = list.filter((t) => !doneStatusIds.has(t.statusId));
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
    });
  }

  const total = computed(() => tasks.value.length);

  return {
    tasks,
    loading,
    filter,
    searchQuery,
    total,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    reopenTask,
    deleteTask,
    reorderTasks,
    getTasksByStatus,
  };
}
