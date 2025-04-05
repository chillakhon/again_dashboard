<template>
<loader v-if="isLoading"/>

  <div v-else>
    <div class="w-full">
      <ReviewsTable :reviews="reviewsData" />
    </div>
    <div class="flex items-center justify-end space-x-2 py-4">
<!--      <Button @click="saveProduct">Сохранить</Button>-->

      <div class="space-x-2">
        <PaginationTable
            :total="totalItems"
            :default-page="currentPage"
            :items-per-page="itemsPerPage"
            :sibling-count="1"
            :show-edges="true"
            @current-page="currentPage = $event;"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {h, nextTick, onMounted, ref} from "vue";
import PaginationTable from "@/components/PaginationTable.vue";
import axios from "axios";
import Product from "@/models/Product";
import {Button} from "@/components/ui/button/index";
import {toast} from 'vue-sonner'
import Loader from "@/components/common/Loader.vue";
import ReviewsTable from "@/components/products/reviews/ReviewsTable.vue";


const reviewsData = [
  {
    id: '1',
    product: 'Save AGAIN',
    status: 'published',
    author: {
      name: 'Маргарита',
      email: 'me.kotova22@gmail.com'
    },
    rating: 5,
    comment: 'Удобство, особенно когда постоянно не дома - в общественных туалетах менять тампоны то ещё удовольствие. Ну и трусики 6 капель - ночью не переживаю что тампон/прокладка протекут.',
    createdAt: '2025-03-31T05:45:00',
    publishedAt: '2025-04-01T10:30:00'
  },
  {
    id: '2',
    product: 'Body AGAIN',
    status: 'imported',
    author: {
      name: 'Юлия',
      email: 'Chance-85@mail.ru'
    },
    rating: 4,
    comment: 'Очи очень удобны, практически как обычное белье, особенно ночью не протекают',
    createdAt: '2025-03-30T15:20:00',
    publishedAt: '2025-04-02T09:15:00'
  },

  {
    id: '2',
    product: 'Body AGAIN testing',
    status: 'pending',
    author: {
      name: 'Петров',
      email: 'prtrov-85@mail.ru'
    },
    rating: 4,
    comment: 'Очи очень удобны, практически как обычное белье, особенно ночью не протекают',
    createdAt: '2025-03-30T15:20:00',
    publishedAt: '2025-04-02T09:15:00'
  }
]



const isLoading = ref(true)

const products = ref<Product[]>()

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);


onMounted(async () => {
  // await fetchData()
  await nextTick()
  isLoading.value = false
})
//
//
// async function fetchData() {
//   isLoading.value = true
//   await axios.get(`products?page=${currentPage.value}`)
//       .then(res => {
//         products.value = res.data?.data.map(item => new Product(item))
//         totalItems.value = res.data?.total ?? 0
//       })
//       .finally(() => {
//         isLoading.value = false
//       })
// }

async function saveProduct() {
  toast.info('Сервер еще в разработке. Скоро будет доступно!')
}


</script>

<style scoped>

</style>
