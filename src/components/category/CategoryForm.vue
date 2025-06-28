<template>
  <DynamicForm
      v-if="!isLoading"
      v-model="props.formData"
      :fields="formFields"
      :errors="errors"
      :show-submit-button="true"
      :submit-button-text="submitButtonName"
      @submit-form="emit('submitForm')"
  />
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import DynamicForm from '@/components/dynamics/DynamicForm.vue'
import {Category} from "@/models/Category";
import {FormDynamicFieldType} from "@/types/form";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";
import {useProductFunctions} from "@/composables/useProductFunctions";
import {Product} from "@/models/Product";

const props = defineProps({
  formData: {
    type: Object as () => Category,
    required: true,
  },
  submitButtonName: {
    type: String,
    default: 'Создать'
  }
})

const emit = defineEmits(['submitForm'])

const isLoading = ref<boolean>(true)
const errors = ref<Record<string, string>>({})
const formFields = ref<FormDynamicFieldType[]>([])

const {getCategories} = useCategoryFunctions()
const {getProducts} = useProductFunctions()

onMounted(async () => {
  const categories = await getCategories({get_children: false})
  const products = await getProducts({per_page: 200, paginate: false})
      .then(response => {
        return response.map(item => Product.fromJSON(item))
      })

  formFields.value = [
    {
      name: 'name',
      component: 'text',
      type: 'text',
      label: 'Название',
      required: true,
      placeholder: 'Введите название'
    },
    {
      name: 'parentId',
      component: 'select',
      label: 'Родительская категория',
      required: false,
      placeholder: 'Выберите категорию',
      options: categories,
      optionLabel: 'name',
      optionValue: 'id'
    },
    {
      name: 'productIds',
      component: 'multiSelect',
      label: 'Товары',
      required: false,
      placeholder: 'Выберите товары',
      options: products,
      optionLabel: 'name',
      optionValue: 'id'
    },
    {
      name: 'description',
      component: 'textarea',
      label: 'Описание',
      required: false,
      placeholder: 'Введите описание',
      rows: 3
    }
  ]

  isLoading.value = false
})

</script>