import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useAppHeader() {
    const route = useRoute()
    const { t, locale } = useI18n()

    function todayLabel() {
        const now = new Date()
        return now.toLocaleDateString(locale.value, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        })
    }

    const screenConfig = computed(() => {
        if (route.path.startsWith('/dashboard/report')) {
            return {
                title: t('header.reportTitle'),
                subtitle: t('header.reportSubtitle'),
                showSearch: false,
            }
        }
        return {
            title: t('header.tasksTitle'),
            subtitle: todayLabel(),
            showSearch: true,
        }
    })

    return { t, screenConfig }
}
