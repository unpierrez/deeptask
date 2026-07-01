import { ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDropZone } from '../../../composables/useDropZone'
import type { Status, Task } from '../../../types'

interface TaskGroupProps {
    status: Status
    tasks: Task[]
    isDoneStatus: boolean
    startCollapsed?: boolean
}

type TaskGroupEmit = (
    e: 'taskDropped',
    payload: { taskId: string; targetStatusId: string; insertBeforeTaskId: string | null },
) => void

export function useTaskGroup(props: TaskGroupProps, emit: TaskGroupEmit) {
    const { t } = useI18n()
    const collapsed = ref(props.startCollapsed ?? false)

    const { draggingTask, isDragOver, dropIndicatorIndex, onDragOver, onDragLeave, onDrop } = useDropZone(
        toRef(props, 'tasks'),
        () => props.status.id,
        (payload) => emit('taskDropped', payload),
    )

    return { t, collapsed, draggingTask, isDragOver, dropIndicatorIndex, onDragOver, onDragLeave, onDrop }
}
