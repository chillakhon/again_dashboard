/**
 * Основная модель сегмента
 */
export interface Segment {
    id: number
    name: string
    description: string | null
    conditions: SegmentConditions | null
    is_active: boolean
    recalculate_frequency: 'on_view' | 'manual'
    last_recalculated_at: string | null
    clients_count?: number
    promo_codes_count?: number
    created_at: string
    updated_at: string

    // Связи (загружаются только при необходимости)
    clients?: SegmentClient[]
    promo_codes?: PromoCodeBrief[]

    // Статистика (только в списке)
    statistics?: SegmentBriefStatistics
}

/**
 * Условия фильтрации клиентов для сегмента
 */
export interface SegmentConditions {
    period?: 'all_time' | 'last_month' | 'last_6_months' | 'last_year' | null
    min_orders_count?: number | null
    max_orders_count?: number | null
    min_total_amount?: number | null
    min_average_check?: number | null
}

/**
 * Форматированные условия (из SegmentDetailResource)
 */
export interface FormattedSegmentConditions {
    period?: {
        value: string
        label: string
    }
    orders_count?: {
        min: number | null
        max: number | null
        label: string
    }
    total_amount?: {
        min: number
        label: string
    }
    average_check?: {
        min: number
        label: string
    }
}

/**
 * Клиент в сегменте
 */
export interface SegmentClient {
    id: number
    email: string
    profile: {
        first_name: string | null
        last_name: string | null
        full_name: string | null
        phone: string | null
        birthday: string | null
        address: string | null
    }
    orders_count: number
    total_amount: number
    average_check: number
    added_to_segment_at: string | null
    registered_at: string
    segments?: string[]
    promo_codes?: string[]
}

/**
 * Краткая информация о промокоде
 */
export interface PromoCodeBrief {
    id: number
    code: string
    description: string | null
    discount_amount: number
    discount_type: 'percentage' | 'fixed'
    discount_type_label: string
    expires_at: string | null
    is_active: boolean
    auto_apply: boolean
    image_url: string | null
}

/**
 * Краткая статистика (для списка сегментов)
 */
export interface SegmentBriefStatistics {
    clients_count: number
    total_amount: number
    average_check: number
    total_orders: number
}

/**
 * Полная статистика сегмента
 */
export interface SegmentStatistics {
    clients_count: number
    total_amount: {
        value: number
        formatted: string
    }
    average_check: {
        value: number
        formatted: string
    }
    total_orders: number
    top_clients?: TopClient[]
}

/**
 * Топ клиент
 */
export interface TopClient {
    id: number
    full_name: string
    email: string
    orders_count: number
    total_amount: number
    average_check: number
}

/**
 * Детальная информация о сегменте (из SegmentDetailResource)
 */
export interface SegmentDetail extends Omit<Segment, 'conditions'> {
    conditions: FormattedSegmentConditions | null
}