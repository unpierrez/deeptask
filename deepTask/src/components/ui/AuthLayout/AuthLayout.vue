<script setup lang="ts">
import heroImg from '../../../assets/hero.png'
import logoImg from '../../../assets/logo.png'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'pt-BR', label: 'PT' },
  { code: 'en',    label: 'EN' },
]
</script>

<template>
  <div class="auth-layout">

    <!-- Left hero panel -->
    <div class="auth-left">
      <div class="auth-left__panel">
        <img :src="heroImg" class="auth-left__bg" alt="" />
        <div class="auth-left__overlay" />
        <div class="auth-left__brand">
          <div class="auth-left__logo-box">
            <img :src="logoImg" class="auth-left__logo-img" alt="" />
          </div>
          <span class="auth-left__brand-name">
            <span class="deep">Deep</span><span class="task">Task</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="auth-right">
      <!-- Language pill -->
      <div class="auth-right__lang" role="group" aria-label="Idioma">
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

      <!-- Mobile logo (shown only on small screens) -->
      <div class="auth-right__mobile-logo">
        <div class="auth-left__logo-box auth-left__logo-box--dark">
          <img :src="logoImg" class="auth-left__logo-img" alt="" />
        </div>
        <span class="auth-right__mobile-name">
          <span class="deep-dark">Deep</span><span class="task-dark">Task</span>
        </span>
      </div>

      <div class="auth-right__content">
        <slot />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100dvh;
  display: flex;
  background: #fff;
}

/* ── Left hero panel ── */
.auth-left {
  flex-shrink: 0;

  &__panel {
    position: relative;
    height: 100dvh;
    display: flex;
    background: #141414;
  }

  &__bg {
    display: block;
    height: 100%;
    width: auto;
    flex-shrink: 0;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.30) 0%,
      rgba(0, 0, 0, 0.05) 45%,
      rgba(0, 0, 0, 0.45) 100%
    );
  }

  &__brand {
    position: absolute;
    top: 28px;
    left: 28px;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__logo-box {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.10);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &--dark {
      background: #f4f5f6;
      border-color: #e6e8eb;
    }
  }

  &__logo-img {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }

  &__brand-name {
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.02em;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;

    .deep { color: #fff; }
    .task { color: rgba(255, 255, 255, 0.6); }
  }
}

/* ── Right form panel ── */
.auth-right {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  position: relative;
  z-index: 1;
  margin-left: -32px;
  border-radius: 26px 0 0 26px;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);

  &__lang {
    position: absolute;
    top: 20px;
    right: 24px;
    display: flex;
    border: 1px solid #e6e8eb;
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
  }

  &__mobile-logo {
    display: none;
    align-items: center;
    margin-bottom: 28px;
  }

  &__mobile-name {
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.02em;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;

    .deep-dark { color: #141414; }
    .task-dark { color: #9aa0a8; }
  }

  &__content {
    width: 100%;
    max-width: 392px;
  }
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
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
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
@media (max-width: 900px) {
  .auth-left {
    display: none;
  }

  .auth-right__mobile-logo {
    display: flex;
  }
}
</style>
