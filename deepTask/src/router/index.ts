import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import LoginView from '../views/LoginView/LoginView.vue'
import RegisterView from '../views/RegisterView/RegisterView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView/ForgotPasswordView.vue'
import { isAuthenticated } from '../lib/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/',
            component: AuthView,
            children: [
                { path: 'login', name: 'login', component: LoginView },
                { path: 'register', name: 'register', component: RegisterView },
                { path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView },
            ],
        },
        {
            path: '/dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: { requiresAuth: true },
            redirect: '/dashboard/tasks',
            children: [
                {
                    path: 'tasks',
                    name: 'tasks',
                    component: () => import('../views/TasksView/TasksView.vue'),
                },
                {
                    path: 'report',
                    name: 'report',
                    component: () => import('../views/ReportView/ReportView.vue'),
                },
            ],
        },
    ],
})

router.beforeEach(async (to) => {
    const isAuth = isAuthenticated()
    if (to.meta.requiresAuth && !isAuth) return '/login'
    if (!to.meta.requiresAuth && isAuth && to.path === '/login') return '/dashboard'
})

export default router
