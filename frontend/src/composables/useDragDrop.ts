import { ref } from 'vue'
import type { Task } from '../types'

// Module-level: shared across all TaskGroup instances simultaneously
const draggingTask = ref<Task | null>(null)

export function useDragDrop() {
    function startDrag(task: Task, event: DragEvent) {
        draggingTask.value = task
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/plain', task.id)
        }
    }

    function endDrag() {
        draggingTask.value = null
    }

    return { draggingTask, startDrag, endDrag }
}
