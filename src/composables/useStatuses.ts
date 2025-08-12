export const orderStatuses = {
    new: { value: 'new', label: 'Новый', color: '#ef0000' },
    processing: { value: 'processing', label: 'В обработке', color: '#ffad00' },
    approved: { value: 'approved', label: 'Согласован', color: '#00ba13' },
    shipped: { value: 'shipped', label: 'Отгружен', color: '#4169E1' },
    completed: { value: 'completed', label: 'Доставлен', color: '#02d8d8' },
    return_in_progress: { value: 'return_in_progress', label: 'В процессе возврата', color: '#FF69B4' },
    cancelled: { value: 'cancelled', label: 'Отменён', color: '#B22222' },
    returned: { value: 'returned', label: 'Возврат', color: '#A9A9A9' },
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



export const contactRequestStatuses = {
    new: { value: 'new', label: 'Новая', color: '#ff3d3d' },
    viewed: { value: 'viewed', label: 'Просмотрена', color: '#ffb126' },
    processed: { value: 'processed', label: 'Обработана', color: '#00ba15' },
} as const;




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
    const orderLookup = buildLookup(orderStatuses);
    const paymentLookup = buildLookup(paymentStatuses);
    const contactRequestLookup = buildLookup(contactRequestStatuses);

    // общий геттер: по типу ('order' | 'payment' | 'contactRequest') и value
    function getLabel(type: 'order' | 'payment' | 'contactRequest', value: string): string {
        let dict;
        if (type === 'order') dict = orderLookup;
        else if (type === 'payment') dict = paymentLookup;
        else dict = contactRequestLookup;

        return dict[value]?.label ?? value;
    }

    function getColor(type: 'order' | 'payment' | 'contactRequest', value: string): string {
        let dict;
        if (type === 'order') dict = orderLookup;
        else if (type === 'payment') dict = paymentLookup;
        else dict = contactRequestLookup;

        return dict[value]?.color ?? '';
    }

    function getStatus(type: 'order' | 'payment' | 'contactRequest', value: string) {
        let dict;
        if (type === 'order') dict = orderLookup;
        else if (type === 'payment') dict = paymentLookup;
        else dict = contactRequestLookup;

        return dict[value];
    }

    function getStatuses(type: 'order' | 'payment' | 'contactRequest') {
        if (type === 'order') return Object.values(orderStatuses);
        else if (type === 'payment') return Object.values(paymentStatuses);
        else return Object.values(contactRequestStatuses);
    }

    return {
        orderStatuses,
        paymentStatuses,
        contactRequestStatuses,
        getLabel,
        getColor,
        getStatus,
        getStatuses,
    };
}

