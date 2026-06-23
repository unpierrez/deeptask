const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface ApiRequestOptions {
    method?: string
    body?: unknown
    token?: string
}

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, token } = options
    const headers = new Headers({ 'Content-Type': 'application/json' })

    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${API_URL}/${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        const message = data?.message || data?.error || response.statusText
        throw new Error(typeof message === 'string' ? message : 'Erro na requisição')
    }

    return data
}

export function apiGet<T>(path: string, token?: string) {
    return request<T>(path, { method: 'GET', token })
}

export function apiPost<T>(path: string, body?: unknown, token?: string) {
    return request<T>(path, { method: 'POST', body, token })
}

export function apiPatch<T>(path: string, body?: unknown, token?: string) {
    return request<T>(path, { method: 'PATCH', body, token })
}

export function apiDelete<T>(path: string, token?: string) {
    return request<T>(path, { method: 'DELETE', token })
}
