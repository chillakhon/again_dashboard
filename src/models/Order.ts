interface Client {
    id: number;
    full_name: string;
    email: string;
    phone: string;
}

interface DeliveryMethod {
    name: string;
    description: string;
    type: string | null;
}

interface Product {
    id: number;
    name: string;
    image: string | null;
}

interface OrderItem {
    id: number;
    product: Product;
}

class Order {
    // Статические константы статусов
    static STATUSES = {
        new: { value: 'new', label: 'Новый', color: 'red' },
        processing: { value: 'processing', label: 'В обработке', color: 'orange' },
        ready_to_ship: { value: 'ready_to_ship', label: 'Готов к отправке', color: 'blue' },
        assembling: { value: 'assembling', label: 'На сборке', color: '#FFD700' },
        shipped: { value: 'shipped', label: 'Отправка', color: '#4169E1' },
        in_transit: { value: 'in_transit', label: 'В пути', color: '#4debf1' },
        delivered: { value: 'delivered', label: 'Доставлен', color: '#32CD32' },
        received: { value: 'received', label: 'Получен', color: '#228B22' },
        cancelled: { value: 'cancelled', label: 'Отменён', color: '#B22222' },
        return_in_progress: { value: 'return_in_progress', label: 'В процессе возврата', color: '#FF69B4' },
        returned: { value: 'returned', label: 'Возвращён', color: '#A9A9A9' }
    };

    static PAYMENT_STATUSES = {
        pending: { value: 'pending', label: 'Ожидание' },
        paid: { value: 'paid', label: 'Оплачено' },
        refunded: { value: 'refunded', label: 'Возврат' },
        failed: { value: 'failed', label: 'Ошибка' },
        canceled: { value: 'canceled', label: 'Отменён' }
    };

    // Поля экземпляра
    id: number;
    order_number: string;
    client: Client;
    created_at: string;
    delivery_date: string | null;
    delivery_method: DeliveryMethod;
    delivery_target: string;
    delivery_target_id: number;
    discount_amount: string;
    is_paid: boolean;
    items: OrderItem[];
    items_count: number;
    payment_status: string;
    status: string;
    total_amount: string;

    constructor(orderData: Partial<Order>) {
        this.id = orderData.id || 0;
        this.order_number = orderData.order_number || "";
        this.client = orderData.client || {id: 0, full_name: "", email: "", phone: ""};
        this.created_at = orderData.created_at || "";
        this.delivery_date = orderData.delivery_date || null;
        this.delivery_method = orderData.delivery_method || {name: "", description: "", type: null};
        this.delivery_target = orderData.delivery_target || "";
        this.delivery_target_id = orderData.delivery_target_id || 0;
        this.discount_amount = orderData.discount_amount || "0.00 руб";
        this.is_paid = orderData.is_paid || false;
        this.items = orderData.items || [];
        this.items_count = orderData.items_count || 0;
        this.payment_status = orderData.payment_status || "pending";
        this.status = orderData.status || "new";
        this.total_amount = orderData.total_amount || "0.00 руб";
    }

    // Методы экземпляра
    getStatusInfo() {
        return Order.STATUSES[this.status as keyof typeof Order.STATUSES] ||
            { value: this.status, label: "Неизвестно", color: "#666" };
    }

    getPaymentStatusLabel(): string {
        return Order.PAYMENT_STATUSES[this.payment_status as keyof typeof Order.PAYMENT_STATUSES]?.label ||
            "Неизвестно";
    }

    // Статические методы
    static getAllStatuses() {
        return Object.values(Order.STATUSES);
    }

    static getAllPaymentStatuses() {
        return Object.values(Order.PAYMENT_STATUSES);
    }

    static isValidStatus(status: string): boolean {
        return status in Order.STATUSES;
    }

    static isValidPaymentStatus(status: string): boolean {
        return status in Order.PAYMENT_STATUSES;
    }

    static getStatusColor(status: string): string {
        return Order.STATUSES[status as keyof typeof Order.STATUSES]?.color || '#666';
    }
}

export default Order;