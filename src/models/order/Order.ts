import {Client} from "@/models/client/Client";
import {Product} from "@/models/Product";

interface DeliveryMethod {
    name: string;
    description: string;
    type: string | null;
}


interface OrderItem {
    id: number;
    product: Product;
}

export default class Order {
    id: number | undefined;
    final_amount: number | undefined;
    order_number: string | undefined;
    client: Client | undefined;
    created_at: string | undefined;
    delivery_date: string | null | undefined;
    delivery_method: DeliveryMethod | undefined;
    delivery_target: string | undefined;
    delivery_target_id: number | undefined;
    discount_amount: string | undefined;
    total_amount_original: string | undefined;
    total_promo_discount: string | undefined;
    total_items_discount: string | undefined;
    is_paid: boolean | undefined;
    items: OrderItem[] | undefined;
    items_count: number | undefined;
    payment_status: string | undefined;
    status: string | undefined;
    total_amount: string | undefined;
    notes: string | undefined;

    constructor() {
        this.id = undefined;
        this.final_amount = undefined;
        this.order_number = undefined;
        this.client = undefined;
        this.created_at = undefined;
        this.delivery_date = undefined;
        this.delivery_method = undefined;
        this.delivery_target = undefined;
        this.delivery_target_id = undefined;
        this.discount_amount = undefined;
        this.total_amount_original = undefined;
        this.total_promo_discount = undefined;
        this.total_items_discount = undefined;
        this.is_paid = undefined;
        this.items = undefined;
        this.items_count = undefined;
        this.payment_status = undefined;
        this.status = undefined;
        this.total_amount = undefined;
        this.notes = undefined;
    }

    static fromJSON(json: any): Order {
        const order = new Order();
        order.id = json.id;
        order.final_amount = json.final_amount;
        order.order_number = json.order_number;
        order.client = json.client || {id: 0, full_name: "", email: "", phone: ""};
        order.created_at = json.created_at;
        order.delivery_date = json.delivery_date ?? null;
        order.delivery_method = json.delivery_method || {name: "", description: "", type: null};
        order.delivery_target = json.delivery_target;
        order.delivery_target_id = json.delivery_target_id;
        order.discount_amount = json.discount_amount || 0;
        order.total_amount_original = json.total_amount_original || 0;
        order.total_promo_discount = json.total_promo_discount || 0;
        order.total_items_discount = json.total_items_discount || 0;
        order.is_paid = !!json.is_paid;
        order.items = json.items || [];
        order.items_count = json.items_count || 0;
        order.payment_status = json.payment_status || "pending";
        order.status = json.status || "new";
        order.total_amount = json.total_amount || 0;
        order.notes = json.notes || "";
        return order;
    }


    toJSONForUpdate() {
        return {
            // id: this.id,
            status: this.status,
            payment_status: this.payment_status,
            created_at: this.created_at,
            notes: this.notes
        }
    }

}

