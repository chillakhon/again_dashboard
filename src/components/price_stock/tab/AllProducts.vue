<template>
  <div class="rounded-md border">
    <products-table
        :products="products"
    />
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">

    <div class="space-x-2">
      <PaginationTable
          :total="totalItems"
          :default-page="currentPage"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          :show-edges="true"
          @current-page="currentPage = $event; fetchData()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import PaginationTable from "@/components/PaginationTable.vue";
import axios from "axios";
import Product from "@/models/Product";
import ProductsTable from "@/components/price_stock/ProductsTable.vue";

// const props = defineProps({
//   cart: Cart,
// })

const isLoading = ref(true)

const products = ref<Product[]>()

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);


onMounted(async () => {
  await fetchData()
})


async function fetchData() {
  isLoading.value = true
  await axios.get(`products?page=${currentPage.value}`)
      .then(res => {
        products.value = res.data?.data.map(item => new Product(item))
        totalItems.value = res.data?.total ?? 0
      })
      .finally(() => {
        isLoading.value = false
      })
}

</script>

<style scoped>

</style>
