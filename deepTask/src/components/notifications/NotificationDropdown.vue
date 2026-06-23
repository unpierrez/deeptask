<script setup lang="ts">
import { ref } from 'vue'
import { useNotifications } from '../../composables/useNotifications'
import type { NotificationType } from '../../types'

defineProps<{ unreadCount: number }>()

const { notifications, markAllRead, markRead } = useNotifications()
const open = ref(false)

const iconMap: Record<NotificationType, { icon: string; color: string }> = {
    due_soon: { icon: 'schedule', color: '#d99a2b' },
    high_priority: { icon: 'flag', color: '#dd5a4b' },
    completed: { icon: 'check_circle', color: '#4f9d6f' },
    achievement: { icon: 'auto_awesome', color: '#9b5fd0' },
}

function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Agora'
    if (mins < 60) return `Há ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Há ${hours}h`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'Ontem'
    return `${days} dias atrás`
}

async function handleMarkRead(id: string, isRead: boolean) {
    if (!isRead) await markRead(id)
}

function toggle() {
    open.value = !open.value
}

function close() {
    open.value = false
}
</script>

<template>
    <div class="notif" v-click-outside="close">
        <button class="notif__bell" @click="toggle" :class="{ 'notif__bell--active': open }">
            <q-icon name="notifications" size="20px" />
            <span v-if="unreadCount > 0" class="notif__badge">{{ unreadCount }}</span>
        </button>

        <Transition name="dropdown">
            <div v-if="open" class="notif__dropdown">
                <div class="notif__header">
                    <span class="notif__header-title">Notificações</span>
                    <button v-if="unreadCount > 0" class="notif__mark-all" @click="markAllRead">
                        Marcar todas
                    </button>
                </div>

                <div class="notif__list">
                    <div
                        v-for="n in notifications"
                        :key="n.id"
                        class="notif__item"
                        :class="{ 'notif__item--unread': !n.isRead }"
                        @click="handleMarkRead(n.id, n.isRead)"
                    >
                        <div class="notif__icon" :style="{ color: iconMap[n.type].color }">
                            <q-icon :name="iconMap[n.type].icon" size="18px" />
                        </div>
                        <div class="notif__content">
                            <p class="notif__message">{{ n.message }}</p>
                            <span class="notif__time">{{ relativeTime(n.createdAt) }}</span>
                        </div>
                        <div v-if="!n.isRead" class="notif__dot" />
                    </div>

                    <div v-if="notifications.length === 0" class="notif__empty">
                        Nenhuma notificação
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.notif {
    position: relative;

    &__bell {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        border: 1px solid #ebebec;
        background: #f5f6f8;
        color: #6b7280;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: background 0.15s, border-color 0.15s;

        &:hover, &--active {
            background: #ebebec;
            border-color: #d8d9db;
        }
    }

    &__badge {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #dd5a4b;
        color: #fff;
        font-size: 0.625rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        border: 1.5px solid #ffffff;
    }

    &__dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 340px;
        background: #ffffff;
        border: 1px solid #ebebec;
        border-radius: 14px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 100;
        overflow: hidden;
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-bottom: 1px solid #f0f1f3;
    }

    &__header-title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__mark-all {
        font-size: 0.8125rem;
        font-weight: 500;
        color: #6b7280;
        background: none;
        border: none;
        cursor: pointer;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        padding: 0;

        &:hover {
            color: #141414;
        }
    }

    &__list {
        max-height: 360px;
        overflow-y: auto;
    }

    &__item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.12s;

        &:hover {
            background: #f9fafb;
        }

        &--unread {
            background: #fafbff;
        }
    }

    &__icon {
        width: 32px;
        height: 32px;
        min-width: 32px;
        border-radius: 8px;
        background: #f5f6f8;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__content {
        flex: 1;
        min-width: 0;
    }

    &__message {
        font-size: 0.8125rem;
        color: #2d3748;
        margin: 0 0 3px;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        line-height: 1.4;
    }

    &__time {
        font-size: 0.75rem;
        color: #9aa3af;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__dot {
        width: 8px;
        height: 8px;
        min-width: 8px;
        border-radius: 50%;
        background: #141414;
        margin-top: 4px;
    }

    &__empty {
        padding: 24px 16px;
        text-align: center;
        font-size: 0.875rem;
        color: #9aa3af;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
