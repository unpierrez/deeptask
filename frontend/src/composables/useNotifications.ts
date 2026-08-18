import { ref, computed } from 'vue';
import { apiGet, apiPost, apiPatch } from '../lib/api';
import { getToken } from '../lib/auth';
import type { Notification } from '../types';

const notifications = ref<Notification[]>([]);
const loading = ref(false);

export function useNotifications() {
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.isRead).length,
  );

  async function fetchNotifications() {
    loading.value = true;
    try {
      const data = await apiGet<{
        notifications: Notification[];
        unreadCount: number;
      }>('notifications', getToken() ?? undefined);
      notifications.value = data.notifications;
    } finally {
      loading.value = false;
    }
  }

  async function markAllRead() {
    await apiPost('notifications/read-all', undefined, getToken() ?? undefined);
    notifications.value = notifications.value.map((n) => ({
      ...n,
      isRead: true,
    }));
  }

  async function markRead(id: string) {
    await apiPatch(
      `notifications/${id}/read`,
      undefined,
      getToken() ?? undefined,
    );
    const n = notifications.value.find((n) => n.id === id);
    if (n) n.isRead = true;
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllRead,
    markRead,
  };
}
