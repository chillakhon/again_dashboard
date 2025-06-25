import {ref} from 'vue'
import axios from 'axios'
import {useErrorHandler} from "@/composables/useErrorHandler";
import {useSuccessHandler} from "@/composables/useSuccessHandler";

export function useMoySkladFunctions() {
    const sending = ref(false)
    const progress = ref(0)

    const productsSync = async (params: {
        per_page?: number,
        page?: number,
        paginate?: boolean,
        admin?: boolean,
    }) => {
        if (sending.value) return

        sending.value = true
        progress.value = 0

        return await axios.get('third-party-integrations/moysklad/products/sync', {
            params: params
        })
            .then(res => {
                useSuccessHandler().showSuccess(res)
                return res.data
            })

            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
            })
            .finally(() => sending.value = false)
    }


    return {
        sending,
        progress,
        productsSync,
    }
}
