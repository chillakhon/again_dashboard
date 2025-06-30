<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">

    <div class="flex max-md:flex-col justify-between mb-2 max-md:space-y-2">
      <DiscountSearch
          class="md:w-[400px]"
          :filter="paramsSearch"
          @search="fetchData()"
      />

      <DiscountAddModal
          :key="renderCreated"
          @created="fetchData(); renderCreated++"
      />

    </div>

    <DiscountListTable
        :key="renderTable"
        :items="data"
        @deleted="fetchData()"
        @updated="fetchData()"
    />

    <PaginationTable
        class="flex justify-end w-full"
        :total="totalItems"
        :default-page="currentPage"
        :items-per-page="itemsPerPage"
        :sibling-count="1"
        :show-edges="true"
        @current-page="currentPage = $event; fetchData()"
    />

  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import Loader from "@/components/common/Loader.vue";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";
import {Category} from "@/models/Category";
import DiscountSearch from "@/components/discount/DiscountSearch.vue";
import DiscountAddModal from "@/components/discount/DiscountAddModal.vue";
import DiscountListTable from "@/components/discount/DiscountListTable.vue";
import {useDiscountFunctions} from "@/composables/useDiscountFunctions";

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

const {getDiscounts} = useDiscountFunctions()

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  data.value = await getDiscounts({
    per_page: itemsPerPage.value,
    page: currentPage.value,
    paginate: true,
    name: paramsSearch.value.search,
  })
      .then(res => {
        totalItems.value = res?.meta.count
        return res?.data
      })

  isLoading.value = false
  renderTable.value++
}


</script>
