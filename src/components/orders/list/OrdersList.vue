<template>
  <div class="flex justify-between mb-2 md:space-x-4 max-md:flex-col">
    <DynamicTitle
        title="Заказы"
        variant="primary"
    />

    <div class="w-full  flex md:space-x-2 max-md:space-y-2 max-md:flex-col">
      <OrderSearch
          :key="renderSearchComp"
          :filter="searchParams"
          @search="handleSearch"
      />

      <Button
          v-if="hasActiveFilters"
          variant="outline"
          @click="resetFilters"
      >
        <X/>
      </Button>

    </div>
  </div>

  <Loader v-if="isLoading"/>
  <OrderListTable
      v-else
      :key="renderTable"
      :items="orders"
      @deleted="fetchData()"
  />

  <PaginationTable
      class="flex justify-end"
      :total="totalItems"
      :default-page="currentPage"
      :items-per-page="itemsPerPage"
      :sibling-count="1"
      :show-edges="true"
      @current-page="currentPage = $event; fetchData()"
  />
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import Loader from "@/components/common/Loader.vue";
import {useRouter, useRoute} from "vue-router";
import Order from "@/models/Order"
import OrderListTable from "@/components/orders/list/OrderListTable.vue";
import {useOrderFunctions} from "@/composables/useOrderFunctions";
import DynamicTitle from "@/components/dynamics/DynamicTitle.vue";
import OrderSearch from "@/components/orders/list/OrderSearch.vue";
import Button from "@/components/ui/button/Button.vue";
import {X} from "lucide-vue-next"
import {useStore} from "vuex";



const store = useStore();

const searchParams = ref({
  datePicker: {
    start: '',
    end: ''
  },
  search: '',
  status: '',
})


const route = useRoute()


const hasActiveFilters = computed(() => {
  return !!searchParams.value.search || !!searchParams.value.datePicker.start || !!searchParams.value.datePicker.end || !!searchParams.value.status
})

const renderTable = ref(1)
const renderSearchComp = ref(1)


const isLoading = ref(true)
const orders = ref<Order[]>([])

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(15);


onMounted(async () => {
  await fetchData()
  await store.dispatch('notifications/markOrdersChecked');

})

const {getOrders} = useOrderFunctions()

async function fetchData() {

  isLoading.value = true

  const status = route.query?.status ? `${route.query?.status}` : searchParams.value.status ? searchParams.value.status : ''

  const result = await getOrders({
    status: status,
    paginate: true,
    page: currentPage.value,
    per_page: itemsPerPage.value,
    search: searchParams.value.search,
    date_from: searchParams.value.datePicker.start,
    date_to: searchParams.value.datePicker.end
  })

  orders.value = result?.orders ?? []
  currentPage.value = result?.meta.page ?? 1
  itemsPerPage.value = result?.meta.per_page ?? 15
  totalItems.value = result?.meta.total ?? 0

  isLoading.value = false
  renderTable.value++
}


const handleSearch = () => {
  fetchData()
}


function resetFilters() {
  searchParams.value = {
    datePicker: {
      start: '',
      end: ''
    },
    search: '',
    status: '',
  }

  currentPage.value = 1
  renderSearchComp.value++
  fetchData()
}

</script>
