<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">

    <div class="flex max-md:flex-col justify-between">

      <ProductSearch
          class="md:w-[400px]"
          :filter="paramsSearch"
      />

      <router-link to="/products/create">
        <Button variant="outline">Добавить</Button>
      </router-link>

    </div>

    <div class="flex items-center pb-2 justify-between">

    </div>
    <div v-if="data.length && data.length > 0">

      <ProductListTable
          :key="renderTable"
          :items="data"
      />

      <div class="flex items-center justify-end space-x-2 py-4">
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
import {ref, onMounted} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import Loader from "@/components/common/Loader.vue";
import Button from "@/components/ui/button/Button.vue";
import {useRouter} from "vue-router";
import ProductSearch from "@/components/products/list/ProductSearch.vue";
import ProductListTable from "@/components/products/list/ProductListTable.vue";
import {useProductFunctions} from "@/composables/useProductFunctions";

const router = useRouter()

const data = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const isLoading = ref(true)
const renderTable = ref(0)


const paramsSearch = {
  search: '',
}


const {getProducts} = useProductFunctions()


// async function deleteProduct(id) {
//   await axios.delete(`products/${id}`)
//       .then(res => {
//         toast("Удалено!", {
//           description: "Товар был успешно удалён.",
//           action: {
//             label: "Ок",
//           },
//         });
//         fetchData(currentPage.value)
//       })
//       .catch(err => {
//         toast("Ошибка!", {
//           description: `Не удалось удалить товар: ${err.message}`,
//           action: {
//             label: "Ок",
//           },
//         });
//       });
// }


onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  data.value = await getProducts({
    per_page: itemsPerPage.value,
    page: currentPage.value,
    paginate: true,
    admin: true
  })
      .then(res => {
        totalItems.value = res.meta.total;
        return res.data;
      })
      .finally(() => isLoading.value = false);
}

</script>
