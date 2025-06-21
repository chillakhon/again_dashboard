import {Product} from "@/models/Product";
import {ref} from 'vue'
import axios from "axios";

export function useProductImageUploader() {
    const sending = ref(false)

    const setImagesWithProduct = async (product: Product) => {
        if (sending.value) return

        sending.value = true

        try {
            const formData = new FormData()

            // Добавляем изображения товара
            for (const image of product.images ?? []) {
                if (image.file) {
                    formData.append('product_images[]', image.file, image.file.name)
                }
            }
            for (const variant of product.variants) {
                for (const image of variant.images ?? []) {
                    if (image.file) {
                        formData.append(
                            `variant_images_${variant.uuid}[]`,
                            image.file,
                            image.file.name
                        )
                    }
                }
            }

            // Добавляем остальные поля
            const payload = product.toJSONForCreate() || {}

            for (const [key, value] of Object.entries(payload)) {
                if (value === undefined || value === null) continue

                if (Array.isArray(value) || typeof value === 'object') {
                    // Для массивов и объектов добавляем как JSON строку
                    formData.append(key, JSON.stringify(value))
                } else {
                    // Для простых значений добавляем как есть
                    formData.append(key, value.toString())
                }
            }

            const response = await axios.post(`/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.debug('response:', response.data)
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response)
            } else {
                console.error('Unexpected error:', error)
            }
            throw error
        } finally {
            sending.value = false
        }
    }

    return {
        sending,
        setImagesWithProduct,
    }
}