import {Order, OrderUpdateForm} from "@/types/order";

export function orderToFormData(o: Order): OrderUpdateForm {
    return {
        notes: o.notes ?? null,
        status: o.status ?? null,
        payment_status: o.payment_status ?? null,
    }
}