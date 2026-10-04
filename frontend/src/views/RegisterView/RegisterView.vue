<script setup lang="ts">
import DtInput from '../../components/ui/DtInput/DtInput.vue';
import DtButton from '../../components/ui/DtButton/DtButton.vue';
import DtAlert from '../../components/ui/DtAlert/DtAlert.vue';
import DtBrand from '../../components/ui/DtBrand/DtBrand.vue';
import { useI18n } from 'vue-i18n';
import { useRegisterView } from './useRegisterView';

const { t } = useI18n();
const {
  name,
  email,
  password,
  confirmPassword,
  nameError,
  emailError,
  passwordError,
  confirmError,
  loading,
  error,
  success,
  showPassword,
  showConfirm,
  strength,
  strengthLabel,
  strengthColor,
  handleRegister,
} = useRegisterView();
</script>

<template>
  <div>
    <!-- Success state -->
    <template v-if="success">
      <div class="success-wrap">
        <div class="success-icon">
          <q-icon name="check" size="28px" />
        </div>
        <h2 class="page-title">{{ t('register.success.title') }}</h2>
        <p class="page-sub">{{ t('register.success.message') }}</p>
        <RouterLink to="/login" class="btn-link">{{
          t('register.success.goToLogin')
        }}</RouterLink>
      </div>
    </template>

    <template v-else>
      <div class="register-brand">
        <DtBrand />
      </div>

      <h1 class="page-title">{{ t('register.title') }}</h1>
      <p class="page-sub">{{ t('register.subtitle') }}</p>

      <DtAlert v-if="error" :message="error" type="error" class="alert-gap" />

      <q-form class="form" @submit.prevent="handleRegister">
        <div class="field-wrap">
          <label class="field-label">{{ t('register.fullName') }}</label>
          <DtInput
            v-model="name"
            type="text"
            :placeholder="t('common.placeholders.fullName')"
            autocomplete="name"
            icon="person_outline"
            :error="nameError"
          />
        </div>

        <div class="field-wrap">
          <label class="field-label">{{ t('common.email') }}</label>
          <DtInput
            v-model="email"
            type="email"
            :placeholder="t('common.placeholders.email')"
            autocomplete="email"
            icon="mail_outline"
            :error="emailError"
          />
        </div>

        <div class="field-wrap">
          <label class="field-label">{{ t('common.password') }}</label>
          <DtInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('common.placeholders.password')"
            autocomplete="new-password"
            icon="lock_outline"
            :error="passwordError"
          >
            <template #append>
              <button
                type="button"
                class="eye-btn"
                :aria-pressed="showPassword"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showPassword = !showPassword"
              >
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  size="18px"
                />
              </button>
            </template>
          </DtInput>
          <div v-if="password" class="strength-row">
            <div class="strength-bars">
              <div
                v-for="i in 4"
                :key="i"
                class="strength-bar"
                :style="{
                  background: i <= strength ? strengthColor : 'var(--line)',
                }"
              />
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{
              strengthLabel
            }}</span>
          </div>
        </div>

        <div class="field-wrap">
          <label class="field-label">{{ t('register.confirmPassword') }}</label>
          <DtInput
            v-model="confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            :placeholder="t('common.placeholders.confirmPassword')"
            autocomplete="new-password"
            icon="lock_outline"
            :error="confirmError"
          >
            <template #append>
              <button
                type="button"
                class="eye-btn"
                :aria-pressed="showConfirm"
                :aria-label="showConfirm ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showConfirm = !showConfirm"
              >
                <q-icon
                  :name="showConfirm ? 'visibility_off' : 'visibility'"
                  size="18px"
                />
              </button>
            </template>
          </DtInput>
        </div>

        <DtButton
          :loading="loading"
          :label="loading ? t('register.submitting') : t('register.submit')"
          icon-right="arrow_forward"
        />
      </q-form>

      <p class="redirect-text">
        {{ t('register.hasAccount') }}
        <RouterLink to="/login" class="link-accent">{{
          t('register.signIn')
        }}</RouterLink>
      </p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.register-brand {
  display: flex;
  margin-bottom: 32px;
}

.page-title {
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0 0 8px;
}

.page-sub {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
  margin: 0 0 28px;
}

.alert-gap {
  margin-bottom: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-2);
}

.strength-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
  margin-top: 2px;
}
.strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}
.strength-bar {
  height: 4px;
  border-radius: 2px;
  flex: 1;
  transition: background 0.3s;
}
.strength-label {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 500;
  min-width: 64px;
  text-align: right;
  transition: color 0.3s;
}

.eye-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--muted);
  display: flex;
  align-items: center;
  transition: color 0.15s;
  line-height: 1;
  border-radius: 4px;

  &:hover {
    color: var(--text-2);
  }
}

.redirect-text {
  font-size: 13.5px;
  color: var(--muted);
  margin-top: 24px;
}

.link-accent {
  color: var(--text);
  text-decoration: underline;
  font-weight: 500;
  margin-left: 4px;
  text-underline-offset: 3px;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.8;
  }
}

/* Success */
.success-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.success-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-card);
  border: 1px solid var(--line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  :deep(.q-icon) {
    color: var(--accent);
  }
}
.btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding: 0 24px;
  height: 44px;
  background: var(--primary-bg);
  border-radius: var(--radius);
  color: var(--primary-fg);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }
}
</style>
