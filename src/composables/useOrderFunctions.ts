import {ref} from 'vue'
import axios from 'axios'
import {useErrorHandler} from "@/composables/useErrorHandler";
import Order from "@/models/Order";
import {useSuccessHandler} from "@/composables/useSuccessHandler";

export function useOrderFunctions() {
    const sending = ref(false)
    const progress = ref(0)

    const getOrders = async (params: {
        id?: number | string,
        status?: string,
        per_page?: number,
        page?: number,
        paginate?: boolean,
        search?: string,
        date_from?: string,
        date_to?: string,
    }): Promise<{
        orders: Order[],
        meta: {
            page: number,
            per_page: number,
            total: number,
        }
    } | null> => {


        sending.value = true

        return await axios.get('orders', {
            params: params
        })
            .then(res => {
                const orders: Order[] = res.data.data
                    .map((item: any) => Order.fromJSON(item))
                return {
                    orders: orders,
                    meta: {
                        page: res.data.meta.current_page,
                        per_page: res.data.meta.per_page,
                        total: res.data.meta.total,
                    }
                }
            })
            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
                return null
            })
            .finally(() => sending.value = false)
    }


    const deleteOrder = async (orderId: number | string): Promise<any> => {
        await axios.delete(`orders/${orderId}`)
            .then(res => {
                useSuccessHandler().showSuccess(res)
                return true;
            })
            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
                return false
            })
            .finally(() => sending.value = false)
    }


    const getOrderById = async (orderId: number | string): Promise<Order | null> => {

        return await axios.get(`orders/${orderId}`)
            .then(res => {
                return Order.fromJSON(res.data);
            })
            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
                return null
            })
            .finally(() => sending.value = false)
    }

    const updateOrder = async (orderId: number | string, formData: object): Promise<any> => {
        sending.value = true
        return await axios.put(`orders/${orderId}`, formData)
            .then(res => {
                useSuccessHandler().showSuccess(res)
                return res.data
            })
            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
                return null
            })
            .finally(() => sending.value = false)
    }


    return {
        sending,
        progress,
        getOrders,
        deleteOrder,
        getOrderById,
        updateOrder
    }
}
