import { ref } from "vue"
import { useForm, useField } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { forgotPasswordSchema } from "./forgotPasswordSchema"
import type { ForgotPasswordForm } from "./forgotPasswordTypes"

export function useForgotPasswordView() {
  const loading = ref(false)
  const error = ref("")
  const success = ref(false)

  const { handleSubmit } = useForm<ForgotPasswordForm>({
    validationSchema: toTypedSchema(forgotPasswordSchema),
  })

  const { value: email, errorMessage: emailError } = useField<string>("email")

  const handleReset = handleSubmit(async (values) => {
    loading.value = true
    error.value = ""
    try {
      // const { error: authError } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo: `${window.location.origin}/reset-password` })
      // if (authError) throw authError
      console.log('Recuperar:', values.email)
      success.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erro ao enviar e-mail."
    } finally {
      loading.value = false
    }
  })

  return {
    email,
    emailError,
    loading,
    error,
    success,
    handleReset
  }
}
