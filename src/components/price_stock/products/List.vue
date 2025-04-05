<template>
  <div class="flex items-center mb-4">
    <div class="flex justify-between space-x-2 w-full">
      <div class="flex space-x-2 w-full">
        <Input
            class="max-w-sm"
            placeholder="Поиск..."
            v-model="searchProduct"
        />
        <Button @click="handleSearch">Найти</Button>
      </div>

      <!--        <div class="flex space-x-2">-->
      <!--          <Button v-if="paginationType == 'check' || paginationType == 'filterByName'"-->
      <!--                  @click="paginationType = 'serverSide'"-->
      <!--                  class="bg-red-500 hover:bg-red-400">Все товары-->
      <!--          </Button>-->
      <!--          <Button @click="paginationType = 'check'" class="">Чек</Button>-->
      <!--        </div>-->
    </div>
  </div>

  <Price
      v-if="paginationType == 'price'"
  />

  <AllProducts
      v-if="paginationType == 'all'"
  />

  <Stock
      v-if="paginationType == 'stock'"
  />

</template>

<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {computed, ref} from 'vue'
import AllProducts from "@/components/price_stock/tab/AllProducts.vue";
import Price from "@/components/price_stock/tab/Price.vue";
import Stock from "@/components/price_stock/tab/Stock.vue";


const props = defineProps({
  tab: String,
})

const searchProduct = ref<string>('')

let paginationType = computed(() => props.tab)

async function handleSearch() {
  if (!searchProduct.value) return
  // paginationType = 'filterByName'
}


</script>
