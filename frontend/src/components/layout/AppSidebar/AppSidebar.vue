<script setup lang="ts">
import { useAppSidebar } from './useAppSidebar';
import type { User, Task, Status } from '../../../types';

const props = defineProps<{
  user: User | null;
  tasks: Task[];
  statuses: Status[];
  mobileOpen?: boolean;
}>();

const emit = defineEmits<{ close: [] }>();

const {
  t,
  locale,
  langs,
  navItems,
  doneCount,
  total,
  donePct,
  initials,
  viewMode,
  isActive,
  handleSaveDefault,
  handleLogout,
} = useAppSidebar(props, () => emit('close'));
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--mobile-open': mobileOpen }">
    <div class="sidebar__brand">
      <div class="sidebar__logo">
        <img src="/favicon.svg" width="32" height="32" alt="DeepTask" />
      </div>
      <span class="sidebar__wordmark">DeepTask</span>
      <button class="sidebar__close-btn" @click="emit('close')">
        <q-icon name="close" size="20px" />
      </button>
    </div>

    <nav class="sidebar__nav">
      <p class="sidebar__nav-label">{{ t('nav.menu') }}</p>
      <ul class="sidebar__nav-list">
        <li v-for="item in navItems" :key="item.name">
          <RouterLink
            :to="item.path"
            class="sidebar__nav-item"
            :class="{ 'sidebar__nav-item--active': isActive(item.path) }"
          >
            <q-icon :name="item.icon" size="18px" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar__progress">
      <div class="sidebar__progress-header">
        <span class="sidebar__progress-title">{{
          t('tasks.progressTitle')
        }}</span>
        <span class="sidebar__progress-pct">{{ donePct }}%</span>
      </div>
      <div class="sidebar__progress-bar">
        <div class="sidebar__progress-fill" :style="{ width: donePct + '%' }" />
      </div>
      <p class="sidebar__progress-label">
        {{ t('tasks.progressLabel', { done: doneCount, total }) }}
      </p>
    </div>

    <div class="sidebar__footer">
      <div
        class="sidebar__avatar"
        :style="{ background: user?.avatarColor ?? '#7c5cbf' }"
      >
        {{ initials }}
      </div>
      <div class="sidebar__user-info">
        <span class="sidebar__user-name">{{ user?.name }}</span>
      </div>
      <button class="sidebar__settings-btn" title="Opções">
        <q-icon name="settings" size="18px" />
        <q-menu anchor="top right" self="bottom right" :offset="[0, 8]">
          <q-list class="sidebar-menu">
            <q-item
              v-close-popup
              clickable
              class="sidebar-menu__item"
              @click="handleSaveDefault"
            >
              <q-item-section avatar>
                <q-icon name="bookmark" size="16px" />
              </q-item-section>
              <q-item-section>
                <div class="sidebar-menu__item-label">
                  {{ t('tasks.saveDefaultView') }}
                </div>
                <div class="sidebar-menu__item-sub">
                  {{
                    t('tasks.currentView', {
                      mode:
                        viewMode === 'kanban'
                          ? 'Kanban'
                          : locale === 'en'
                            ? 'List'
                            : 'Lista',
                    })
                  }}
                </div>
              </q-item-section>
            </q-item>
            <q-separator class="sidebar-menu__sep" />
            <q-item
              v-close-popup
              clickable
              class="sidebar-menu__item sidebar-menu__item--danger"
              @click="handleLogout"
            >
              <q-item-section avatar>
                <q-icon name="logout" size="16px" />
              </q-item-section>
              <q-item-section>{{ t('nav.logout') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </button>
    </div>

    <div class="sidebar__lang-row">
      <div class="sidebar__lang">
        <button
          v-for="lang in langs"
          :key="lang.code"
          class="sidebar__lang-btn"
          :class="{ 'sidebar__lang-btn--active': locale === lang.code }"
          @click="locale = lang.code"
        >
          {{ lang.label }}
        </button>
      </div>
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
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    letter-spacing: -0.02em;
    flex: 1;
  }

  &__close-btn {
    display: none;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    line-height: 1;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }
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
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    transition:
      background 0.15s,
      color 0.15s;

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
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__progress-pct {
    font-size: 0.8125rem;
    font-weight: 700;
    color: #ffffff;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
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
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__lang-row {
    padding: 0 8px 4px;
  }

  &__lang {
    display: inline-flex;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
  }

  &__lang-btn {
    padding: 4px 10px;
    border-radius: 7px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
    font-size: 11px;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: all 0.15s;

    &:hover:not(&--active) {
      color: rgba(255, 255, 255, 0.7);
    }

    &--active {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }
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
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
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
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
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
    transition:
      color 0.15s,
      background 0.15s;
    position: relative;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.08);
    }
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    min-width: 0;
    width: 272px;

    &--mobile-open {
      transform: translateX(0);
    }

    &__close-btn {
      display: flex;
    }
  }
}

.sidebar-menu {
  min-width: 200px;
  padding: 4px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;

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

  &__item-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #141414;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  &__item-sub {
    font-size: 0.75rem;
    color: #9aa3af;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    margin-top: 1px;
  }

  &__sep {
    margin: 3px 4px;
  }
}
</style>
