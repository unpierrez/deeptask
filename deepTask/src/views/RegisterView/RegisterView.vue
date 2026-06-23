<script setup lang="ts">
import DtInput from "../../components/ui/DtInput/DtInput.vue"
import DtButton from "../../components/ui/DtButton/DtButton.vue"
import DtAlert from "../../components/ui/DtAlert/DtAlert.vue"
import { useI18n } from 'vue-i18n'
import { useRegisterView } from './useRegisterView'

const { t } = useI18n()
const {
  name, email, password, confirmPassword,
  nameError, emailError, passwordError, confirmError,
  loading, error, success,
  showPassword, showConfirm,
  strength, strengthLabel, strengthColor,
  handleRegister,
} = useRegisterView()
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
        <RouterLink to="/login" class="btn-link">{{ t('register.success.goToLogin') }}</RouterLink>
      </div>
    </template>

    <template v-else>
      <h1 class="page-title">{{ t('register.title') }}</h1>
      <p class="page-sub">{{ t('register.subtitle') }}</p>

      <DtAlert v-if="error" :message="error" type="error" class="alert-gap" />

      <q-form @submit.prevent="handleRegister" class="form">

        <div class="field-wrap">
          <label class="field-label">{{ t('register.fullName') }}</label>
          <DtInput v-model="name" type="text" :placeholder="t('common.placeholders.fullName')" autocomplete="name" icon="person_outline" :error="nameError" />
        </div>

        <div class="field-wrap">
          <label class="field-label">{{ t('common.email') }}</label>
          <DtInput v-model="email" type="email" :placeholder="t('common.placeholders.email')" autocomplete="email" icon="mail_outline" :error="emailError" />
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
              <button type="button" class="eye-btn" :aria-pressed="showPassword"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showPassword = !showPassword">
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" size="18px" />
              </button>
            </template>
          </DtInput>
          <div v-if="password" class="strength-row">
            <div class="strength-bars">
              <div v-for="i in 4" :key="i" class="strength-bar"
                :style="{ background: i <= strength ? strengthColor : '#ecedf0' }" />
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
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
              <button type="button" class="eye-btn" :aria-pressed="showConfirm"
                :aria-label="showConfirm ? 'Ocultar senha' : 'Mostrar senha'"
                @click="showConfirm = !showConfirm">
                <q-icon :name="showConfirm ? 'visibility_off' : 'visibility'" size="18px" />
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
        <RouterLink to="/login" class="link-accent">{{ t('register.signIn') }}</RouterLink>
      </p>
    </template>
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

.field-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #3a414c;
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
  height: 3px;
  border-radius: 2px;
  flex: 1;
  transition: background 0.3s;
}
.strength-label {
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 52px;
  text-align: right;
  transition: color 0.3s;
}

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

/* Success */
.success-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f4f5f6;
  border: 1px solid #e6e8eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  :deep(.q-icon) { color: #141414; }
}
.btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 0 32px;
  height: 52px;
  background: #141414;
  border-radius: 13px;
  color: #fff;
  font-weight: 700;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;

  &:hover {
    background: #262626;
    transform: translateY(-1px);
  }
}
</style>
