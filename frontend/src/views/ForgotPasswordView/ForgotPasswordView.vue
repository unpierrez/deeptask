<script setup lang="ts">
import DtInput from '../../components/ui/DtInput/DtInput.vue';
import DtButton from '../../components/ui/DtButton/DtButton.vue';
import DtAlert from '../../components/ui/DtAlert/DtAlert.vue';
import { useI18n } from 'vue-i18n';
import { useForgotPasswordView } from './useForgotPasswordView';

const { t } = useI18n();
const { email, emailError, loading, error, success, handleReset } =
  useForgotPasswordView();
</script>

<template>
  <div>
    <!-- Sucesso -->
    <template v-if="success">
      <div class="success-wrap">
        <div class="success-icon">
          <q-icon name="mail_outline" size="28px" />
        </div>
        <h2 class="page-title">{{ t('forgotPassword.success.title') }}</h2>
        <p class="page-sub">
          {{ t('forgotPassword.success.message', { email }) }}
        </p>
        <p class="detail-note">{{ t('forgotPassword.success.expiry') }}</p>
        <RouterLink to="/login" class="btn-link">{{
          t('forgotPassword.success.backToLogin')
        }}</RouterLink>
      </div>
    </template>

    <template v-else>
      <RouterLink to="/login" class="back-link">
        <q-icon name="arrow_back" size="15px" />
        {{ t('common.back') }}
      </RouterLink>

      <h1 class="page-title">{{ t('forgotPassword.title') }}</h1>
      <p class="page-sub">{{ t('forgotPassword.subtitle') }}</p>

      <DtAlert v-if="error" :message="error" type="error" />

      <q-form class="form" @submit.prevent="handleReset">
        <DtInput
          v-model="email"
          :label="t('common.email')"
          type="email"
          autocomplete="email"
          icon="mail_outline"
          :error="emailError"
        />
        <DtButton
          :loading="loading"
          :label="
            loading
              ? t('forgotPassword.submitting')
              : t('forgotPassword.submit')
          "
          icon-right="chevron_right"
        />
      </q-form>
    </template>
  </div>
</template>

<style scoped lang="scss">
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.15s;
  &:hover {
    color: #111827;
  }
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.025em;
  margin: 0 0 6px;
}
.page-sub {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 28px;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  :deep(.q-icon) {
    color: #374151;
  }
}
.email-highlight {
  color: #0f0f0f;
  font-weight: 600;
  font-style: normal;
}
.detail-note {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-top: 4px;
}
.btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 13px 32px;
  background: #0f0f0f;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: #262626;
  }
}
</style>
