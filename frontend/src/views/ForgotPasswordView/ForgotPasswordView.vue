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
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.15s;
  &:hover {
    color: var(--text);
  }
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
  margin: 0 0 28px;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.detail-note {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
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
