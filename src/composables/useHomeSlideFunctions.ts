import {ref} from 'vue'
import axios from 'axios'
import {useErrorHandler} from '@/composables/useErrorHandler'
import {useSuccessHandler} from '@/composables/useSuccessHandler'
import HomeSlider from '@/models/HomeSlider'

export function useHomeSlideFunctions() {
    const sending = ref(false)

    const getSlides = async (): Promise<HomeSlider[] | null> => {
        sending.value = true
        return await axios.get('slides')
            .then(res => res.data.map((item: any) => HomeSlider.fromJSON(item)))
            .catch(e => {
                useErrorHandler().showError(e)
                return null
            })
            .finally(() => sending.value = false)
    }


    const getSlideById = async (id: number | string): Promise<HomeSlider | null> => {
        sending.value = true
        return await axios.get(`slides/${id}`)
            .then(res => HomeSlider.fromJSON(res.data.data))
            .catch(e => {
                useErrorHandler().showError(e)
                return null
            })
            .finally(() => sending.value = false)
    }

    const createSlide = async (slide: HomeSlider): Promise<HomeSlider | null> => {
        sending.value = true
        return await axios.post('slides', slide.toFormDataForSave(), {
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(res => {
                useSuccessHandler().showSuccess(res)
                return HomeSlider.fromJSON(res.data)
            })
            .catch(e => {
                useErrorHandler().showError(e)
                return null
            })
            .finally(() => sending.value = false)
    }

    const updateSlide = async (id: number | string, slide: HomeSlider): Promise<HomeSlider | null> => {
        sending.value = true
        return await axios.post(`slides/${id}?_method=PATCH`, slide.toFormDataForSave(), {
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(res => {
                useSuccessHandler().showSuccess(res)
                return HomeSlider.fromJSON(res.data)
            })
            .catch(e => {
                useErrorHandler().showError(e)
                return null
            })
            .finally(() => sending.value = false)
    }

    const deleteSlide = async (id: number | string): Promise<boolean> => {
        sending.value = true
        return await axios.delete(`slides/${id}`)
            .then(res => {
                useSuccessHandler().showSuccess(res)
                return true
            })
            .catch(e => {
                useErrorHandler().showError(e)
                return false
            })
            .finally(() => sending.value = false)
    }

    const get = () => {

    }

    return {
        sending,
        getSlides,
        getSlideById,
        createSlide,
        updateSlide,
        deleteSlide
    }
}
