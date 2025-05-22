export const STATUSES = {
    IN_PROGRESS: 'in_progress',
    PLANNED: 'planned',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;

export type Status = typeof STATUSES[keyof typeof STATUSES];

export const STATUS_CONFIG: Record<Status, {
    text: string;
    color: string;
    bgColor: string;
}> = {
    [STATUSES.IN_PROGRESS]: {
        text: 'В процессе',
        color: '#D69E2E', // желтый (текст)
        bgColor: '#fffda5', // светло-желтый (фон)
    },
    [STATUSES.PLANNED]: {
        text: 'Запланировано',
        color: '#3182CE', // синий
        bgColor: '#EBF8FF', // светло-синий
    },
    [STATUSES.COMPLETED]: {
        text: 'Завершено',
        color: '#38A169', // зеленый
        bgColor: '#F0FFF4', // светло-зеленый
    },
    [STATUSES.CANCELLED]: {
        text: 'Отменено',
        color: '#E53E3E', // красный
        bgColor: '#FFF5F5', // светло-красный
    },
};
