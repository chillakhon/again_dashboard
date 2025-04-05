<template>
<loader v-if="isLoading"/>

  <div v-else>
    <div class="w-full">
      <products-table-stock
          :products="products"
      />
    </div>
    <div class="flex items-center justify-between space-x-2 py-4">
      <Button @click="saveProduct">Сохранить</Button>

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
  </div>
</template>

<script setup lang="ts">
import {h, onMounted, ref} from "vue";
import PaginationTable from "@/components/PaginationTable.vue";
import axios from "axios";
import Product from "@/models/Product";
import {Button} from "@/components/ui/button/index";
import {toast} from 'vue-sonner'
import Loader from "@/components/common/Loader.vue";
import ProductsTableStock from "@/components/price_stock/ProductsTableStock.vue";


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

async function saveProduct() {
  toast.info('Сервер еще в разработке. Скоро будет доступно!')
}


</script>

<style scoped>

</style>
