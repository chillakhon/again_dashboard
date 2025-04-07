<template>
  <Card>
    <CardHeader>
      <BackButton title="Создание новой техкарты" />
      <CardDescription>Заполните все необходимые поля</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Основная информация -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="name">Название техкарты*</Label>
            <Input id="name" v-model="form.name" placeholder="Введите название" required />
          </div>

          <div class="space-y-2">
            <Label for="output_quantity">Выходное количество*</Label>
            <Input id="output_quantity" type="number" v-model="form.output_quantity" min="0" required />
          </div>

          <div class="space-y-2">
            <Label for="output_unit_id">Единица измерения*</Label>
            <Select v-model="form.output_unit_id" required :disabled="isUnitsLoading">
              <SelectTrigger>
                <SelectValue placeholder="Выберите единицу">
                  <span v-if="isUnitsLoading">Загрузка...</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                    v-for="unit in units"
                    :key="unit.id"
                    :value="unit.id"
                >
                  {{ unit.name }} ({{ unit.abbreviation }})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="production_time">Время производства (мин)*</Label>
            <Input id="production_time" type="number" v-model="form.production_time" min="0" required />
          </div>

          <div class="space-y-2 md:col-span-2">
            <Label for="description">Описание</Label>
            <Textarea id="description" v-model="form.description" placeholder="Подробное описание техкарты" />
          </div>

          <div class="space-y-2 md:col-span-2">
            <Label for="instructions">Инструкции</Label>
            <Textarea id="instructions" v-model="form.instructions" placeholder="Пошаговые инструкции" />
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox id="is_active" v-model:checked="form.is_active" />
            <Label for="is_active">Активная техкарта</Label>
          </div>
        </div>

        <!-- Компоненты техкарты -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <Label class="text-lg">Компоненты</Label>
            <Button type="button" variant="outline" size="sm" @click="addItem">
              <PlusIcon class="h-4 w-4 mr-2" />
              Добавить компонент
            </Button>
          </div>

          <div v-for="(item, index) in form.items" :key="index" class="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg">
            <div class="space-y-2">
              <Label>Тип компонента</Label>
              <Select v-model="item.component_type">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Material">Материал</SelectItem>
                  <SelectItem value="Product">Продукт</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Компонент</Label>
              <Select v-model="item.component_id" :disabled="!item.component_type">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите компонент" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                      v-for="component in getComponentsByType(item.component_type)"
                      :key="component.id"
                      :value="component.id"
                  >
                    {{ component.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Количество</Label>
              <div class="flex items-center space-x-2">
                <Input type="number" v-model="item.quantity" min="0" step="0.01" />
                <Select v-model="item.unit_id" class="w-[100px]" :disabled="isUnitsLoading">
                  <SelectTrigger>
                    <SelectValue>
                      <span v-if="isUnitsLoading">...</span>
                      <span v-else>
                        {{ getUnitAbbreviation(item.unit_id) }}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                        v-for="unit in units"
                        :key="unit.id"
                        :value="unit.id"
                    >
                      {{ unit.abbreviation }} ({{ unit.name }})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="flex items-end justify-end">
              <Button type="button" variant="ghost" size="sm" @click="removeItem(index)">
                <TrashIcon class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Продукты -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <Label class="text-lg">Связанные продукты</Label>
            <Button
                type="button"
                variant="outline"
                size="sm"
                @click="addProduct"
                :disabled="availableProducts.length === 0"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Добавить продукт
            </Button>
          </div>

          <div v-if="isProductsLoading" class="flex justify-center py-4">
            <Loader class="h-5 w-5 animate-spin" />
          </div>

          <div v-for="(product, index) in form.products" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg">
            <div class="space-y-2">
              <Label>Продукт</Label>
              <Select
                  v-model="product.product_id"
                  @update:modelValue="loadVariants(product)"
              >
                <SelectTrigger>
                  <SelectValue>
                    {{ getProductName(product.product_id) }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                      v-for="product in availableProducts"
                      :key="product.id"
                      :value="product.id"
                      :disabled="isProductAlreadyAdded(product.id)"
                  >
                    {{ product.name }}
                    <span v-if="isProductAlreadyAdded(product.id)" class="text-xs text-gray-500 ml-2">
                      (уже добавлен)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Вариант</Label>
              <Select
                  v-model="product.variant_id"
                  :disabled="!product.product_id || !hasVariants(product.product_id)"
              >
                <SelectTrigger>
                  <SelectValue>
                    {{ getVariantName(product.product_id, product.variant_id) }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <template v-if="hasVariants(product.product_id)">
                    <SelectItem
                        v-for="variant in getProductVariants(product.product_id)"
                        :key="variant.id"
                        :value="variant.id"
                    >
                      {{ variant.name }} ({{ formatCurrency(variant.price) }})
                    </SelectItem>
                  </template>
                  <SelectItem v-else :value="0">
                    Без вариантов
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center space-x-2 justify-end">
              <Checkbox id="is_default" v-model:checked="product.is_default" />
              <Label for="is_default">По умолчанию</Label>
              <Button type="button" variant="ghost" size="sm" @click="removeProduct(index)">
                <TrashIcon class="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Ставки затрат -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <Label class="text-lg">Ставки затрат</Label>
            <Button type="button" variant="outline" size="sm" @click="addCostRate">
              <PlusIcon class="h-4 w-4 mr-2" />
              Добавить ставку
            </Button>
          </div>

          <div v-for="(rate, index) in form.cost_rates" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg">
            <div class="space-y-2">
              <Label>Категория затрат</Label>
              <Select v-model="rate.cost_category_id">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="category in costCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Ставка за единицу</Label>
              <Input type="number" v-model="rate.rate_per_unit" min="0" step="0.01" />
            </div>

            <div class="space-y-2">
              <Label>Фиксированная ставка</Label>
              <div class="flex items-center space-x-2">
                <Input type="number" v-model="rate.fixed_rate" min="0" step="0.01" />
                <Button type="button" variant="ghost" size="sm" @click="removeCostRate(index)">
                  <TrashIcon class="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="resetForm">
            Отмена
          </Button>
          <Button type="submit" :disabled="isSubmitting || isUnitsLoading">
            <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Создание...' : 'Создать техкарту' }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, TrashIcon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import axios from 'axios'
import Product from '@/models/Product'

// Импорт компонентов shadcn-vue
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Loader from '@/components/common/Loader.vue'
import BackButton from "@/components/BackButton.vue"
import {useRouter} from "vue-router";

const router = useRouter()

interface Unit {
  id: number
  name: string
  abbreviation: string
  description?: string
}

interface TechCardForm {
  name: string
  description: string
  output_quantity: number
  output_unit_id: number | null
  instructions: string
  production_time: number
  is_active: boolean
  items: {
    component_type: 'Material' | 'Product'
    component_id: number
    quantity: number
    unit_id: number | null
  }[]
  products: {
    product_id: number
    variant_id: number | null
    is_default: boolean
  }[]
  cost_rates: {
    cost_category_id: number
    rate_per_unit: number
    fixed_rate: number
  }[]
}

const units = ref<Unit[]>([])
const isUnitsLoading = ref(false)

const materials = ref([
  { id: 1, name: 'Материал 1' },
  { id: 2, name: 'Материал 2' }
])

const costCategories = ref([
  { id: 1, name: 'Зарплата' },
  { id: 2, name: 'Электроэнергия' }
])

const form = ref<TechCardForm>({
  name: '',
  description: '',
  output_quantity: 0,
  output_unit_id: null,
  instructions: '',
  production_time: 0,
  is_active: true,
  items: [],
  products: [],
  cost_rates: []
})

const isSubmitting = ref(false)
const availableProducts = ref<Product[]>([])
const isProductsLoading = ref(false)

// Загрузка единиц измерения
const loadUnits = async () => {
  try {
    isUnitsLoading.value = true
    const response = await axios.get('/units')
    units.value = response.data

    // Устанавливаем первую единицу по умолчанию
    if (units.value.length > 0) {
      form.value.output_unit_id = units.value[0].id
      // Устанавливаем единицы для всех компонентов
      form.value.items.forEach(item => {
        item.unit_id = units.value[0].id
      })
    }
  } catch (error) {
    console.error('Ошибка загрузки единиц измерения:', error)
    toast.error('Не удалось загрузить список единиц измерения')
  } finally {
    isUnitsLoading.value = false
  }
}

// Получение аббревиатуры единицы измерения
const getUnitAbbreviation = (unitId: number | null) => {
  if (!unitId) return '—'
  const unit = units.value.find(u => u.id === unitId)
  return unit?.abbreviation || '—'
}

// Загрузка продуктов
const loadProducts = async () => {
  try {
    isProductsLoading.value = true
    const response = await axios.get('/products')
    availableProducts.value = response.data.data.map((p: any) => new Product(p))
  } catch (error) {
    console.error('Ошибка загрузки продуктов:', error)
    toast.error('Не удалось загрузить список продуктов')
  } finally {
    isProductsLoading.value = false
  }
}

// Загрузка вариантов продукта
const loadVariants = async (productItem: { product_id: number }) => {
  if (!productItem.product_id) return

  const product = availableProducts.value.find(p => p.id === productItem.product_id)
  if (product && !product.variants && product.has_variants) {
    try {
      const response = await axios.get(`/products/${product.id}/variants`)
      product.variants = response.data
    } catch (error) {
      console.error('Ошибка загрузки вариантов:', error)
      toast.error(`Не удалось загрузить варианты для продукта ${product.name}`)
    }
  }
}

// Получение названия продукта
const getProductName = (productId: number | null) => {
  if (!productId) return 'Выберите продукт'
  const product = availableProducts.value.find(p => p.id === productId)
  return product?.name || 'Неизвестный продукт'
}

// Получение названия варианта
const getVariantName = (productId: number | null, variantId: number | null) => {
  if (!productId) return 'Выберите продукт'
  if (variantId === null) return 'Без вариантов'
  if (variantId === 0) return 'Выберите вариант'

  const product = availableProducts.value.find(p => p.id === productId)
  if (!product) return 'Продукт не найден'

  const variant = product.variants?.find(v => v.id === variantId)
  return variant?.name || 'Вариант не найден'
}

// Получение вариантов продукта
const getProductVariants = (productId: number) => {
  const product = availableProducts.value.find(p => p.id === productId)
  return product?.variants || []
}

// Проверка наличия вариантов у продукта
const hasVariants = (productId: number) => {
  const product = availableProducts.value.find(p => p.id === productId)
  return product?.has_variants && (product.variants?.length || 0) > 0
}

// Проверка, добавлен ли уже продукт
const isProductAlreadyAdded = (productId: number) => {
  return form.value.products.some(p => p.product_id === productId)
}

// Форматирование валюты
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2
  }).format(value)
}

// Получение компонентов по типу
const getComponentsByType = (type: string) => {
  return type === 'Material' ? materials.value : availableProducts.value
}

// Добавление компонента
const addItem = () => {
  form.value.items.push({
    component_type: 'Material',
    component_id: 0,
    quantity: 0,
    unit_id: units.value[0]?.id || null
  })
}

// Удаление компонента
const removeItem = (index: number) => {
  form.value.items.splice(index, 1)
}

// Добавление продукта
const addProduct = () => {
  const availableProduct = availableProducts.value.find(
      p => !form.value.products.some(added => added.product_id === p.id)
  )

  if (availableProduct) {
    form.value.products.push({
      product_id: availableProduct.id,
      variant_id: availableProduct.has_variants ? 0 : null,
      is_default: form.value.products.length === 0
    })

    if (availableProduct.has_variants) {
      loadVariants(form.value.products[form.value.products.length - 1])
    }
  }
}

// Удаление продукта
const removeProduct = (index: number) => {
  form.value.products.splice(index, 1)
  if (form.value.products.length > 0 && form.value.products.every(p => !p.is_default)) {
    form.value.products[0].is_default = true
  }
}

// Добавление ставки затрат
const addCostRate = () => {
  form.value.cost_rates.push({
    cost_category_id: 0,
    rate_per_unit: 0,
    fixed_rate: 0
  })
}

// Удаление ставки затрат
const removeCostRate = (index: number) => {
  form.value.cost_rates.splice(index, 1)
}

// Сброс формы
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    output_quantity: 0,
    output_unit_id: units.value[0]?.id || null,
    instructions: '',
    production_time: 0,
    is_active: true,
    items: [],
    products: [],
    cost_rates: []
  }
}

// Отправка формы
const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    // Валидация
    if (!form.value.name) {
      throw new Error('Название техкарты обязательно')
    }

    if (form.value.items.length === 0) {
      throw new Error('Добавьте хотя бы один компонент')
    }

    // Подготовка данных для отправки
    const payload = {
      ...form.value,
      products: form.value.products.map(p => ({
        product_id: p.product_id,
        variant_id: p.variant_id,
        is_default: p.is_default
      }))
    }

    // Отправка данных
    const response = await axios.post('/recipes', payload)

    toast.success('Техкарта успешно создана')
    await router.push('/warehouses/recipes/list')
    resetForm()
  } catch (error) {
    console.error('Ошибка создания техкарты:', error)
    toast.error(error.response?.data?.message || error.message || 'Ошибка создания техкарты')
  } finally {
    isSubmitting.value = false
  }
}

// Инициализация
onMounted(async () => {
  await Promise.all([loadUnits(), loadProducts()])
})
</script>