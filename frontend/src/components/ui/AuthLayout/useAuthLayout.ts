import { useI18n } from 'vue-i18n'

export function useAuthLayout() {
    const { locale } = useI18n()

    const languages = [
        { code: 'pt-BR', label: 'PT' },
        { code: 'en', label: 'EN' },
    ]

    return { locale, languages }
}
