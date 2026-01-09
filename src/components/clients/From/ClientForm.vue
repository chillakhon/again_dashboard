<template>
  <Spinner v-if="isLoading"/>
  <DynamicForm
      v-else
      v-model="props.formData"
      :submit-button-text="props.submitButtonText"
      :fields="formFields"
      :errors="errors"
      :show-submit-button="props.showSubmitButton"
      @submit-form="emit('submitForm')"
  />
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import DynamicForm from '@/components/dynamics/DynamicForm.vue'
import {Spinner} from "@/components/ui/spinner"
import type {ClientFormData} from '@/types/client'

interface ClientFormFieldsProps {
  formData: ClientFormData
  showSubmitButton?: boolean
  submitButtonText?: string
}

const props = withDefaults(defineProps<ClientFormFieldsProps>(), {
  showSubmitButton: true,
  submitButtonText: 'Создать клиента',
})

const emit = defineEmits(['submitForm'])

const isLoading = ref<boolean>(true)
const errors = ref<Record<string, string>>({})
const formFields = ref<any[]>([])

onMounted(() => {
  buildFormFields()
  isLoading.value = false
})

const buildFormFields = () => {
  formFields.value = [
    // Email
    {
      name: 'email',
      component: 'text',
      type: 'email',
      label: 'Email',
      required: true,
      placeholder: 'example@mail.com',
    },

    // Имя и Фамилия
    [
      {
        name: 'first_name',
        component: 'text',
        type: 'text',
        label: 'Имя',
        required: true,
        placeholder: 'Иван',
      },
      {
        name: 'last_name',
        component: 'text',
        type: 'text',
        label: 'Фамилия',
        required: true,
        placeholder: 'Иванов',
      },
    ],

    // Телефон и День рождения
    [
      {
        name: 'phone',
        component: 'text',
        type: 'tel',
        label: 'Телефон',
        placeholder: '+7 XXX XXX XXXX',
      },
      {
        name: 'birthday',
        component: 'date',
        label: 'День рождения',
        placeholder: 'Выберите дату',
      },
    ],

    // Адрес на всю ширину
    {
      name: 'address',
      component: 'textarea',
      label: 'Адрес',
      placeholder: 'Улица, дом, квартира...',
      rows: 2,
    },

    // Уровень клиента (если нужно)
    // {
    //   name: 'level_id',
    //   component: 'select',
    //   label: 'Уровень клиента',
    //   options: [], // Загрузите уровни из API
    //   optionLabel: 'name',
    //   optionValue: 'id',
    //   placeholder: 'Выберите уровень',
    // },
  ]
}
</script>