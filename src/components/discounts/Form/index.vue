<template>
  <form @submit.prevent="submitForm" class="grid gap-4">
    <!-- Основные поля скидки -->
    <DiscountBasicFields
        v-model="form"
        :errors="errors"
        :discount-types="discountTypes"
    />

    <!-- Условия скидки -->
    <DiscountConditionFields
        v-model="form"
        :products="products"
        :categories="categories"
        :product-variants="productVariants"
        :errors="errors"
    />

    <!-- Кнопка отправки -->
    <Button type="submit" class="mt-2" :disabled="loading">
      <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin"/>
      {{ loading ? 'Создание...' : 'Создать скидку' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {toast} from 'vue-sonner'
import {Button} from '@/components/ui/button'
import {Loader2} from 'lucide-vue-next'
import axios from 'axios'
import DiscountBasicFields from '@/components/discounts/Form/BasicFields.vue'
import DiscountConditionFields from '@/components/discounts/Form/ConditionFields.vue'
import {Discount} from "@/models/Discount";

interface DiscountForm {
  name: string
  type: string // 'percentage' | 'fixed'
  value: number
  discount_type: string // 'all' | 'specific' | 'category'
  is_active: boolean
  starts_at: string
  ends_at: string | null
  priority: number
  conditions: Record<string, any>
  products: number[]
  product_variants: number[]
  categories: number[]
}

const emit = defineEmits(['submit'])

const form = ref<Discount>(new Discount({}))

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const discountTypes = ref([
  {value: 'percentage', label: 'Процентная'},
  {value: 'fixed', label: 'Фиксированная'}
])

const products = ref<any[]>([])
const productVariants = ref<any[]>([])
const categories = ref<any[]>([])

// Загрузка данных для выпадающих списков
onMounted(async () => {
  try {
    const [productsRes, variantsRes, categoriesRes] = await Promise.all([
      axios.get('/products?type=simple&paginate=false'),
      // axios.get('/product-variants'),
      // axios.get('/categories')
    ])

    products.value = productsRes.data
    productVariants.value = variantsRes.data.data
    // categories.value = categoriesRes.data.data
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!form.value.name) {
    errors.value.name = 'Название обязательно'
    isValid = false
  }

  if (form.value.value <= 0) {
    errors.value.value = 'Значение должно быть больше 0'
    isValid = false
  }

  if (form.value.discount_type === 'specific' &&
      form.value.products.length === 0 &&
      form.value.product_variants.length === 0) {
    errors.value.products = 'Выберите хотя бы один товар или вариант'
    isValid = false
  }

  // if (form.value.discount_type === 'category' && form.value.categories.length === 0) {
  //   errors.value.categories = 'Выберите хотя бы одну категорию'
  //   isValid = false
  // }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  console.log(11111, form.value.toJSON())
  // return

  try {
    loading.value = true
    const response = await axios.post('/discounts', form.value.toJSON())
    toast.success(response.data?.message || 'Скидка успешно создана')
    emit('submit', response.data.discount)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 422) {
        errors.value = error.response.data.errors
      } else {
        toast.error(error.response.data.message || 'Произошла ошибка')
      }
    } else {
      toast.error('Неизвестная ошибка')
      console.error(error)
    }
  } finally {
    loading.value = false
  }
}
</script>