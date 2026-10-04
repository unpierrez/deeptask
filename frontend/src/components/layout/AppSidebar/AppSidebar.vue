<script setup lang="ts">
import { computed } from 'vue';
import DtBrand from '../../ui/DtBrand/DtBrand.vue';
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

// Presentation only: 1 cell = 1 task, capped at 20 cells and scaled above that
const MAX_CELLS = 20;
const EMPTY_CELLS = 10;
const progressCells = computed(() => {
  if (total.value === 0) return Array<boolean>(EMPTY_CELLS).fill(false);
  const count = Math.min(total.value, MAX_CELLS);
  const filled = Math.round((doneCount.value / total.value) * count);
  return Array.from({ length: count }, (_, i) => i < filled);
});
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--mobile-open': mobileOpen }">
    <div class="sidebar__brand">
      <DtBrand class="sidebar__wordmark" />
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
            <span
              v-if="isActive(item.path)"
              class="sidebar__nav-marker"
              aria-hidden="true"
            />
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
      <div
        class="sidebar__progress-grid"
        :style="{ gridTemplateColumns: `repeat(${progressCells.length}, 1fr)` }"
        aria-hidden="true"
      >
        <span
          v-for="(filled, i) in progressCells"
          :key="i"
          class="sidebar__progress-cell"
          :class="{ 'sidebar__progress-cell--filled': filled }"
        />
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
      <button class="sidebar__settings-btn" :title="t('common.options')">
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
                          ? t('tasks.viewKanbanShort')
                          : t('tasks.viewListShort'),
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
  width: 232px;
  min-width: 232px;
  height: 100vh;
  background: var(--bg);
  border-right: 1px solid var(--line-soft);
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

  &__wordmark {
    flex: 1;
  }

  &__close-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: none;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    color: var(--muted);
    cursor: pointer;
    line-height: 1;

    &:hover {
      color: var(--text);
      background: var(--raised);
    }
  }

  &__nav {
    flex: 1;
  }

  &__nav-label {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
    height: 40px;
    padding: 0 12px;
    border-radius: var(--radius);
    text-decoration: none;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    transition:
      background 0.15s,
      color 0.15s;

    &:hover {
      background: var(--raised);
      color: var(--text-2);
    }

    &--active,
    &--active:hover {
      background: var(--raised);
      color: var(--text);
    }
  }

  &__nav-marker {
    width: 6px;
    height: 6px;
    margin-left: auto;
    background: var(--accent);
    border-radius: 1px;
  }

  &__progress {
    border: 1px solid var(--line);
    border-radius: var(--radius-card);
    padding: 14px;
    margin: 8px 0;
  }

  &__progress-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;
  }

  &__progress-title {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
  }

  &__progress-pct {
    font-family: var(--font-mono);
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
    line-height: 1;
  }

  &__progress-grid {
    display: grid;
    gap: 3px;
    margin-bottom: 10px;
  }

  &__progress-cell {
    height: 14px;
    border-radius: 3px;
    background: var(--line-soft);
    transition: background 0.3s;

    &--filled {
      background: var(--accent);
    }
  }

  &__progress-label {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
    margin: 0;
  }

  &__lang-row {
    padding: 0 8px 4px;
  }

  &__lang {
    display: inline-flex;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 3px;
    gap: 2px;
  }

  &__lang-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-size: 11px;
    font-weight: 600;
    font-family: var(--font-mono);
    cursor: pointer;
    letter-spacing: 0.03em;
    transition:
      background 0.15s,
      color 0.15s;

    &:hover:not(&--active) {
      color: var(--text-2);
    }

    &--active {
      background: var(--line);
      color: var(--text);
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 8px;
    border-top: 1px solid var(--line-soft);
    margin-top: 4px;
  }

  &__avatar {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text);
  }

  &__user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__user-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__settings-btn {
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: var(--radius);
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      color 0.15s,
      background 0.15s;
    position: relative;

    &:hover {
      color: var(--text);
      background: var(--raised);
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
    border-right-color: var(--line);

    &--mobile-open {
      transform: translateX(0);
    }

    &__close-btn {
      display: flex;
    }
  }
}

.sidebar-menu {
  min-width: 220px;
  padding: 4px;

  &__item {
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    min-height: 38px;
    color: var(--text);

    &:hover {
      background: var(--raised);
    }

    :deep(.q-item__section--avatar) {
      min-width: 28px;
      padding-right: 4px;
      color: var(--text-2);
    }

    &--danger,
    &--danger :deep(.q-item__section--avatar) {
      color: var(--danger);
    }
  }

  &__item-label {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }

  &__item-sub {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
    margin-top: 1px;
  }

  &__sep {
    margin: 3px 4px;
  }
}
</style>
