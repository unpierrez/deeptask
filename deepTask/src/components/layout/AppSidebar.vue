<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from '../../lib/auth'
import type { User } from '../../types'
import type { Task, Status } from '../../types'

const props = defineProps<{
    user: User | null
    tasks: Task[]
    statuses: Status[]
}>()


const router = useRouter()
const route = useRoute()

const doneStatusIds = computed(() => new Set(props.statuses.filter((s) => s.isDone).map((s) => s.id)))
const total = computed(() => props.tasks.length)
const doneCount = computed(() => props.tasks.filter((t) => doneStatusIds.value.has(t.statusId)).length)
const donePct = computed(() => total.value > 0 ? Math.round((doneCount.value / total.value) * 100) : 0)

const initials = computed(() => {
    if (!props.user?.name) return '?'
    return props.user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
})

const navItems = [
    { name: 'tasks', label: 'Minhas Tarefas', icon: 'checklist', path: '/dashboard/tasks' },
    { name: 'report', label: 'Relatório', icon: 'bar_chart', path: '/dashboard/report' },
]

function isActive(path: string) {
    return route.path.startsWith(path)
}

function handleLogout() {
    logout()
    router.replace('/login')
}
</script>

<template>
    <aside class="sidebar">
        <div class="sidebar__brand">
            <div class="sidebar__logo">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="white" fill-opacity="0.15" stroke="white"
                        stroke-width="1.5" />
                    <path d="M14 7L20 10.5V17.5L14 21L8 17.5V10.5L14 7Z" fill="white" fill-opacity="0.3" />
                </svg>
            </div>
            <span class="sidebar__wordmark">DeepTask</span>
        </div>

        <nav class="sidebar__nav">
            <p class="sidebar__nav-label">MENU</p>
            <ul class="sidebar__nav-list">
                <li v-for="item in navItems" :key="item.name">
                    <RouterLink :to="item.path" class="sidebar__nav-item" :class="{ 'sidebar__nav-item--active': isActive(item.path) }">
                        <q-icon :name="item.icon" size="18px" />
                        <span>{{ item.label }}</span>
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <div class="sidebar__progress">
            <div class="sidebar__progress-header">
                <span class="sidebar__progress-title">Progresso de hoje</span>
                <span class="sidebar__progress-pct">{{ donePct }}%</span>
            </div>
            <div class="sidebar__progress-bar">
                <div class="sidebar__progress-fill" :style="{ width: donePct + '%' }" />
            </div>
            <p class="sidebar__progress-label">{{ doneCount }} de {{ total }} concluídas</p>
        </div>

        <div class="sidebar__footer">
            <div class="sidebar__avatar" :style="{ background: user?.avatarColor ?? '#c2864f' }">
                {{ initials }}
            </div>
            <div class="sidebar__user-info">
                <span class="sidebar__user-name">{{ user?.name }}</span>
                <span class="sidebar__user-type">{{ user?.accountType }}</span>
            </div>
            <button class="sidebar__settings-btn" title="Opções">
                <q-icon name="settings" size="18px" />
                <q-menu anchor="top right" self="bottom right" :offset="[0, 8]">
                    <q-list class="sidebar-menu">
                        <q-item clickable v-close-popup class="sidebar-menu__item sidebar-menu__item--danger" @click="handleLogout">
                            <q-item-section avatar>
                                <q-icon name="logout" size="16px" />
                            </q-item-section>
                            <q-item-section>Sair</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </button>
        </div>
    </aside>
</template>

<style scoped lang="scss">
.sidebar {
    width: 248px;
    min-width: 248px;
    height: 100vh;
    background: #141414;
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    gap: 8px;
    position: sticky;
    top: 0;

    &__brand {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 8px;
        margin-bottom: 28px;
    }

    &__logo {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__wordmark {
        font-size: 1.125rem;
        font-weight: 700;
        color: #ffffff;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        letter-spacing: -0.02em;
    }

    &__nav {
        flex: 1;
    }

    &__nav-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.35);
        letter-spacing: 0.08em;
        margin: 0 0 8px 8px;
    }

    &__nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    &__nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.9rem;
        font-weight: 500;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        transition: background 0.15s, color 0.15s;

        &:hover {
            background: rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.85);
        }

        &--active {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            font-weight: 600;
        }
    }

    &__progress {
        background: rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        padding: 14px;
        margin: 8px 0;
    }

    &__progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    &__progress-title {
        font-size: 0.8125rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.65);
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__progress-pct {
        font-size: 0.8125rem;
        font-weight: 700;
        color: #ffffff;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__progress-bar {
        height: 5px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 99px;
        overflow: hidden;
        margin-bottom: 8px;
    }

    &__progress-fill {
        height: 100%;
        background: #ffffff;
        border-radius: 99px;
        transition: width 0.4s ease;
    }

    &__progress-label {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.4);
        margin: 0;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__footer {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        margin-top: 4px;
    }

    &__avatar {
        width: 34px;
        height: 34px;
        min-width: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        color: #ffffff;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    }

    &__user-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__user-name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #ffffff;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__user-type {
        font-size: 0.6875rem;
        color: rgba(255, 255, 255, 0.45);
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__settings-btn {
        background: none;
        border: none;
        padding: 6px;
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: color 0.15s, background 0.15s;
        position: relative;

        &:hover {
            color: rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.08);
        }
    }
}

.sidebar-menu {
    min-width: 160px;
    padding: 4px;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;

    &__item {
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        min-height: 38px;

        :deep(.q-item__section--avatar) {
            min-width: 28px;
            padding-right: 4px;
        }

        &--danger {
            color: #dd5a4b;

            &:hover {
                background: #fff5f5;
            }
        }
    }
}
</style>
