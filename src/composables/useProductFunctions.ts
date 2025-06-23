import {ref} from 'vue'
import axios from 'axios'
import {useErrorHandler} from "@/composables/useErrorHandler";
import {useSuccessHandler} from "@/composables/useSuccessHandler";

export function useProductFunctions() {
    const sending = ref(false)
    const progress = ref(0)

    const getProducts = async (params: {
        per_page: number,
        page: number,
        paginate?: boolean,
        admin?: boolean,
    }) => {
        if (sending.value) return

        sending.value = true
        progress.value = 0

        return await axios.get('products', {
            params: params
        })
            .then(res => {
                // console.log(res.data)
                return res.data
            })

            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
            })
            .finally(() => sending.value = false)
    }


    const getImageByName = async (name: string) => {
        return await axios.get(`product/image/${name}`)
    }

    return {
        getProducts,
        sending,
        progress,
    }
}
