import { createI18n } from 'vue-i18n'
import ptBR from './locales/pt-BR'
import en from './locales/en'

const i18n = createI18n({
    legacy: false,
    locale: 'pt-BR',
    fallbackLocale: 'en',
    messages: {
        'pt-BR': ptBR,
        en,
    },
})

export default i18n
