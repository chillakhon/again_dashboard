<template>
  <!--  {{ props.formData }}-->
  <DynamicForm
      v-model="props.formData"
      :key="renderForm"
      :fields="formFields"
      :show-submit-button="false"
      @submit-form="emit('submitForm')"
  />
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import DynamicForm from '@/components/dynamics/DynamicForm.vue'

import {MoyskladSettings} from "@/models/MoyskladSettings";
import ContactRequest from "@/models/ContactRequest";
import {useStatuses} from "@/composables/useStatuses";

const props = defineProps({
  formData: {
    type: ContactRequest,
    required: true,
  },
  submitButtonName: {
    type: String,
    default: 'Сохранить'
  }
})

const emit = defineEmits(['submitForm'])

const renderForm = ref(1)
const formFields = ref<any[]>([])

const {getStatuses} = useStatuses()


onMounted(async () => {
  await buildFormFields()
})


const buildFormFields = async () => {
  formFields.value = [

    {
      name: 'status',
      component: 'select',
      placeholder: 'Статус',
      options: getStatuses('contactRequest'),
      optionValue: 'value',
      optionLabel: 'label',
    },

    // {
    //   name: 'email',
    //   component: 'text',
    //   type: 'email',
    //   placeholder: 'Email'
    // },
    //
    // {
    //   name: 'message',
    //   component: 'textarea',
    //   type: 'textarea',
    //   placeholder: 'Сообщение'
    // },
    // {
    //   name: 'phone',
    //   component: 'text',
    //   type: 'text',
    //   placeholder: 'Телефон'
    // },
  ]
}
</script>
