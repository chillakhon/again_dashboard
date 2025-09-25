<template>
  <div>

    <div class="flex max-md:flex-col justify-between mb-2 max-md:space-y-2">
      <PromoProductSearch
          class="md:w-[400px]"
          :filter="paramsSearch"
          @search="handleSearch"
      />

      <ProductListForPromoModal
          :selected-list="data"
          @addToSelectList="addProductToData"
      />

    </div>
    <Loader v-if="isLoading"/>
    <PromoProductListTable
        v-else
        :key="renderTable"
        :items="data"
        :selected-list="data"
        @remove-to-select-list="removeProductFromData"
    />
    <div class="flex items-center justify-end space-x-2 py-1">
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
import {ref, onMounted, watch} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import Loader from "@/components/common/Loader.vue";
import PromoProductListTable from "@/components/discount/Promo/promo_product/PromoProductListTable.vue";
import PromoProductSearch from "@/components/discount/Promo/promo_product/PromoProductSearch.vue";
import {usePromoCodeProductFunctions} from "@/composables/usePromoCodeProductFunctions";
import {Product} from "@/models/Product";
import ProductListForPromoModal from "@/components/discount/Promo/promo_product/ProductListForPromoModal.vue";
import {PromoCode} from "@/models/PromoCode";


const props = defineProps({
  promoCode: {
    type: PromoCode,
    required: false,
  },
})

const data = ref<Product[]>(props.promoCode?.selected_products ?? []);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const isLoading = ref(false)
const renderTable = ref(1)


const paramsSearch = ref({
  search: '',
})

const {getProductsByPromoCode} = usePromoCodeProductFunctions()

onMounted(async () => {

  // if (!props.promoCode?.id) {
  //   isLoading.value = false;
  //   return
  // }
  // await fetchData()
})

async function fetchData() {

  isLoading.value = true
  data.value = await getProductsByPromoCode({
    promo_code_id: 4,
  }) ?? []


  isLoading.value = false
  renderTable.value++
}


const handleSearch = async () => {
  currentPage.value = 1;
  await fetchData()
}


const removeProductFromData = (p: Product) => {
  data.value = data.value.filter((item: Product) => item.id !== p.id)
  renderTable.value++
}

const addProductToData = (p: Product) => {
  const find = data.value.find((item: Product) => item.id === p.id)
  if (!find) {
    data.value.push(p)
    renderTable.value++
  }
}
</script>
