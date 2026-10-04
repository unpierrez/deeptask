<script setup lang="ts">
import NotificationDropdown from '../../notifications/NotificationDropdown/NotificationDropdown.vue';
import { useAppHeader } from './useAppHeader';

defineProps<{
  unreadCount: number;
}>();

const emit = defineEmits<{
  newTask: [];
  toggleMenu: [];
}>();

const searchQuery = defineModel<string>('search', { default: '' });
const { t, screenConfig } = useAppHeader();
</script>

<template>
  <header class="app-header">
    <button
      class="app-header__hamburger"
      :aria-label="t('common.menu')"
      @click="emit('toggleMenu')"
    >
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
  height: 72px;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: var(--bg);
  border-bottom: 1px solid var(--line-soft);
  gap: 16px;

  &__hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: none;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    color: var(--text-2);
    cursor: pointer;
    flex-shrink: 0;
    line-height: 1;

    &:hover {
      background: var(--raised);
      color: var(--text);
    }
  }

  &__titles {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtitle {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    margin: 0;
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
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 0 12px;
    height: 38px;
    width: 240px;
    transition: border-color 0.15s;

    &:focus-within {
      border-color: var(--accent);
    }
  }

  &__search-icon {
    color: var(--muted);
    flex-shrink: 0;
  }

  &__search-input {
    border: none;
    background: transparent;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text);
    width: 100%;
    outline: none;

    &::placeholder {
      color: var(--muted);
    }
  }

  &__new-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px;
    height: 38px;
    background: var(--primary-bg);
    color: var(--primary-fg);
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s;

    &:hover {
      opacity: 0.9;
    }
  }
}

@media (max-width: 768px) {
  .app-header {
    height: 64px;
    min-height: 64px;
    padding: 0 16px;
    gap: 10px;

    &__hamburger {
      display: flex;
    }

    &__title {
      font-size: 16px;
    }

    &__subtitle {
      display: none;
    }

    &__search {
      display: none;
    }

    &__new-btn {
      width: 40px;
      height: 40px;
      padding: 0;
      justify-content: center;
    }

    &__new-label {
      display: none;
    }
  }
}
</style>
