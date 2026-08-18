import { ref, computed } from 'vue';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useRouter } from 'vue-router';
import { registerSchema } from './registerSchema';
import type { RegisterForm } from './registerTypes';
import { register } from '../../lib/auth';

export function useRegisterView() {
  const router = useRouter();
  const loading = ref(false);
  const error = ref('');
  const success = ref(false);
  const showPassword = ref(false);
  const showConfirm = ref(false);

  const { handleSubmit } = useForm<RegisterForm>({
    validationSchema: toTypedSchema(registerSchema),
  });

  const { value: name, errorMessage: nameError } = useField<string>('name');
  const { value: email, errorMessage: emailError } = useField<string>('email');
  const { value: password, errorMessage: passwordError } =
    useField<string>('password');
  const { value: confirmPassword, errorMessage: confirmError } =
    useField<string>('confirmPassword');

  const strength = computed(() => {
    const pVal = password.value;
    if (!pVal) return 0;
    let sVal = 0;
    if (pVal.length >= 8) sVal++;
    if (/[A-Z]/.test(pVal)) sVal++;
    if (/[0-9]/.test(pVal)) sVal++;
    if (/[^A-Za-z0-9]/.test(pVal)) sVal++;
    return sVal;
  });

  const strengthLabel = computed(
    () => ['', 'Fraca', 'Razoável', 'Boa', 'Forte'][strength.value] ?? '',
  );
  const strengthColor = computed(
    () =>
      ['', '#ef4444', '#f97316', '#7c3aed', '#2e0287'][strength.value] ??
      '#2e0287',
  );

  const handleRegister = handleSubmit(async (values) => {
    loading.value = true;
    error.value = '';
    try {
      await register(values.name, values.email, values.password);
      success.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar conta.';
    } finally {
      loading.value = false;
    }
  });

  return {
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
  };
}
