import { toast } from 'vue-sonner'

export const useErrorHandler = () => {
  const showError = (error: any, defaultMessage: string = 'Что-то пошло не так') => {
    let message = defaultMessage

    if (error?.response?.data?.error) {
      message = error.response.data.error
    } else if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error?.message) {
      message = error.message
    }

    toast.error(message)
  }

  return {
    showError
  }
}
