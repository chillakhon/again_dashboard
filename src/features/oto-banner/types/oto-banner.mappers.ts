import type {
    OtoBanner,
    OtoBannerFormData,
    CreateOtoBannerRequest,
    UpdateOtoBannerRequest
} from './index'


/**
 * Преобразовать баннер в форму
 */
export const otoBannerToFormData = (banner: OtoBanner): OtoBannerFormData => ({
    name: banner.name,
    status: banner.status,
    device_type: banner.device_type,
    title: banner.title ?? '',
    subtitle: banner.subtitle ?? '',
    button_enabled: banner.button_enabled,
    button_text: banner.button_text ?? 'Отправить',
    input_field_enabled: banner.input_field_enabled,
    input_field_type: banner.input_field_type,
    input_field_label: banner.input_field_label ?? '',
    input_field_placeholder: banner.input_field_placeholder ?? '',
    input_field_required: banner.input_field_required,
    display_delay_seconds: banner.display_delay_seconds,
    privacy_text: banner.privacy_text ?? '',
    segment_ids: banner.segment_ids ?? [],
    image: null, // Изображение не преобразуем
})

/**
 * Преобразовать форму в CreateRequest
 */
export const formDataToCreateRequest = (formData: OtoBannerFormData): FormData => {
    const data = new FormData()

    data.append('name', formData.name)
    data.append('status', formData.status)
    data.append('device_type', formData.device_type)

    if (formData.title) data.append('title', formData.title)
    if (formData.subtitle) data.append('subtitle', formData.subtitle)

    data.append('button_enabled', formData.button_enabled ? '1' : '0')
    if (formData.button_text) data.append('button_text', formData.button_text)

    data.append('input_field_enabled', formData.input_field_enabled ? '1' : '0')

    if (formData.input_field_type) data.append('input_field_type', formData.input_field_type)

    if (formData.input_field_label) data.append('input_field_label', formData.input_field_label)
    if (formData.input_field_placeholder) data.append('input_field_placeholder', formData.input_field_placeholder)
    data.append('input_field_required', formData.input_field_required ? '1' : '0')

    data.append('display_delay_seconds', formData.display_delay_seconds.toString())

    if (formData.privacy_text) data.append('privacy_text', formData.privacy_text)

    if (formData.segment_ids && formData.segment_ids.length > 0) {
        formData.segment_ids.forEach((id, index) => {
            data.append(`segment_ids[${index}]`, id.toString())
        })
    }

    if (formData.image) {
        data.append('image', formData.image)
    }

    return data
}

/**
 * Преобразовать форму в UpdateRequest
 */
export const formDataToUpdateRequest = (formData: OtoBannerFormData): FormData => {
    // Для обновления используем ту же логику
    return formDataToCreateRequest(formData)
}