import { ref, computed, type Ref } from 'vue'
import { useDragDrop } from './useDragDrop'

interface DropPayload {
    taskId: string
    targetStatusId: string
    insertBeforeTaskId: string | null
}

export function useDropZone(
    tasks: Ref<{ id: string }[]>,
    getStatusId: () => string,
    onTaskDropped: (payload: DropPayload) => void,
) {
    const { draggingTask, endDrag } = useDragDrop()
    const isDragOver = ref(false)
    const dropInsertBeforeId = ref<string | null | undefined>(undefined)

    const dropIndicatorIndex = computed(() => {
        if (dropInsertBeforeId.value === undefined) return -1
        if (dropInsertBeforeId.value === null) return tasks.value.length
        const idx = tasks.value.findIndex((t) => t.id === dropInsertBeforeId.value)
        return idx === -1 ? tasks.value.length : idx
    })

    function onDragOver(e: DragEvent) {
        if (!draggingTask.value) return
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'
        isDragOver.value = true

        const rows = [
            ...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[data-task-id]'),
        ].filter((row) => row.dataset.taskId !== draggingTask.value?.id)

        let insertBefore: string | null = null
        for (const row of rows) {
            const rect = row.getBoundingClientRect()
            if (e.clientY < rect.top + rect.height / 2) {
                insertBefore = row.dataset.taskId!
                break
            }
        }
        dropInsertBeforeId.value = insertBefore
    }

    function onDragLeave(e: DragEvent) {
        const related = e.relatedTarget as Node | null
        if (!related || !(e.currentTarget as HTMLElement).contains(related)) {
            isDragOver.value = false
            dropInsertBeforeId.value = undefined
        }
    }

    function onDrop(e: DragEvent) {
        e.preventDefault()
        isDragOver.value = false
        if (!draggingTask.value) return
        const payload: DropPayload = {
            taskId: draggingTask.value.id,
            targetStatusId: getStatusId(),
            insertBeforeTaskId: dropInsertBeforeId.value ?? null,
        }
        dropInsertBeforeId.value = undefined
        endDrag()
        onTaskDropped(payload)
    }

    return { draggingTask, isDragOver, dropIndicatorIndex, onDragOver, onDragLeave, onDrop }
}
