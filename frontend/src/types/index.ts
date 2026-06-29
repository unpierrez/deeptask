export type Priority = 'alta' | 'media' | 'baixa'
export type NotificationType = 'due_soon' | 'high_priority' | 'completed' | 'achievement'
export type Locale = 'pt' | 'en'
export type TaskFilter = 'all' | 'active' | 'done'

export interface UserPreferences {
    accentColor: string
    locale: Locale
    notifications: {
        dueSoon: boolean
        highPriority: boolean
        completed: boolean
        achievement: boolean
    }
}

export interface User {
    id: string
    name: string
    email: string
    avatarColor: string
    accountType: string
    createdAt: string
    updatedAt: string
    preferences: UserPreferences | null
}

export interface Status {
    id: string
    userId: string
    title: string
    color: string
    isDone: boolean
    position: number
    createdAt: string
}

export interface Task {
    id: string
    statusId: string
    prevStatusId: string | null
    title: string
    description: string | null
    priority: Priority
    tags: string[]
    dueDate: string | null
    position: number
    createdAt: string
    updatedAt: string
    completedAt: string | null
}

export interface Notification {
    id: string
    type: NotificationType
    message: string
    relatedTaskId: string | null
    isRead: boolean
    createdAt: string
}

export interface ReportKpis {
    total: number
    doneCount: number
    openCount: number
    donePct: number
    highCount: number
}

export interface ReportByStatus {
    id: string
    title: string
    color: string
    count: number
}

export interface ReportByPriority {
    priority: Priority
    count: number
}

export interface ReportByTag {
    label: string
    count: number
}

export interface Report {
    kpis: ReportKpis
    byStatus: ReportByStatus[]
    byPriority: ReportByPriority[]
    byTag: ReportByTag[]
}
