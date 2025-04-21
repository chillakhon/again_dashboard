<template>
  <Card>
    <CardHeader>
      <BackButton title="Создание новой техкарты" @click="handleBack"/>
      <!--      <CardDescription>Заполните все необходимые поля</CardDescription>-->
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <RecipeBasicInfo
            v-model="recipeData"
            :units="units"
            :is-units-loading="isLoading"
            :errors="errors"
        />


        <RecipeComponentsSection
            :model="recipeData"
            :units="units"
            :materials="materials"
            :products="availableProducts"
            :is-units-loading="isLoading"
            :errors="errors"
            @update:model="recipeData = $event"
        />

        <RecipeProductsSection
            :model="recipeData"
            @update:model="recipeData = $event"
            :available-products="availableProducts"
            :is-loading="isLoading"
            :errors="errors"
            @load-variants="loadProductVariants"
        />

        <!--        <RecipeCostRatesSection-->
        <!--            :model="recipeData"-->
        <!--            @update:model="recipeData = $event"-->
        <!--            :cost-categories="costCategories"-->
        <!--            :errors="errors"-->
        <!--        />-->

        <div class="flex justify-end gap-2 pt-4">
          <Button
              type="button"
              variant="outline"
              @click="resetForm"
              :disabled="isSubmitting"
          >
            Сбросить форму
          </Button>
          <Button
              type="submit"
              :disabled="isSubmitting || isLoading"
          >
            <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin"/>
            {{ isSubmitting ? 'Создание...' : 'Создать техкарту' }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {toast} from 'vue-sonner'
import axios from 'axios'
import {CreateRecipe} from '@/models/CreateRecipe'
import {useFormErrors} from '@/composables/useFormErrors'

// Components
import RecipeBasicInfo from '@/components/warehouses/recipes/forms/RecipeBasicInfo.vue'
import RecipeComponentsSection from '@/components/warehouses/recipes/forms/RecipeComponentsSection.vue'
import RecipeProductsSection from '@/components/warehouses/recipes/forms/RecipeProductsSection.vue'
import RecipeCostRatesSection from '@/components/warehouses/recipes/forms/RecipeCostRatesSection.vue'
import BackButton from '@/components/BackButton.vue'
import Loader from '@/components/common/Loader.vue'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card";
import {Material} from "@/models/Material";
import Product from "@/models/Product";
import {CostCategory} from "@/models/CostCategory";
import {Unit} from "@/models/Unit";

const router = useRouter()
const {errors, setErrors, resetErrors} = useFormErrors()

// State
const recipeData = ref<CreateRecipe>(new CreateRecipe({
  name: '',
  description: '',
  output_unit_id: null,
  instructions: '',
  production_time: 0,
  is_active: true,
  items: [],
  products: [],
  cost_rates: []
}))

const units = ref<Unit[]>([])
const materials = ref<Material[]>([])
const availableProducts = ref<Product[]>([])
const costCategories = ref<CostCategory[]>([])

const isLoading = ref(false)
const isSubmitting = ref(false)

// Methods
const loadInitialData = async () => {
  try {
    isLoading.value = true
    resetErrors()

    const requests = [
      await axios.get('/units'),
      await axios.get('/products/?material=material&paginate=false'),
      await axios.get('/products?material=simple&paginate=false'),
    ]

    const [unitsRes, materialsRes, productsRes, categoriesRes] = await Promise.all(requests)

    units.value = unitsRes.data
    materials.value = materialsRes.data
    availableProducts.value = productsRes.data
    // costCategories.value = categoriesRes.data.data

    // Set default unit if available
    if (units.value.length > 0) {
      recipeData.value.output_unit_id = units.value[0].id
    }
  } catch (error) {
    console.error('Failed to load initial data:', error)
    toast.error('Не удалось загрузить необходимые данные')
  } finally {
    isLoading.value = false
  }
}

const loadProductVariants = async (productId: number) => {
  try {
    const product = availableProducts.value.find(p => p.id === productId)
    if (!product || product.variants) return

    const response = await axios.get(`/products/${productId}/variants`)
    product.variants = response.data.data
  } catch (error) {
    console.error(`Failed to load variants for product ${productId}:`, error)
    toast.error('Не удалось загрузить варианты продукта')
  }
}

const validateForm = (): boolean => {
  if (!recipeData.value.name.trim()) {
    toast.error('Укажите название техкарты')
    return false
  }

  if (!recipeData.value.output_unit_id) {
    toast.error('Выберите единицу измерения')
    return false
  }

  if (recipeData.value.production_time <= 0) {
    toast.error('Укажите корректное время производства')
    return false
  }

  if (recipeData.value.items.length === 0) {
    toast.error('Добавьте хотя бы один компонент')
    return false
  }

  // Validate components
  for (const [index, item] of recipeData.value.items.entries()) {
    if (!item.component_id) {
      toast.error(`Выберите компонент для элемента ${index + 1}`)
      return false
    }
    if (item.quantity <= 0) {
      toast.error(`Укажите количество для компонента ${index + 1}`)
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true
    resetErrors()

    console.log(recipeData.value)

    // const payload = recipeData.value.toJSON()


    const response = await axios.post('/recipes', recipeData.value)

    toast.success('Техкарта успешно создана!')
    await router.push({name: 'recipes-list'})
  } catch (error: any) {
    console.error('Recipe creation failed:', error)

    if (error.response?.status === 422) {
      setErrors(error.response.data.errors)
      toast.error('Пожалуйста, исправьте ошибки в форме')
    } else {
      toast.error(error.response?.data?.message || 'Ошибка при создании техкарты')
    }
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  recipeData.value = new CreateRecipe({
    name: '',
    description: '',
    output_unit_id: units.value[0]?.id || null,
    instructions: '',
    production_time: 0,
    is_active: true,
    items: [],
    products: [],
    cost_rates: []
  })
  resetErrors()
}

const handleBack = () => {
  router.push({name: 'recipes-list'})
}

// Lifecycle
onMounted(() => {
  loadInitialData()
})
</script>