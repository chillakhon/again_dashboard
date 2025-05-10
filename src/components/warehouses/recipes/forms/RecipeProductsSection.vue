<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <Label class="text-sm font-medium">Выходные продукты</Label>
        <p class="text-xs text-muted-foreground">Продукты по техкарте</p>
      </div>
      <Button
          type="button"
          variant="outline"
          size="sm"
          @click="addProduct"
          :disabled="availableProducts?.length === 0"
          class="h-8 text-xs"
      >
        <PlusIcon class="h-3 w-3 mr-1"/>
      </Button>
    </div>

    <div v-if="modelValue.output_products?.length === 0" class="rounded-lg border border-dashed p-4 text-center">
      <PackagePlusIcon class="mx-auto h-5 w-5 text-muted-foreground"/>
      <h3 class="mt-1 text-xs font-medium">Нет продуктов</h3>
      <p class="mt-1 text-xs text-muted-foreground">Добавьте получаемые продукты</p>
    </div>

    <div v-else class="space-y-2">
      <div
          v-for="(product, index) in modelValue.output_products"
          :key="index"
          class="grid grid-cols-1 gap-2 border p-2 rounded-lg bg-background hover:bg-accent/50 transition-colors"
      >
        <div class="grid md:grid-cols-12 grid-cols-1 gap-2 items-end">
          <!-- Продукт -->
          <div class="md:col-span-6">
            <Label class="text-xs">Продукт</Label>
            <Select
                v-model="product.component_id"
                @update:modelValue="loadVariants(product)"
            >
              <SelectTrigger class="h-8 text-xs">
                <SelectValue placeholder="Выберите">
                  {{ getProductName(product.component_id) }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                    v-for="prod in availableProducts"
                    :key="prod.id"
                    :value="prod.id"
                    :disabled="isProductAlreadyAdded(prod.id, index)"
                    class="text-xs"
                >
                  {{ prod.name }}
                  <span v-if="isProductAlreadyAdded(prod.id, index)" class="text-muted-foreground ml-1">
                    (добавлен)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Вариант -->
          <div class="md:col-span-4">
            <Label class="text-xs">Вариант</Label>
            <Select
                v-model="product.variant_id"
                :disabled="!product.component_id || !hasVariants(product.component_id)"
            >
              <SelectTrigger class="h-8 text-xs">
                <SelectValue>
                  {{ getVariantName(product.component_id, product.variant_id) }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                    v-for="variant in getProductVariants(product.component_id)"
                    :key="variant.id"
                    :value="variant.id"
                    class="text-xs"
                >
                  {{ variant.name }} ({{ formatCurrency(variant.price) }})
                </SelectItem>
                <SelectItem :value="null" class="text-xs">
                  Без вариантов
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="">
            <Label class="text-xs">Количество</Label>
            <div class="flex gap-2">
              <Input
                  v-model.number="product.qty"
                  type="number"
                  min="1"
                  step="1"
                  class="h-8 text-xs"
              />
            </div>
          </div>
          <!-- Удаление -->
          <div class="flex justify-end">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                @click="removeProduct(index)"
            >
              <Trash2Icon class="h-3.5 w-3.5"/>
            </Button>
          </div>
        </div>

        <!-- Количество -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PlusIcon, PackagePlusIcon, Trash2Icon} from 'lucide-vue-next'
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {CreateRecipe} from "@/models/CreateRecipe";

const props = defineProps({
  modelValue: { type: CreateRecipe, required: true }, // Изменили model на modelValue
  availableProducts: { type: Array, required: true },
  isLoading: Boolean,
  errors: Object
})

const emit = defineEmits(['update:modelValue']) // Обновили emit

const addProduct = () => {
  const availableProduct = props.availableProducts?.find(
      p => !props.modelValue?.output_products?.some(added => added.component_id === p.id))

  if (availableProduct) {
    const newProduct = {
      component_type: 'Product',
      component_id: availableProduct.id,
      variant_id: null,
      qty: 1,
      is_default: props.modelValue?.output_products?.length === 0
    }

    emit('update:modelValue', {
      ...props.modelValue,
      output_products: [
        ...(props.modelValue?.output_products || []),
        newProduct
      ]
    })
  }
}

const removeProduct = (index: number) => {
  const newProducts = [...(props.modelValue?.output_products || [])]
  const wasDefault = newProducts[index]?.is_default
  newProducts.splice(index, 1)

  if (wasDefault && newProducts.length > 0) {
    newProducts[0].is_default = true
  }

  emit('update:modelValue', {
    ...props.modelValue,
    output_products: newProducts
  })
}

const loadVariants = (productItem) => {
  if (!productItem.component_id) return

  // Сбрасываем variant_id при смене продукта
  productItem.variant_id = null

  const product = props.availableProducts?.find(p => p.id === productItem.component_id)
  if (product && !product.variants && product.has_variants) {
    // Загрузка вариантов...
  }
}
const hasVariants = (productId) => {
  const product = props.availableProducts?.find(p => p.id === productId)
  return product?.has_variants && product.variants?.length > 0
}

const getProductVariants = (productId) => {
  return props.availableProducts?.find(p => p.id === productId)?.variants || []
}

const getProductName = (productId) => {
  return props.availableProducts.find(p => p.id === productId)?.name || 'Выберите'
}

const getVariantName = (productId, variantId) => {
  if (!productId) return 'Выберите продукт'
  if (!variantId) return 'Без вариантов'

  const product = props.availableProducts?.find(p => p.id === productId)
  if (!product || !product.variants) return 'Нет вариантов'

  const variant = product.variants.find(v => v.id === variantId)
  return variant?.name || 'Вариант не найден'
}

const isProductAlreadyAdded = (productId, currentIndex) => {
  return props.modelValue?.output_products.some((p, i) => p.component_id === productId && i !== currentIndex)
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(value)
}


</script>