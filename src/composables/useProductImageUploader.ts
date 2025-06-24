import {ref} from 'vue'
import axios from 'axios'
import {Product} from '@/models/Product'
import {useErrorHandler} from "@/composables/useErrorHandler";
import {useSuccessHandler} from "@/composables/useSuccessHandler";

export function useProductImageUploader() {
    const sending = ref(false)
    const progress = ref(0)

    const setImagesWithProduct = async (product: Product) => {
        if (sending.value) return

        sending.value = true
        progress.value = 0

        try {
            const formData = new FormData()

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

            const payload = product.toJSONForCreate() || {}

            for (const [key, value] of Object.entries(payload)) {
                if (key === 'variants' && Array.isArray(value)) {
                    value.forEach((variant, index) => {
                        for (const [vKey, vValue] of Object.entries(variant)) {
                            const formattedKey = `variants[${index}][${vKey}]`;

                            if (Array.isArray(vValue)) {
                                vValue.forEach(item => {
                                    formData.append(`${formattedKey}[]`, String(item));
                                });
                            } else if (typeof vValue === 'object' && vValue !== null) {
                                formData.append(formattedKey, JSON.stringify(vValue));
                            } else {
                                formData.append(formattedKey, String(vValue));
                            }
                        }
                    });
                } else if (key === 'colors' && Array.isArray(value)) {
                    value.forEach((color, index) => {
                        for (const [colorKey, colorValue] of Object.entries(color)) {
                            formData.append(`colors[${index}][${colorKey}]`, String(colorValue));
                        }
                    });
                } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, String(item));
                    });
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }


            const response = await axios.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (e) => {
                    if (e.total) {
                        progress.value = Math.round((e.loaded * 100) / e.total)
                    }
                },
            })

            useSuccessHandler().showSuccess(response)

            return response.data

        } catch (error: any) {
            useErrorHandler().showError(error)
            throw error
        } finally {
            sending.value = false
        }
    }

    const getImageByName = async (name: string) => {
        const response = await axios.get('/products/image' + name);
    }

    return {
        sending,
        progress,
        setImagesWithProduct,
        getImageByName
    }
}
