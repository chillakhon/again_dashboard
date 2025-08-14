<template>
  <DynamicForm
      v-model="props.formData"
      submit-button-text="Создать"
      :show-submit-button="props.showButton"
      :key="renderForm"
      :fields="formFields"
      @submit-form="emit('submitForm', )"
  />
</template>

<script setup lang="ts">
import {ref, onMounted, watch, toRaw} from 'vue'
import DynamicForm from '@/components/dynamics/DynamicForm.vue'
import HomeSlider from '@/models/HomeSlider'

const props = defineProps({
  formData: {
    type: HomeSlider,
    required: true,
  },
  submitButtonName: {
    type: String,
    default: 'Сохранить'
  },
  showButton: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['submitForm'])

const renderForm = ref(1)
const formFields = ref<any[]>([])

onMounted(() => {
  buildFormFields()
})


const buildFormFields = () => {
  formFields.value = [
    [
      {name: 'order', component: 'text', placeholder: 'Порядок отображения', type: 'number'},
      {name: 'is_active', component: 'checkbox', label: 'Активен'},
    ],
    [
      {name: 'title', component: 'text', placeholder: 'Заголовок'},
      {name: 'subtitle', component: 'text', placeholder: 'Подзаголовок'},
    ],

    {name: 'text', component: 'textarea', placeholder: 'Текст'},
    {
      name: 'image',
      component: 'text',
      type: 'file',
      placeholder: 'Изображение',
      accept: 'image/*',
      cropperAspectRatio: 1920 / 920,
      cropperShow: false,
    }
  ]
}
</script>
