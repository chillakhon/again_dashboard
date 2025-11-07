export const ECHO_CHANNELS = {
    ADMIN_NOTIFICATIONS: 'admin.notifications',
    PRESENCE_USERS: 'presence.users'
} as const

export const ECHO_EVENTS = {
    CONVERSATION_UPDATED: '.ConversationUpdated',
} as const

// Типы для типизации
export type EchoChannel = typeof ECHO_CHANNELS[keyof typeof ECHO_CHANNELS]
export type EchoEvent = typeof ECHO_EVENTS[keyof typeof ECHO_EVENTS]