// src/types/form.ts
export interface FormDynamicFieldType {
    name: string
    label: string
    component: 'text' | 'textarea' | 'select' | 'multiSelect'
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    cols?: number
    rows?: number

    options?: any[]
    optionLabel?: string
    optionValue?: string
}

export type FieldsProp = (FormDynamicFieldType | FormDynamicFieldType[])[]
