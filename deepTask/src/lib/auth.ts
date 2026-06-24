import { apiGet, apiPost, setTokenRefresher, API_URL } from './api'
import type { User } from '../types'

export interface AuthStorage {
    accessToken: string
    refreshToken: string
    user: User | null
}

const STORAGE_KEY = 'deepTask_auth'

let authState: AuthStorage | null = loadAuthState()

function loadAuthState(): AuthStorage | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as AuthStorage
    } catch {
        return null
    }
}

function persistAuthState(state: AuthStorage | null, persist = true) {
    authState = state
    if (state && persist) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } else if (!state) {
        localStorage.removeItem(STORAGE_KEY)
    }
}

export function getToken(): string | null {
    return authState?.accessToken ?? null
}

export function getCurrentUser(): User | null {
    return authState?.user ?? null
}

export function isAuthenticated(): boolean {
    return Boolean(authState?.accessToken)
}

export async function login(email: string, password: string) {
    const data = await apiPost<{ accessToken: string; refreshToken: string }>('auth/signin', {
        email,
        password,
    })

    persistAuthState({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: null })
}

export async function register(name: string, email: string, password: string) {
    await apiPost<{ accessToken: string; refreshToken: string }>('auth/signup', {
        name,
        email,
        password,
    })
}

export async function fetchProfile(): Promise<User> {
    if (!authState?.accessToken) {
        throw new Error('Usuário não autenticado')
    }

    const profile = await apiGet<User>('me', authState.accessToken)
    persistAuthState(
        { ...authState, user: profile },
        Boolean(localStorage.getItem(STORAGE_KEY)),
    )
    return profile
}

export function logout() {
    persistAuthState(null)
}

export async function loginWithGoogle(credential: string) {
    const data = await apiPost<{ accessToken: string; refreshToken: string }>(
        'auth/google',
        { credential },
    )
    persistAuthState({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: null })
}

async function refreshTokens(): Promise<string | null> {
    if (!authState?.refreshToken) return null

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: authState.refreshToken }),
        })

        if (!response.ok) {
            persistAuthState(null)
            return null
        }

        const data: { accessToken: string; refreshToken: string } = await response.json()
        const shouldPersist = Boolean(localStorage.getItem(STORAGE_KEY))
        persistAuthState(
            { accessToken: data.accessToken, refreshToken: data.refreshToken, user: authState.user },
            shouldPersist,
        )
        return data.accessToken
    } catch {
        return null
    }
}

setTokenRefresher(refreshTokens)
