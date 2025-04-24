<template>
  <Card>
    <CardHeader>
      <BackButton title="Редактирование техкарты" @click="handleBack" />
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

        <div class="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" @click="resetForm" :disabled="isSubmitting">
            Сбросить
          </Button>
          <Button type="submit" :disabled="isSubmitting || isLoading">
            <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Сохранение...' : 'Сохранить изменения' }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import axios from 'axios'
import { CreateRecipe } from '@/models/CreateRecipe'
import { useFormErrors } from '@/composables/useFormErrors'

// Components
import RecipeBasicInfo from '@/components/warehouses/recipes/forms/RecipeBasicInfo.vue'
import RecipeComponentsSection from '@/components/warehouses/recipes/forms/RecipeComponentsSection.vue'
import RecipeProductsSection from '@/components/warehouses/recipes/forms/RecipeProductsSection.vue'
import BackButton from '@/components/BackButton.vue'
import Loader from '@/components/common/Loader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Material } from "@/models/Material";
import Product from "@/models/Product";
import { CostCategory } from "@/models/CostCategory";
import { Unit } from "@/models/Unit";

const route = useRoute()
const router = useRouter()
const { errors, setErrors, resetErrors } = useFormErrors()

const recipeId = Number(route.params.id)

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

const isLoading = ref(false)
const isSubmitting = ref(false)

const toPayload = () => {
  return {
    ...recipeData.value,
    items: recipeData.value.items.map(item => ({
      component_type: item.variant_id ? 'ProductVariant'
          : item.product_id ? 'Product'
              : 'Material',
      component_id: item.variant_id || item.product_id || item.material_id,
      quantity: item.quantity,
      unit_id: item.unit_id,
    })),
    products: recipeData.value.products.map(product => ({
      component_type: product.variant_id ? 'ProductVariant' : 'Product',
      component_id: product.variant_id || product.product_id,
      qty: product.qty,
      is_default: product.is_default,
    }))
  }
}

const loadInitialData = async () => {
  try {
    isLoading.value = true
    resetErrors()

    const [unitsRes, materialsRes, productsRes, recipeRes] = await Promise.all([
      axios.get('/units'),
      axios.get('/products/?material=material&paginate=false'),
      axios.get('/products?material=simple&paginate=false'),
      axios.get(`/recipes/?recipe_id=${recipeId}`)
    ])


    units.value = unitsRes.data
    materials.value = materialsRes.data
    availableProducts.value = productsRes.data
    recipeData.value = new CreateRecipe(recipeRes.data?.recipes || {})

    console.log(recipeData.value)

  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
    toast.error('Не удалось загрузить данные для редактирования')
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
    console.error(`Ошибка загрузки вариантов:`, error)
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

    const payload = toPayload()

    await axios.put(`/recipes/${recipeId}`, payload)

    toast.success('Техкарта успешно обновлена!')
    // await router.push({name: 'recipes-list'})
  } catch (error: any) {
    console.error('Ошибка обновления:', error)

    if (error.response?.status === 422) {
      setErrors(error.response.data.errors)
      toast.error('Пожалуйста, исправьте ошибки в форме')
    } else {
      toast.error(error.response?.data?.message || 'Ошибка при обновлении техкарты')
    }
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  loadInitialData()
  resetErrors()
}

const handleBack = () => {
  router.push({ name: 'recipes-list' })
}

onMounted(() => {
  loadInitialData()
})
</script>
