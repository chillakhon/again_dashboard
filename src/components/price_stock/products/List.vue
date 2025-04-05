<template>
  <div>
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


    <AllProducts
        v-if="paginationType == 'all'"
    />


  </div>
</template>

<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {ref} from 'vue'
import Product from "@/models/Product";
import AllProducts from "@/components/price_stock/tab/AllProducts.vue";

// defineEmits([
//   'updated'
// ])
// defineProps({
//   product: Product
// })

const searchProduct = ref<string>('')

const paginationType = ref('all')

async function handleSearch() {
  if (!searchProduct.value) return
  paginationType.value = 'filterByName'
}




</script>
