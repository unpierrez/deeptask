import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { loginSchema } from './loginSchema';
import type { LoginForm } from './loginTypes';
import { login, loginWithGoogle } from '../../lib/auth';

const REMEMBER_KEY = 'deepTask_remember';

function loadSavedCredentials(): { email: string; password: string } | null {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useLoginView() {
  const router = useRouter();
  const loading = ref(false);
  const error = ref('');
  const showPassword = ref(false);

  const saved = loadSavedCredentials();
  const keepLoggedIn = ref(Boolean(saved));

  const { handleSubmit } = useForm<LoginForm>({
    validationSchema: toTypedSchema(loginSchema),
    initialValues: saved
      ? { email: saved.email, password: saved.password }
      : undefined,
  });

  const { value: email, errorMessage: emailError } = useField<string>('email');
  const { value: password, errorMessage: passwordError } =
    useField<string>('password');

  // Holds the resolve function for the current Google sign-in attempt
  let resolveGoogleCredential: ((credential: string) => void) | null = null;

  onMounted(() => {
    // Poll until GIS script is loaded, then render the hidden button
    const initGis = () => {
      if (!window.google?.accounts?.id) {
        requestAnimationFrame(initGis);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: ({ credential }) => {
          resolveGoogleCredential?.(credential);
          resolveGoogleCredential = null;
        },
      });
      const container = document.getElementById('g-signin-hidden');
      if (container) {
        window.google.accounts.id.renderButton(container, {
          type: 'standard',
          size: 'large',
        });
      }
    };
    initGis();
  });

  const handleLogin = handleSubmit(async (values) => {
    loading.value = true;
    error.value = '';
    try {
      if (keepLoggedIn.value) {
        localStorage.setItem(
          REMEMBER_KEY,
          JSON.stringify({ email: values.email, password: values.password }),
        );
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao fazer login.';
    } finally {
      loading.value = false;
    }
  });

  async function handleGoogleLogin() {
    loading.value = true;
    error.value = '';
    try {
      const credential = await new Promise<string>((resolve, reject) => {
        const btn = document.querySelector<HTMLElement>(
          '#g-signin-hidden div[role=button]',
        );
        if (!btn) {
          reject(
            new Error(
              'Google Sign-In não está disponível. Recarregue a página.',
            ),
          );
          return;
        }

        resolveGoogleCredential = resolve;

        // Detect popup closed without completing sign-in
        const onWindowFocus = () => {
          window.removeEventListener('focus', onWindowFocus);
          // Give GIS 600ms to call the callback before treating as cancelled
          setTimeout(() => {
            if (resolveGoogleCredential) {
              resolveGoogleCredential = null;
              reject(new Error('Login com Google cancelado.'));
            }
          }, 600);
        };
        window.addEventListener('focus', onWindowFocus);

        // Synchronous click — within the same user-gesture stack, browsers won't block the popup
        btn.click();
      });

      await loginWithGoogle(credential);
      router.push('/dashboard');
    } catch (err) {
      if (
        err instanceof Error &&
        err.message !== 'Login com Google cancelado.'
      ) {
        error.value = err.message;
      } else if (!(err instanceof Error)) {
        error.value = 'Erro ao fazer login com Google.';
      }
    } finally {
      loading.value = false;
    }
  }

  async function handleGithubLogin() {
    console.log('Login com GitHub');
  }

  return {
    email,
    password,
    emailError,
    passwordError,
    loading,
    error,
    showPassword,
    keepLoggedIn,
    handleLogin,
    handleGoogleLogin,
    handleGithubLogin,
  };
}
