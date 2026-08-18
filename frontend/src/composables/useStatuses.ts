import { ref } from 'vue';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api';
import { getToken } from '../lib/auth';
import type { Status } from '../types';

const statuses = ref<Status[]>([]);
const loading = ref(false);

export function useStatuses() {
  async function fetchStatuses() {
    loading.value = true;
    try {
      statuses.value = await apiGet<Status[]>(
        'statuses',
        getToken() ?? undefined,
      );
    } finally {
      loading.value = false;
    }
  }

  async function createStatus(data: {
    title: string;
    color: string;
    isDone?: boolean;
  }) {
    const created = await apiPost<Status>(
      'statuses',
      data,
      getToken() ?? undefined,
    );
    statuses.value.push(created);
    return created;
  }

  async function updateStatus(
    id: string,
    data: { title?: string; color?: string; isDone?: boolean },
  ) {
    const updated = await apiPatch<Status>(
      `statuses/${id}`,
      data,
      getToken() ?? undefined,
    );
    const idx = statuses.value.findIndex((s) => s.id === id);
    if (idx !== -1) statuses.value[idx] = updated;

    if (data.isDone) {
      statuses.value = statuses.value.map((s) =>
        s.id !== id ? { ...s, isDone: false } : s,
      );
    }

    return updated;
  }

  async function deleteStatus(id: string) {
    await apiDelete(`statuses/${id}`, getToken() ?? undefined);
    statuses.value = statuses.value.filter((s) => s.id !== id);
  }

  async function reorderStatuses(items: { id: string; position: number }[]) {
    await apiPatch('statuses/reorder', { items }, getToken() ?? undefined);
    items.forEach(({ id, position }) => {
      const s = statuses.value.find((s) => s.id === id);
      if (s) s.position = position;
    });
    statuses.value.sort((a, b) => a.position - b.position);
  }

  return {
    statuses,
    loading,
    fetchStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
  };
}
