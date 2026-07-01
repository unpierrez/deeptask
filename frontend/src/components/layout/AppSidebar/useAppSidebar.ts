import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { logout } from '../../../lib/auth'
import { useViewPreference } from '../../../composables/useViewPreference'
import type { User, Task, Status } from '../../../types'

interface AppSidebarProps {
    user: User | null
    tasks: Task[]
    statuses: Status[]
    mobileOpen?: boolean
}

export function useAppSidebar(props: AppSidebarProps, emit: (e: 'close') => void) {
    const router = useRouter()
    const route = useRoute()
    const $q = useQuasar()
    const { t, locale } = useI18n()
    const { viewMode, saveAsDefault } = useViewPreference()

    const langs = [{ code: 'pt-BR', label: 'PT' }, { code: 'en', label: 'EN' }]

    const doneStatusIds = computed(() => new Set(props.statuses.filter((s) => s.isDone).map((s) => s.id)))
    const total = computed(() => props.tasks.length)
    const doneCount = computed(() => props.tasks.filter((t) => doneStatusIds.value.has(t.statusId)).length)
    const donePct = computed(() => total.value > 0 ? Math.round((doneCount.value / total.value) * 100) : 0)

    const initials = computed(() => {
        if (!props.user?.name) return '?'
        return props.user.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('')
    })

    const navItems = computed(() => [
        { name: 'tasks', label: t('nav.tasks'), icon: 'checklist', path: '/dashboard/tasks' },
        { name: 'report', label: t('nav.report'), icon: 'bar_chart', path: '/dashboard/report' },
    ])

    function isActive(path: string) {
        return route.path.startsWith(path)
    }

    watch(() => route.path, () => {
        emit('close')
    })

    function handleSaveDefault() {
        saveAsDefault()
        const mode = viewMode.value === 'kanban' ? 'Kanban' : locale.value === 'en' ? 'List' : 'Lista'
        $q.notify({
            message: `${t('tasks.saveDefaultView')}: ${mode}`,
            icon: 'check_circle',
            color: 'dark',
            timeout: 2200,
            position: 'bottom',
        })
    }

    function handleLogout() {
        logout()
        router.replace('/login')
    }

    return {
        t, locale, langs,
        navItems, doneCount, total, donePct, initials,
        viewMode, isActive, handleSaveDefault, handleLogout,
    }
}
