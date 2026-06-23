import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema } from './loginSchema'
import type { LoginForm } from './loginTypes'
import { login } from '../../lib/auth'

export function useLoginView() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)
    const keepLoggedIn = ref(false)

    const { handleSubmit } = useForm<LoginForm>({
        validationSchema: toTypedSchema(loginSchema),
    })

    const { value: email, errorMessage: emailError } = useField<string>('email')
    const { value: password, errorMessage: passwordError } = useField<string>('password')

    const handleLogin = handleSubmit(async (values) => {
        loading.value = true
        error.value = ''
        try {
            await login(values.email, values.password, keepLoggedIn.value)
            router.push('/dashboard')
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erro ao fazer login.'
        } finally {
            loading.value = false
        }
    })

    async function handleGoogleLogin() {
        console.log('Login com Google')
    }

    async function handleGithubLogin() {
        console.log('Login com GitHub')
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
    }
}
