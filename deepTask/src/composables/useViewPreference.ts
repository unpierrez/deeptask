import { ref } from 'vue'

export type ViewMode = 'list' | 'kanban'

const STORAGE_KEY = 'deepTask_viewMode'

const viewMode = ref<ViewMode>((localStorage.getItem(STORAGE_KEY) as ViewMode) ?? 'list')

export function useViewPreference() {
    function setViewMode(mode: ViewMode) {
        viewMode.value = mode
        localStorage.setItem(STORAGE_KEY, mode)
    }

    function saveAsDefault() {
        localStorage.setItem(STORAGE_KEY, viewMode.value)
    }

    return { viewMode, setViewMode, saveAsDefault }
}
