<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader.vue'
import { fetchProfile, isAuthenticated } from '../lib/auth'
import { useTasks } from '../composables/useTasks'
import { useStatuses } from '../composables/useStatuses'
import { useNotifications } from '../composables/useNotifications'
import type { User } from '../types'

const router = useRouter()

if (!isAuthenticated()) {
    router.replace('/login')
}

const user = ref<User | null>(null)
const { tasks, searchQuery } = useTasks()
const { statuses } = useStatuses()
const { unreadCount, fetchNotifications } = useNotifications()

const tasksViewRef = ref<{ openNewTask: (statusId?: string) => void } | null>(null)

function handleNewTask() {
    if (router.currentRoute.value.path !== '/dashboard/tasks') {
        router.push('/dashboard/tasks')
    }
    setTimeout(() => tasksViewRef.value?.openNewTask(), 50)
}

onMounted(async () => {
    try {
        user.value = await fetchProfile()
    } catch {
        router.replace('/login')
        return
    }
    fetchNotifications()
})
</script>

<template>
    <div class="dashboard-layout">
        <AppSidebar
            :user="user"
            :tasks="tasks"
            :statuses="statuses"
        />

        <div class="dashboard-content">
            <AppHeader
                v-model:search="searchQuery"
                :unread-count="unreadCount"
                @new-task="handleNewTask"
            />

            <main class="dashboard-main">
                <RouterView :ref="(c: any) => tasksViewRef = c" />
            </main>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dashboard-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f5f6f8;
}

.dashboard-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
}

.dashboard-main {
    flex: 1;
    overflow-y: auto;
}
</style>
