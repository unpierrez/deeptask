<script setup lang="ts">
import DtLogo from '../DtLogo/DtLogo.vue';
import { useAuthLayout } from './useAuthLayout';

withDefaults(
  defineProps<{
    hideBrand?: boolean;
  }>(),
  {
    hideBrand: false,
  },
);

const { locale, languages } = useAuthLayout();
</script>

<template>
  <div class="auth-layout">
    <!-- Language pill -->
    <div class="auth-layout__lang" role="group" aria-label="Idioma">
      <button
        v-for="lang in languages"
        :key="lang.code"
        class="lang-btn"
        :class="{ 'lang-btn--active': locale === lang.code }"
        @click="locale = lang.code"
      >
        {{ lang.label }}
      </button>
    </div>

    <div class="auth-layout__center">
      <!-- Brand -->
      <div v-if="!hideBrand" class="auth-layout__brand">
        <DtLogo :height="40" />
        <span class="auth-layout__brand-name">
          <span class="deep">Deep</span><span class="task">Task</span>
        </span>
      </div>

      <!-- Form card -->
      <div class="auth-layout__card">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 32px 24px;
}

.auth-layout__lang {
  position: fixed;
  top: 20px;
  right: 24px;
  display: flex;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  background: #fff;
  z-index: 2;
}

.auth-layout__center {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Brand ── */
.auth-layout__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.auth-layout__brand-name {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;

  .deep {
    color: #141414;
  }
  .task {
    color: #9aa0a8;
  }
}

/* ── Form card ── */
.auth-layout__card {
  width: 100%;
  background: #fff;
  border: 1px solid #e6e8eb;
  border-radius: 24px;
  box-shadow:
    0 20px 48px -12px rgba(20, 20, 20, 0.14),
    0 4px 16px rgba(20, 20, 20, 0.04);
  padding: 40px 36px;
}

/* ── Language pill buttons ── */
.lang-btn {
  padding: 5px 12px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: #9aa0a8;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.03em;

  &:hover:not(.lang-btn--active) {
    color: #3a414c;
  }

  &--active {
    background: #141414;
    color: #fff;
  }
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .auth-layout {
    padding: 24px 16px;
  }

  .auth-layout__lang {
    top: 12px;
    right: 12px;
  }

  .auth-layout__card {
    border-radius: 18px;
    padding: 32px 20px;
  }
}
</style>
