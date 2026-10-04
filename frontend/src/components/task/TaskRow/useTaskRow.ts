import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Task } from '../../../types';
import { useDragDrop } from '../../../composables/useDragDrop';
import { PRIORITY_COLORS } from '../../../lib/priority';

export function useTaskRow(_props: { task: Task; isDone: boolean }) {
  const { t, locale } = useI18n();
  const { draggingTask, startDrag, endDrag } = useDragDrop();

  const priorityConfig = computed(() => ({
    alta: { label: t('priorities.alta'), color: PRIORITY_COLORS.alta },
    media: { label: t('priorities.media'), color: PRIORITY_COLORS.media },
    baixa: { label: t('priorities.baixa'), color: PRIORITY_COLORS.baixa },
  }));

  function formatDate(date: string | null) {
    if (!date) return null;
    const [y, m, d] = date.split('-').map(Number);
    return new Intl.DateTimeFormat(locale.value, {
      day: 'numeric',
      month: 'short',
    }).format(new Date(y, m - 1, d));
  }

  return { t, priorityConfig, formatDate, draggingTask, startDrag, endDrag };
}
