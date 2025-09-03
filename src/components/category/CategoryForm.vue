<template>
  <Loader v-if="loading"/>
  <DynamicForm
      v-else
      v-model="props.formData"
      :fields="formFields"
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
import Loader from "@/components/common/Loader.vue";

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

const loading = ref(true)

const emit = defineEmits(['submitForm'])

const {getCategories} = useCategoryFunctions()
const {getProducts} = useProductFunctions()

const categories = ref<Category[]>([])
const products = ref<Product[]>([])

const formFields = ref<FormDynamicFieldType[]>([])


onMounted(async () => {

  categories.value = await getCategories({get_children: false})
  products.value = await getProducts({per_page: 200, paginate: false})
      .then(response => {
        return response.map((item: any) => Product.fromJSON(item))
      })


  formFields.value = await getColumns()

  loading.value = false

})


const getColumns = async () => {
  return [
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
      options: categories.value ?? [],
      optionLabel: 'name',
      optionValue: 'id'
    },
    {
      name: 'productIds',
      component: 'multiSelect',
      label: 'Товары',
      required: false,
      placeholder: 'Выберите товары',
      options: products.value ?? [],
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
}

</script>