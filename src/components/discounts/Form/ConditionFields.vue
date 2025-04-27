<template>
  <div class="grid gap-4">
    <div class="space-y-2">
      <Label>Применять</Label>
      <Select v-model="modelValue.discount_type">
        <SelectTrigger>
          <SelectValue placeholder="Выберите тип применения"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Ко всем товарам</SelectItem>
          <SelectItem value="specific">Конкретным товарам</SelectItem>
<!--          <SelectItem value="category">Категориям товаров</SelectItem>-->
        </SelectContent>
      </Select>
    </div>


<!--    {{products}}-->

    <!-- Конкретные товары -->
    <template v-if="modelValue.discount_type === 'specific'">
      <div class="space-y-2">
        <Label>Товары</Label>
<!--        <multi-select option-label="name"/>-->

        <MultiSelect
            v-model="modelValue.products"
            :options="products"
            option-label="name"
            option-value="id"
            placeholder="Выберите товары"
        />
        <p v-if="errors.products" class="text-sm text-red-500">{{ errors.products }}</p>
      </div>

<!--      <div class="space-y-2">-->
<!--        <Label>Варианты товаров</Label>-->
<!--        <MultiSelect-->
<!--            v-model="modelValue.product_variants"-->
<!--            :options="productVariants"-->
<!--            option-label="name"-->
<!--            option-value="id"-->
<!--            placeholder="Выберите варианты"-->
<!--        />-->
<!--      </div>-->
    </template>

    <!-- Категории -->
<!--    <template v-if="modelValue.discount_type === 'category'">-->
<!--      <div class="space-y-2">-->
<!--        <Label>Категории</Label>-->
<!--        <MultiSelect-->
<!--            v-model="modelValue.categories"-->
<!--            :options="categories"-->
<!--            option-label="name"-->
<!--            option-value="id"-->
<!--            placeholder="Выберите категории"-->
<!--        />-->
<!--        <p v-if="errors.categories" class="text-sm text-red-500">{{ errors.categories }}</p>-->
<!--      </div>-->
<!--    </template>-->
  </div>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import MultiSelect from '@/components/common/MultiSelect.vue'
import {Discount} from "@/models/Discount";

defineProps({
  modelValue: {
    type: Discount,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  products: {
    type: Array,
    default: () => []
  },
  productVariants: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})
</script>