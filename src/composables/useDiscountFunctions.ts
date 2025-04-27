import axios from "axios";
import {toast} from "vue-sonner";
import {Discount} from "@/models/Discount";

interface DiscountFormData {
    id?: number;
    code?: string;
    percentage?: number;
    valid_from?: string;
    valid_to?: string;
    max_uses?: number | null;
    current_uses?: number;
    is_active?: boolean;

    [key: string]: any;
}

export function useDiscountFunctions() {
    const addDiscount = async (discount: DiscountFormData): Promise<void> => {
        try {
            const response = await axios.post('/discounts', discount);
            if (response.data.status) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Что-то пошло не так");
            } else {
                toast.error("Неизвестная ошибка");
                console.error("Error adding discount:", error);
            }
        }
    };

    const updateDiscount = async (discount: Discount): Promise<Discount | null> => {
        try {
            if (!discount.id) {
                toast.error("ID скидки не указан");
                return null;
            }

            const response = await axios.put(`/discounts/${discount.id}`, discount);
            toast.success(response.data.message || "Данные скидки обновлены");

            return response.data?.data ? Discount.fromJSON(response.data.data) : null;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при обновлении");
            } else {
                toast.error("Ошибка сети");
                console.error("Error updating discount:", error);
            }
            return null;
        }
    };

    const deleteDiscount = async (discountId: number): Promise<void> => {
        try {
            const response = await axios.delete(`/discounts/${discountId}`);
            toast.success(response.data.message || "Скидка успешно удалена");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при удалении");
            } else {
                toast.error("Ошибка сети");
                console.error("Error deleting discount:", error);
            }
        }
    };

    // const getDiscount = async (discountId: number): Promise<Discount | null> => {
    //     try {
    //         const response = await axios.get(`/discounts/${discountId}`);
    //         return Discount.fromJSON(response.data.data);
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             toast.error(error.response?.data?.message || "Ошибка при загрузке");
    //         } else {
    //             toast.error("Ошибка сети");
    //             console.error("Error fetching discount:", error);
    //         }
    //         return null;
    //     }
    // };

    // const getDiscounts = async (page: number = 1, perPage: number = 10): Promise<{
    //     discounts: Discount[],
    //     total: number
    // } | null> => {
    //     try {
    //         const response = await axios.get(`/discounts?page=${page}&per_page=${perPage}`);
    //         return {
    //             discounts: response.data.data.map((item: any) => Discount.fromJSON(item)),
    //             total: response.data.total
    //         };
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             toast.error(error.response?.data?.message || "Ошибка при загрузке списка");
    //         } else {
    //             toast.error("Ошибка сети");
    //             console.error("Error fetching discounts:", error);
    //         }
    //         return null;
    //     }
    // };

    // function prepareDiscountDataForValidation(discount: Discount) {
    //     return {
    //         code: discount.code,
    //         percentage: discount.percentage,
    //         valid_from: discount.valid_from,
    //         valid_to: discount.valid_to,
    //         max_uses: discount.max_uses,
    //         is_active: discount.is_active
    //     };
    // }

    return {
        addDiscount,
        updateDiscount,
        deleteDiscount,
        // getDiscount,
        // getDiscounts
    };
}