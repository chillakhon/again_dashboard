import {ref} from 'vue'
import axios from 'axios'
import {useErrorHandler} from "@/composables/useErrorHandler";
import {useSuccessHandler} from "@/composables/useSuccessHandler";
import {Category} from "@/models/Category";

export function useCategoryFunctions() {
    const sending = ref(false)
    const progress = ref(0)

    const getCategories = async (params: {
        id?: number | string,
        per_page?: number,
        page?: number,
        paginate?: boolean,
        name?: string,
        slug?: string,
        get_children?: boolean,
    }): Promise<Category[]> => {

        sending.value = true
        progress.value = 0

        return await axios.get('categories', {
            params: params
        })
            .then(res => {
                return res.data.map((item: any) => Category.fromJSON(item))
            })
            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
            })
            .finally(() => sending.value = false)
    }

    const getCategoryById = async (categoryId: any, params: {
        per_page?: number,
        page?: number,
        paginate?: boolean,
        admin?: boolean,
    }) => {
        if (sending.value) return

        sending.value = true
        progress.value = 0

        return await axios.get(`categories/${categoryId}`, {
            params: params
        })
            .then(res => {
                return res.data
            })
            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)
            })
            .finally(() => sending.value = false)
    }

    const deleteCategory = async (categoryId: any, params: {
        per_page?: number,
        page?: number,
        paginate?: boolean,
        admin?: boolean,
    }) => {
        if (sending.value) return

        sending.value = true
        progress.value = 0

        return await axios.delete(`categories/${categoryId}`, {
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

    const createCategory = async (data: {
        name: string,
        description?: string,
        parent_id?: number | null,
        product_ids?: number[]
    }) => {
        if (sending.value) return

        sending.value = true
        progress.value = 0

        return await axios.post('categories', data)
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
        getCategories,
        getCategoryById,
        deleteCategory,
        createCategory
    }
}
