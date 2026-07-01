<script setup lang="ts">
import NotificationDropdown from '../../notifications/NotificationDropdown/NotificationDropdown.vue'
import { useAppHeader } from './useAppHeader'

defineProps<{
    unreadCount: number
}>()

const emit = defineEmits<{
    newTask: []
    toggleMenu: []
}>()

const searchQuery = defineModel<string>('search', { default: '' })
const { t, screenConfig } = useAppHeader()
</script>

<template>
    <header class="app-header">
        <button class="app-header__hamburger" @click="emit('toggleMenu')" aria-label="Menu">
            <q-icon name="menu" size="22px" />
        </button>

        <div class="app-header__titles">
            <h1 class="app-header__title">{{ screenConfig.title }}</h1>
            <p class="app-header__subtitle">{{ screenConfig.subtitle }}</p>
        </div>

        <div class="app-header__actions">
            <div v-if="screenConfig.showSearch" class="app-header__search">
                <q-icon name="search" size="16px" class="app-header__search-icon" />
                <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="t('common.search')"
                    class="app-header__search-input"
                />
            </div>

            <NotificationDropdown :unread-count="unreadCount" />

            <button class="app-header__new-btn" @click="emit('newTask')">
                <q-icon name="add" size="18px" />
                <span class="app-header__new-label">{{ t('common.newTask') }}</span>
            </button>
        </div>
    </header>
</template>

<style scoped lang="scss">
.app-header {
    height: 64px;
    min-height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    background: #ffffff;
    border-bottom: 1px solid #ebebec;
    gap: 16px;

    &__hamburger {
        display: none;
        background: none;
        border: none;
        color: #374151;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        flex-shrink: 0;
        line-height: 1;

        &:hover {
            background: #f0f1f3;
        }
    }

    &__titles {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
    }

    &__title {
        font-size: 1.125rem;
        font-weight: 700;
        color: #141414;
        margin: 0;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__subtitle {
        font-size: 0.8125rem;
        color: #9aa3af;
        margin: 0;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        text-transform: capitalize;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }

    &__search {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #f5f6f8;
        border: 1px solid #ebebec;
        border-radius: 10px;
        padding: 0 12px;
        height: 38px;
        width: 220px;
    }

    &__search-icon {
        color: #9aa3af;
        flex-shrink: 0;
    }

    &__search-input {
        border: none;
        background: transparent;
        font-size: 0.875rem;
        color: #141414;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        width: 100%;
        outline: none;

        &::placeholder {
            color: #c4c9d0;
        }
    }

    &__new-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 16px;
        height: 38px;
        background: #141414;
        color: #ffffff;
        border: none;
        border-radius: 10px;
        font-size: 0.875rem;
        font-weight: 600;
        font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s;

        &:hover {
            background: #2a2a2a;
        }
    }
}

@media (max-width: 768px) {
    .app-header {
        padding: 0 16px;
        gap: 10px;

        &__hamburger {
            display: flex;
        }

        &__subtitle {
            display: none;
        }

        &__search {
            display: none;
        }

        &__new-btn {
            width: 38px;
            padding: 0;
            justify-content: center;
        }

        &__new-label {
            display: none;
        }
    }
}
</style>
