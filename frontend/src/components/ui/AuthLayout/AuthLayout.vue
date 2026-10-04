<script setup lang="ts">
import DtBrand from '../DtBrand/DtBrand.vue';
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
        <DtBrand />
      </div>

      <!-- Form -->
      <div class="auth-layout__content">
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
  background: var(--bg);
  padding: 32px 24px;
}

.auth-layout__lang {
  position: fixed;
  top: 20px;
  right: 24px;
  display: flex;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 3px;
  gap: 2px;
  background: var(--bg);
  z-index: 2;
}

.auth-layout__center {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
}

/* ── Brand ── */
.auth-layout__brand {
  display: flex;
  margin-bottom: 32px;
}

.auth-layout__content {
  width: 100%;
}

/* ── Language pill buttons ── */
.lang-btn {
  padding: 5px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  letter-spacing: 0.03em;

  &:hover:not(.lang-btn--active) {
    color: var(--text-2);
  }

  &--active {
    background: var(--line);
    color: var(--text);
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
}
</style>
