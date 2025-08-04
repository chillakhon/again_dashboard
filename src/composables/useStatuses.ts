export const orderStatuses = {
    new: {value: 'new', label: 'Новый', color: '#ef0000'},
    processing: {value: 'processing', label: 'В обработке', color: '#ffad00'},
    completed: {value: 'completed', label: 'В обработке', color: '#00ff21'},
    ready_to_ship: {value: 'ready_to_ship', label: 'Готов к отправке', color: '#0014fd'},
    assembling: {value: 'assembling', label: 'На сборке', color: '#FFD700'},
    shipped: {value: 'shipped', label: 'Отправка', color: '#4169E1'},
    in_transit: {value: 'in_transit', label: 'В пути', color: '#00c8cf'},
    delivered: {value: 'delivered', label: 'Доставлен', color: '#32CD32'},
    received: {value: 'received', label: 'Получен', color: '#228B22'},
    cancelled: {value: 'cancelled', label: 'Отменён', color: '#B22222'},
    return_in_progress: {value: 'return_in_progress', label: 'В процессе возврата', color: '#FF69B4'},
    returned: {value: 'returned', label: 'Возвращён', color: '#A9A9A9'},
} as const

export const paymentStatuses = {
    pending: {
        value: 'pending',
        label: 'Ожидает оплаты',
        // Tailwind gray-500
        color: '#6B7280',
    },
    paid: {
        value: 'paid',
        label: 'Оплачено',
        // Tailwind green-500
        color: '#10B981',
    },
    failed: {
        value: 'failed',
        label: 'Неудачная оплата',
        // Tailwind red-500
        color: '#EF4444',
    },
    refunded: {
        value: 'refunded',
        label: 'Возврат средств',
        // Tailwind orange-500
        color: '#F59E0B',
    },
} as const


type StatusObj = Record<string, { value: string; label: string; color: string }>

function buildLookup<T extends StatusObj>(dict: T): Record<string, T[keyof T]> {
    const arr = Object.values(dict) as T[keyof T][]
    const acc = arr.reduce((accumulator, s) => {
        accumulator[s.value] = s
        return accumulator
    }, {} as Record<string, T[keyof T]>)

    return acc
}


export function useStatuses() {
    // быстрый доступ по value
    const orderLookup = buildLookup(orderStatuses)
    const paymentLookup = buildLookup(paymentStatuses)

    // общий геттер: по типу ('order' | 'payment') и value
    function getLabel(type: 'order' | 'payment', value: string): string {
        const dict = type === 'order' ? orderLookup : paymentLookup
        return dict[value]?.label ?? value
    }

    function getColor(type: 'order' | 'payment', value: string): string {
        const dict = type === 'order' ? orderLookup : paymentLookup
        return dict[value]?.color ?? ''
    }

    function getStatus(type: 'order' | 'payment', value: string) {
        const dict = type === 'order' ? orderLookup : paymentLookup
        return dict[value]
    }

    function getStatuses(type: 'order' | 'payment') {
        const dict = type === 'order' ? orderStatuses : paymentStatuses
        return Object.values(dict)
    }


    return {
        // объекты целиком для перебора в селектах и списках
        orderStatuses,
        paymentStatuses,
        // утилиты
        getLabel,
        getColor,
        getStatus,
        getStatuses,
    }
}
