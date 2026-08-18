import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotifications } from '../../../composables/useNotifications';
import type { NotificationType } from '../../../types';

export function useNotificationDropdown() {
  const { t } = useI18n();
  const { notifications, markAllRead, markRead } = useNotifications();
  const open = ref(false);

  const iconMap: Record<NotificationType, { icon: string; color: string }> = {
    due_soon: { icon: 'schedule', color: '#d99a2b' },
    high_priority: { icon: 'flag', color: '#dd5a4b' },
    completed: { icon: 'check_circle', color: '#4f9d6f' },
    achievement: { icon: 'auto_awesome', color: '#9b5fd0' },
  };

  function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('notifications.now');
    if (mins < 60) return t('notifications.mins', { mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('notifications.hours', { hours });
    const days = Math.floor(hours / 24);
    if (days === 1) return t('notifications.yesterday');
    return t('notifications.days', { days });
  }

  async function handleMarkRead(id: string, isRead: boolean) {
    if (!isRead) await markRead(id);
  }

  function toggle() {
    open.value = !open.value;
  }

  function close() {
    open.value = false;
  }

  return {
    t,
    notifications,
    markAllRead,
    open,
    iconMap,
    relativeTime,
    handleMarkRead,
    toggle,
    close,
  };
}
