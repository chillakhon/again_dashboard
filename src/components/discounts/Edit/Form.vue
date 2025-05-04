<template>
  <form class="grid gap-4">
    <DiscountBasicFields
        :model-value="discount"
        :errors="errors"
        :discount-types="discountTypes"
    />

    <DiscountConditionFields
        :model-value="discount"
        :products="products"
        :product-variants="productVariants"
        :errors="errors"
    />
  </form>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import DiscountBasicFields from '@/components/discounts/Form/BasicFields.vue'
import DiscountConditionFields from '@/components/discounts/Form/ConditionFields.vue'
import {Discount} from "@/models/Discount";
import axios from "axios";

const props = defineProps({
  discount: {
    type: Object as () => Discount,
    required: true
  }
})


const errors = ref<Record<string, string>>({})
const loading = ref(false)
const discountTypes = ref([
  {value: 'percentage', label: 'Процентная'},
  {value: 'fixed', label: 'Фиксированная'}
])

const products = ref<any[]>([])
const productVariants = ref<any[]>([])

// Загрузка данных для выпадающих списков
onMounted(async () => {
  try {
    const [productsRes, variantsRes] = await Promise.all([
      axios.get('/products?type=simple&paginate=false'),
      // axios.get('/product-variants'),
    ])

    products.value = productsRes.data
    // productVariants.value = variantsRes?.data?.data || []
  } catch (error) {
    console.error('Error loading data:', error)
  }
})


</script>