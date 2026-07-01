<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/layout/AppSidebar/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader/AppHeader.vue'
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
const sidebarOpen = ref(false)
const { tasks, searchQuery } = useTasks()
const { statuses } = useStatuses()
const { unreadCount, fetchNotifications } = useNotifications()

const tasksViewRef = ref<{ openNewTask: (statusId?: string) => void } | null>(null)

async function handleNewTask() {
    sidebarOpen.value = false
    if (router.currentRoute.value.path !== '/dashboard/tasks') {
        await router.push('/dashboard/tasks')
    }
    await nextTick()
    tasksViewRef.value?.openNewTask()
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
        <Transition name="backdrop">
            <div
                v-if="sidebarOpen"
                class="mobile-backdrop"
                @click="sidebarOpen = false"
            />
        </Transition>

        <AppSidebar
            :user="user"
            :tasks="tasks"
            :statuses="statuses"
            :mobile-open="sidebarOpen"
            @close="sidebarOpen = false"
        />

        <div class="dashboard-content">
            <AppHeader
                v-model:search="searchQuery"
                :unread-count="unreadCount"
                @new-task="handleNewTask"
                @toggle-menu="sidebarOpen = !sidebarOpen"
            />

            <main class="dashboard-main">
                <RouterView v-slot="{ Component }">
                    <component :is="Component" :ref="(c: any) => (tasksViewRef = c)" />
                </RouterView>
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
    -webkit-overflow-scrolling: touch;
}

.mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 99;
}

.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.2s;
}
.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}
</style>
