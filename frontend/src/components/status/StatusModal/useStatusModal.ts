import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Status } from '../../../types'

const COLOR_PALETTE = [
    '#9aa3af',
    '#4f7bd9',
    '#d99a2b',
    '#4f9d6f',
    '#9b5fd0',
    '#dd5a4b',
    '#d06a3f',
    '#3aa6a6',
]

interface StatusModalProps {
    modelValue: boolean
    status?: Status | null
    canDelete?: boolean
}

interface StatusModalEmit {
    (evt: 'update:modelValue', value: boolean): void
    (evt: 'save', data: { title: string; color: string; isDone: boolean }): void
    (evt: 'delete', status: Status): void
}

export function useStatusModal(props: StatusModalProps, emit: StatusModalEmit) {
    const { t } = useI18n()

    const title = ref('')
    const color = ref(COLOR_PALETTE[0])
    const isDone = ref(false)

    const isEdit = computed(() => Boolean(props.status))

    watch(() => props.modelValue, (open) => {
        if (!open) return
        if (props.status) {
            title.value = props.status.title
            color.value = props.status.color
            isDone.value = props.status.isDone
        } else {
            title.value = ''
            color.value = COLOR_PALETTE[0]
            isDone.value = false
        }
    })

    function close() {
        emit('update:modelValue', false)
    }

    function handleSave() {
        if (!title.value.trim()) return
        emit('save', { title: title.value.trim(), color: color.value, isDone: isDone.value })
        close()
    }

    function handleDelete() {
        if (props.status) {
            emit('delete', props.status)
            close()
        }
    }

    return {
        t,
        COLOR_PALETTE,
        title, color, isDone, isEdit,
        close, handleSave, handleDelete,
    }
}
