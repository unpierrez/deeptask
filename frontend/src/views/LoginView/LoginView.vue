<script setup lang="ts">
import DtInput from "../../components/ui/DtInput/DtInput.vue"
import DtButton from "../../components/ui/DtButton/DtButton.vue"
import DtAlert from "../../components/ui/DtAlert/DtAlert.vue"
import { useI18n } from 'vue-i18n'
import { useLoginView } from "./useLoginView"

const { t } = useI18n()
const {
  email, password,
  emailError, passwordError,
  loading, error,
  showPassword, keepLoggedIn,
  handleLogin, handleGoogleLogin,
} = useLoginView()
</script>

<template>
  <div>
    <h1 class="page-title">{{ t('login.title') }}</h1>
    <p class="page-sub">{{ t('login.subtitle') }}</p>

    <DtAlert v-if="error" :message="error" type="error" class="alert-gap" />

    <!-- Social login -->
    <div class="social-row">
      <button type="button" class="social-btn" @click="handleGoogleLogin" :aria-label="'Continuar com Google'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continuar com Google</span>
      </button>
    </div>

    <!-- Divider -->
    <div class="divider" role="separator">
      <span class="divider__text">{{ t('login.orWithEmail') }}</span>
    </div>

    <!-- Form -->
    <q-form @submit.prevent="handleLogin" class="form">

      <!-- Email -->
      <div class="field-wrap">
        <label class="field-label" for="login-email">{{ t('common.email') }}</label>
        <DtInput
          id="login-email"
          v-model="email"
          type="email"
          :placeholder="t('common.placeholders.email')"
          autocomplete="email"
          icon="mail_outline"
          :error="emailError"
          aria-label="E-mail"
        />
      </div>

      <!-- Password -->
      <div class="field-wrap">
        <div class="field-header">
          <label class="field-label" for="login-password">{{ t('common.password') }}</label>
          <RouterLink to="/forgot-password" class="link-subtle" tabindex="0">
            {{ t('login.forgotPassword') }}
          </RouterLink>
        </div>
        <DtInput
          id="login-password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="t('common.placeholders.password')"
          autocomplete="current-password"
          icon="lock_outline"
          :error="passwordError"
          aria-label="Senha"
        >
          <template #append>
            <button
              type="button"
              class="eye-btn"
              :aria-pressed="showPassword"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showPassword = !showPassword"
            >
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" size="18px" />
            </button>
          </template>
        </DtInput>
      </div>

      <!-- Keep logged in -->
      <label class="keep-row">
        <input
          v-model="keepLoggedIn"
          type="checkbox"
          class="keep-check"
          aria-label="Lembrar de mim"
        />
        <span class="keep-label">{{ t('login.keepLoggedIn') }}</span>
      </label>

      <!-- Submit -->
      <DtButton
        :loading="loading"
        :label="loading ? t('login.submitting') : t('login.submit')"
        icon-right="arrow_forward"
      />
    </q-form>

    <!-- Footer -->
    <p class="redirect-text">
      {{ t('login.noAccount') }}
      <RouterLink to="/register" class="link-accent">{{ t('login.createAccount') }}</RouterLink>
    </p>

    <!-- Hidden container for GIS renderButton (fallback for FedCM-unavailable environments) -->
    <div id="g-signin-hidden" aria-hidden="true" style="position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:-999;width:220px;height:44px;overflow:visible;"></div>
  </div>
</template>

<style scoped lang="scss">
.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #141414;
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  line-height: 1.15;
}

.page-sub {
  font-size: 14.5px;
  color: #7a828d;
  margin: 0 0 26px;
  line-height: 1.5;
}

.alert-gap {
  margin-bottom: 16px;
}

/* ── Social buttons ── */
.social-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  border: 1px solid #e6e8eb;
  border-radius: 13px;
  background: #fff;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  color: #141414;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #f7f8f9;
    border-color: #d8dce1;
  }

  &:focus-visible {
    outline: 2px solid #141414;
    outline-offset: 2px;
  }
}

/* ── Divider ── */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ecedf0;
  }

  &__text {
    font-size: 12px;
    color: #aab0b8;
    white-space: nowrap;
    font-weight: 500;
  }
}

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #3a414c;
}

/* ── Keep me logged in ── */
.keep-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: -2px;
}

.keep-check {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1.5px solid #e6e8eb;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    border-color: #c4c9d0;
  }

  &:checked {
    background: #141414;
    border-color: #141414;

    &::after {
      content: '';
      display: block;
      width: 12px;
      height: 12px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M2 6l3 3 5-5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  &:focus-visible {
    outline: 2px solid #141414;
    outline-offset: 2px;
  }
}

.keep-label {
  font-size: 13.5px;
  font-weight: 500;
  color: #3a414c;
}

/* ── Eye button ── */
.eye-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9aa0a8;
  display: flex;
  align-items: center;
  transition: color 0.15s;
  line-height: 1;

  &:hover { color: #3a414c; }

  &:focus-visible {
    outline: 2px solid #141414;
    outline-offset: 2px;
    border-radius: 4px;
  }
}

/* ── Links ── */
.link-subtle {
  font-size: 12.5px;
  font-weight: 700;
  color: #7a828d;
  text-decoration: none;
  transition: color 0.15s;

  &:hover { color: #141414; }
}

.redirect-text {
  text-align: center;
  font-size: 0.875rem;
  color: #9aa0a8;
  margin-top: 22px;
}

.link-accent {
  color: #141414;
  text-decoration: underline;
  font-weight: 700;
  margin-left: 4px;
  text-underline-offset: 2px;
  transition: opacity 0.15s;

  &:hover { opacity: 0.7; }
}
</style>
