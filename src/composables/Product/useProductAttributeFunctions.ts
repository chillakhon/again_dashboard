import {ref} from 'vue'
import axios from 'axios'
import {useErrorHandler} from "@/composables/useErrorHandler"
import {useSuccessHandler} from "@/composables/useSuccessHandler"

export function useProductAttributeFunctions() {
    const sending = ref(false)
    const progress = ref(0)

    /**
     * Обновить впитываемость товара
     * POST /api/admin/products/{id}/absorbency
     */
    const updateAbsorbency = async (productId: number, absorbencyLevel: number) => {
        // Валидация на фронте
        if (absorbencyLevel < 0 || absorbencyLevel > 6) {
            useErrorHandler().showError({
                response: {
                    data: {message: 'Впитываемость должна быть от 0 до 6'}
                }
            })
            return
        }

        if (sending.value) return
        sending.value = true
        progress.value = 0

        try {
            const response = await axios.post(`/products/attributes/${productId}/absorbency`, {
                absorbency_level: absorbencyLevel
            })
            useSuccessHandler().showSuccess(response)
            return response.data
        } catch (error) {
            useErrorHandler().showError(error)
            throw error
        } finally {
            sending.value = false
        }
    }

    return {
        sending,
        progress,
        updateAbsorbency
    }
}