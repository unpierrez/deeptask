import { ref } from 'vue'
import { apiGet } from '../lib/api'
import { getToken } from '../lib/auth'
import type { Report } from '../types'

const report = ref<Report | null>(null)
const loading = ref(false)

export function useReport() {
    async function fetchReport() {
        loading.value = true
        try {
            report.value = await apiGet<Report>('report', getToken() ?? undefined)
        } finally {
            loading.value = false
        }
    }

    return { report, loading, fetchReport }
}
