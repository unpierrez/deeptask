<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Task, Status } from '../../types'

const props = defineProps<{
    modelValue: boolean
    statuses: Status[]
    task?: Task | null
    defaultStatusId?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    save: [data: {
        title: string
        statusId: string
        priority: string
        tags: string[]
        dueDate: string | null
        description: string | null
    }]
    delete: [task: Task]
}>()

const title = ref('')
const description = ref('')
const statusId = ref('')
const priority = ref('media')
const tagsInput = ref('')
const dueDate = ref('')

const isEdit = computed(() => Boolean(props.task))

watch(() => props.modelValue, (open) => {
    if (!open) return
    if (props.task) {
        title.value = props.task.title
        description.value = props.task.description ?? ''
        statusId.value = props.task.statusId
        priority.value = props.task.priority
        tagsInput.value = props.task.tags.join(', ')
        dueDate.value = props.task.dueDate ?? ''
    } else {
        title.value = ''
        description.value = ''
        statusId.value = props.defaultStatusId ?? props.statuses[0]?.id ?? ''
        priority.value = 'media'
        tagsInput.value = ''
        dueDate.value = ''
    }
})

const priorities = [
    { value: 'alta', label: 'Alta', color: '#dd5a4b' },
    { value: 'media', label: 'Média', color: '#d99a2b' },
    { value: 'baixa', label: 'Baixa', color: '#6b9bd1' },
]

function close() {
    emit('update:modelValue', false)
}

function handleSave() {
    if (!title.value.trim()) return

    const tags = tagsInput.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

    emit('save', {
        title: title.value.trim(),
        statusId: statusId.value,
        priority: priority.value,
        tags,
        dueDate: dueDate.value.trim() || null,
        description: description.value.trim() || null,
    })

    close()
}

function handleDelete() {
    if (props.task) {
        emit('delete', props.task)
        close()
    }
}
</script>

<template>
    <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
        <div class="task-modal">
            <div class="task-modal__header">
                <h2 class="task-modal__title">{{ isEdit ? 'Editar tarefa' : 'Nova tarefa' }}</h2>
                <button class="task-modal__close" @click="close">
                    <q-icon name="close" size="18px" />
                </button>
            </div>

            <div class="task-modal__body">
                <div class="task-modal__field">
                    <label class="task-modal__label">Título *</label>
                    <input
                        v-model="title"
                        class="task-modal__input"
                        placeholder="Nome da tarefa"
                        @keydown.enter="handleSave"
                        autofocus
                    />
                </div>

                <div class="task-modal__field">
                    <label class="task-modal__label">Descrição</label>
                    <textarea
                        v-model="description"
                        class="task-modal__input task-modal__input--textarea"
                        placeholder="Detalhes, contexto, notas..."
                        rows="3"
                    />
                </div>

                <div class="task-modal__field">
                    <label class="task-modal__label">Prioridade</label>
                    <div class="task-modal__priority-group">
                        <button
                            v-for="p in priorities"
                            :key="p.value"
                            class="task-modal__priority-btn"
                            :class="{ 'task-modal__priority-btn--active': priority === p.value }"
                            :style="priority === p.value ? { borderColor: p.color, color: p.color, background: p.color + '18' } : {}"
                            @click="priority = p.value"
                        >
                            <div class="task-modal__priority-dot" :style="{ background: p.color }" />
                            {{ p.label }}
                        </button>
                    </div>
                </div>

                <div class="task-modal__field">
                    <label class="task-modal__label">Status</label>
                    <div class="task-modal__status-group">
                        <button
                            v-for="s in statuses"
                            :key="s.id"
                            class="task-modal__status-btn"
                            :class="{ 'task-modal__status-btn--active': statusId === s.id }"
                            :style="statusId === s.id ? { borderColor: s.color, color: s.color, background: s.color + '18' } : {}"
                            @click="statusId = s.id"
                        >
                            <div class="task-modal__status-dot" :style="{ background: s.color }" />
                            {{ s.title }}
                        </button>
                    </div>
                </div>

                <div class="task-modal__row">
                    <div class="task-modal__field">
                        <label class="task-modal__label">Categorias</label>
                        <input
                            v-model="tagsInput"
                            class="task-modal__input"
                            placeholder="Saúde, Casa, Trabalho..."
                        />
                        <span class="task-modal__hint">Separe por vírgula</span>
                    </div>

                    <div class="task-modal__field">
                        <label class="task-modal__label">Prazo</label>
                        <input
                            v-model="dueDate"
                            type="date"
                            class="task-modal__input task-modal__input--date"
                        />
                    </div>
                </div>
            </div>

            <div class="task-modal__footer">
                <button v-if="isEdit" class="task-modal__delete-btn" @click="handleDelete">
                    <q-icon name="delete" size="16px" />
                    Excluir
                </button>
                <div class="task-modal__footer-right">
                    <button class="task-modal__cancel-btn" @click="close">Cancelar</button>
                    <button
                        class="task-modal__save-btn"
                        :disabled="!title.trim()"
                        @click="handleSave"
                    >
                        {{ isEdit ? 'Salvar' : 'Criar tarefa' }}
                    </button>
                </div>
            </div>
        </div>
    </q-dialog>
