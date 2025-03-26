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

    getStatusInfo() {
        const statuses: Record<string, { label: string; color: string }> = {
            new: {label: "Новый", color: "blue"},
            processing: {label: "В обработке", color: "orange"},
            shipped: {label: "Отправлен", color: "green"},
            delivered: {label: "Доставлен", color: "darkgreen"},
            cancelled: {label: "Отменён", color: "red"},
            returned: {label: "Возвращён", color: "purple"},
            refunded: {label: "Возвращены деньги", color: "gray"}
        };

        return statuses[this.status] || {label: "Неизвестно", color: "#666"};
    }


    getPaymentStatusLabel(): string {
        const statuses: Record<string, string> = {
            pending: "Ожидание", // Платёж ожидается
            paid: "Оплачено", // Платёж прошёл
            refunded: "Возврат", // Деньги возвращены
            failed: "Ошибка", // Ошибка платежа
            canceled: "Отменён" // Платёж отменён
        };

        return statuses[this.payment_status] || "Неизвестно";
    }

}


export default Order;