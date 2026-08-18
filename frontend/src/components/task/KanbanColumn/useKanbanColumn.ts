import { toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDropZone } from '../../../composables/useDropZone';
import type { Status, Task } from '../../../types';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  isDoneStatus: boolean;
}

type KanbanColumnEmit = (
  e: 'taskDropped',
  payload: {
    taskId: string;
    targetStatusId: string;
    insertBeforeTaskId: string | null;
  },
) => void;

export function useKanbanColumn(
  props: KanbanColumnProps,
  emit: KanbanColumnEmit,
) {
  const { t } = useI18n();

  const {
    draggingTask,
    isDragOver,
    dropIndicatorIndex,
    onDragOver,
    onDragLeave,
    onDrop,
  } = useDropZone(
    toRef(props, 'tasks'),
    () => props.status.id,
    (payload) => emit('taskDropped', payload),
  );

  return {
    t,
    draggingTask,
    isDragOver,
    dropIndicatorIndex,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
