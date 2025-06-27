<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">

    <div class="flex max-md:flex-col justify-between mb-2 max-md:space-y-2">
      <CategorySearch
          class="md:w-[400px]"
          :filter="paramsSearch"
          @search="fetchData()"
      />

      <CategoryAddModal
          :key="renderCreated"
          @created="fetchData(); renderCreated++"
      />

    </div>

    <CategoryListTable
        :key="renderTable"
        :items="data"
        @deleted="fetchData()"
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

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import Loader from "@/components/common/Loader.vue";
import CategorySearch from "@/components/category/CategorySearch.vue";
import CategoryListTable from "@/components/category/CategoryListTable.vue";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";
import {Category} from "@/models/Category";
import CategoryAddModal from "@/components/category/CategoryAddModal.vue";

const data = ref<Category[]>();
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const isLoading = ref(true)
const renderTable = ref(1)
const renderCreated = ref(1)


const paramsSearch = ref({
  search: '',
})

const {getCategories} = useCategoryFunctions()

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  data.value = await getCategories({
    per_page: itemsPerPage.value,
    page: currentPage.value,
    paginate: true,
    name: paramsSearch.value.search,
  })

  isLoading.value = false
  renderTable.value++
}


</script>
