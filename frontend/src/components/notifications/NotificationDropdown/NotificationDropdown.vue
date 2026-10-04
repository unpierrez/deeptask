<script setup lang="ts">
import { useNotificationDropdown } from './useNotificationDropdown';

defineProps<{ unreadCount: number }>();

const {
  t,
  notifications,
  markAllRead,
  open,
  iconMap,
  relativeTime,
  handleMarkRead,
  toggle,
  close,
} = useNotificationDropdown();
</script>

<template>
  <div v-click-outside="close" class="notif">
    <button
      class="notif__bell"
      :class="{ 'notif__bell--active': open }"
      @click="toggle"
    >
      <q-icon name="notifications" size="20px" />
      <span v-if="unreadCount > 0" class="notif__badge">{{ unreadCount }}</span>
    </button>

    <Transition name="dropdown">
      <div v-if="open" class="notif__dropdown">
        <div class="notif__header">
          <span class="notif__header-title">{{
            t('notifications.title')
          }}</span>
          <button
            v-if="unreadCount > 0"
            class="notif__mark-all"
            @click="markAllRead"
          >
            {{ t('notifications.markAll') }}
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
            {{ t('notifications.empty') }}
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
    border-radius: var(--radius);
    border: 1px solid var(--line);
    background: transparent;
    color: var(--text-2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s;

    &:hover,
    &--active {
      background: var(--raised);
      border-color: var(--line-strong);
      color: var(--text);
    }
  }

  &__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 5px;
    background: var(--accent);
    color: var(--on-accent);
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg);
    line-height: 1;
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 340px;
    max-width: calc(100vw - 24px);
    background: var(--surface);
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-modal);
    z-index: 100;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding: 0 16px;
    border-bottom: 1px solid var(--line);
  }

  &__header-title {
    font-family: var(--font-mono);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text);
  }

  &__mark-all {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--accent);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
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
    border-bottom: 1px solid var(--line-soft);
    cursor: pointer;
    transition: background 0.12s;

    &:last-of-type {
      border-bottom: none;
    }

    &:hover {
      background: var(--raised);
    }

    &--unread .notif__message {
      color: var(--text);
    }
  }

  &__icon {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 6px;
    border: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__message {
    font-size: 13px;
    color: var(--text-2);
    margin: 0 0 3px;
    line-height: 1.4;
  }

  &__time {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--muted);
  }

  &__dot {
    width: 6px;
    height: 6px;
    min-width: 6px;
    border-radius: 1px;
    background: var(--accent);
    margin-top: 6px;
  }

  &__empty {
    padding: 24px 16px;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--muted);
  }
}

@media (max-width: 768px) {
  .notif__bell {
    width: 40px;
    height: 40px;
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
