<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Status } from '../../types'

const props = defineProps<{
    modelValue: boolean
    status?: Status | null
    canDelete?: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    save: [data: { title: string; color: string; isDone: boolean }]
    delete: [status: Status]
}>()

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
</script>

<template>
    <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
        <div class="status-modal">
            <div class="status-modal__header">
                <h2 class="status-modal__title">{{ isEdit ? 'Editar status' : 'Novo status' }}</h2>
                <button class="status-modal__close" @click="close">
                    <q-icon name="close" size="18px" />
                </button>
            </div>

            <div class="status-modal__body">
                <div class="status-modal__field">
                    <label class="status-modal__label">Nome do status *</label>
                    <input
                        v-model="title"
                        class="status-modal__input"
                        placeholder="Ex: Em Revisão"
                        @keydown.enter="handleSave"
                        autofocus
                    />
                </div>

                <div class="status-modal__field">
                    <label class="status-modal__label">Cor</label>
                    <div class="status-modal__colors">
                        <button
                            v-for="c in COLOR_PALETTE"
                            :key="c"
                            class="status-modal__color-btn"
                            :style="{ background: c }"
                            :class="{ 'status-modal__color-btn--selected': color === c }"
                            @click="color = c"
                        >
                            <q-icon v-if="color === c" name="check" size="14px" style="color: white" />
                        </button>
                    </div>
                </div>

                <div class="status-modal__toggle-row">
                    <div>
                        <p class="status-modal__toggle-label">Status de conclusão</p>
                        <p class="status-modal__toggle-hint">Tarefas aqui contam como concluídas</p>
                    </div>
                    <button
                        class="status-modal__toggle"
                        :class="{ 'status-modal__toggle--on': isDone }"
                        @click="isDone = !isDone"
                    >
                        <div class="status-modal__toggle-knob" />
                    </button>
                </div>
            </div>

            <div class="status-modal__footer">
                <button
                    v-if="isEdit && canDelete"
                    class="status-modal__delete-btn"
                    @click="handleDelete"
                >
                    <q-icon name="delete" size="16px" />
                    Excluir
                </button>
                <div class="status-modal__footer-right">
                    <button class="status-modal__cancel-btn" @click="close">Cancelar</button>
                    <button
                        class="status-modal__save-btn"
                        :disabled="!title.trim()"
                        @click="handleSave"
                    >
                        {{ isEdit ? 'Salvar' : 'Criar status' }}
                    </button>
                </div>
            </div>
        </div>
    </q-dialog>
</template>

<style scoped lang="scss">
.status-modal {
    width: 420px;
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
        gap: 18px;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #374151;
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

        &::placeholder { color: #c4c9d0; }
    }

    &__colors {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    &__color-btn {
        width: 30px;
        height: 30px;
        border-radius: 7px;
        border: 2px solid transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.1s;

        &:hover {
            transform: scale(1.1);
        }

        &--selected {
            border-color: #141414;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8) inset;
        }
    }

    &__toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        background: #f9fafb;
        border: 1.5px solid #e5e7eb;
        border-radius: 10px;
        padding: 12px 14px;
    }

    &__toggle-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #141414;
        margin: 0 0 2px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__toggle-hint {
        font-size: 0.75rem;
        color: #9aa3af;
        margin: 0;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__toggle {
        width: 40px;
        height: 22px;
        min-width: 40px;
        border-radius: 11px;
        background: #d0d5dd;
        border: none;
        cursor: pointer;
        position: relative;
        transition: background 0.2s;

        &--on {
            background: #141414;
        }
    }

    &__toggle-knob {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ffffff;
        transition: left 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);

        .status-modal__toggle--on & {
            left: 21px;
        }
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

        &:hover { background: #f9fafb; }
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

        &:hover:not(:disabled) { background: #2a2a2a; }
        &:disabled { opacity: 0.4; cursor: not-allowed; }
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

        &:hover { background: #fde8e8; }
    }
}
</style>