</template>

<style scoped lang="scss">
.task-modal {
    width: 520px;
    max-width: calc(100vw - 32px);
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px 0;
    }

    &__title {
        font-size: 1.0625rem;
        font-weight: 700;
        color: #141414;
        margin: 0;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__close {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        border: none;
        background: #f0f1f3;
        color: #6b7280;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.12s;

        &:hover {
            background: #e5e6e8;
            color: #141414;
        }
    }

    &__body {
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #374151;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__hint {
        font-size: 0.75rem;
        color: #9aa3af;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__input {
        height: 40px;
        border: 1.5px solid #e5e7eb;
        border-radius: 9px;
        padding: 0 12px;
        font-size: 0.9rem;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        background: #f9fafb;
        outline: none;
        transition: border-color 0.15s, background 0.15s;

        &:focus {
            border-color: #a0a0a0;
            background: #ffffff;
        }

        &::placeholder {
            color: #c4c9d0;
        }

        &--date {
            cursor: pointer;
        }

        &--textarea {
            height: auto;
            padding: 10px 12px;
            resize: vertical;
            min-height: 72px;
            line-height: 1.5;
        }
    }

    &__priority-group,
    &__status-group {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
    }

    &__priority-btn,
    &__status-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border-radius: 8px;
        border: 1.5px solid #e5e7eb;
        background: #f9fafb;
        font-size: 0.8125rem;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: all 0.12s;

        &:hover {
            border-color: #c4c9d0;
            color: #374151;
        }
    }

    &__priority-dot,
    &__status-dot {
        width: 7px;
        height: 7px;
        border-radius: 2px;
        flex-shrink: 0;
    }

    &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-top: 1px solid #f0f1f3;
    }

    &__footer-right {
        display: flex;
        gap: 8px;
        margin-left: auto;
    }

    &__cancel-btn {
        height: 38px;
        padding: 0 16px;
        border-radius: 9px;
        border: 1.5px solid #e5e7eb;
        background: none;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: background 0.12s;

        &:hover {
            background: #f9fafb;
        }
    }

    &__save-btn {
        height: 38px;
        padding: 0 20px;
        border-radius: 9px;
        border: none;
        background: #141414;
        font-size: 0.875rem;
        font-weight: 600;
        color: #ffffff;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: background 0.12s;

        &:hover:not(:disabled) {
            background: #2a2a2a;
        }

        &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }

    &__delete-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 38px;
        padding: 0 14px;
        border-radius: 9px;
        border: 1.5px solid #fde8e8;
        background: #fff5f5;
        font-size: 0.875rem;
        font-weight: 500;
        color: #dd5a4b;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: background 0.12s;

        &:hover {
            background: #fde8e8;
        }
    }
}
</style>
