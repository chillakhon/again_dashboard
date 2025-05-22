import {STATUS_CONFIG, Status} from '@/constants/statuses';
import {computed} from 'vue';

export function useStatus() {
    const getStatusConfig = (status: string) => {
        return STATUS_CONFIG[status as Status] || {
            text: status,
            color: '#6B7280', // Серый цвет по умолчанию
            bgColor: '#F3F4F6' // Светло-серый фон по умолчанию
        };
    };

    const statusClasses = (status: string) => {
        const config = getStatusConfig(status);
        return {
            color: config.color,
            backgroundColor: config.bgColor
        };
    };

    return {
        getStatusConfig,
        statusClasses
    };
}