<template>
  <div class="flex justify-between mb-2 max-md:flex-wrap">
    <div class="md:w-[500px]">
      <BackButton title="Производственные задания"/>
      <!--      <CityZoneSearch-->
      <!--          @search="handleSearchEvent"-->
      <!--          :filter="searchParams"-->
      <!--      />-->
    </div>
    <WarehousesProductionAdd
        @created="fetchData()"
    />
  </div>

  <!--  <div>-->
  <!--    <Loader v-if="isLoading"/>-->
  <!--    <CityZoneTable-->
  <!--        v-else-->
  <!--        :key="renderTable"-->
  <!--        :data="cityZones"-->
  <!--        @deleted="fetchData();"-->
  <!--        @updated="fetchData();"-->
  <!--    />-->
  <!--    <div v-show="!isLoading" class="w-full flex justify-end mt-1">-->
  <!--      <PaginationTable-->
  <!--          :total="totalItems"-->
  <!--          :default-page="currentPage"-->
  <!--          :items-per-page="itemsPerPage"-->
  <!--          :sibling-count="1"-->
  <!--          :show-edges="true"-->
  <!--          @current-page="page => { currentPage = page; fetchData(); }"-->
  <!--      />-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import axios from "axios";
import {toast} from "vue-sonner";
import Loader from "@/components/common/Loader.vue";
import WarehousesProductionAdd from "@/components/warehouses/production/Add/Index.vue";
import PaginationTable from "@/components/PaginationTable.vue";
import BackButton from "@/components/BackButton.vue";

const data = ref()

const isLoading = ref(true);
const renderTable = ref(1);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(15);


// Объект для параметров поиска
const searchParams = ref({
  search: '',
});

// Массив для данных городских зон
const cityZones = ref<[]>([]);

onMounted(async () => {
  // await fetchData();
});

async function fetchData() {
  isLoading.value = true;
  try {
    let response;

    if (searchParams.value.search) {
      response = await axios.get(
          `/city-zone/name/${encodeURIComponent(searchParams.value.search)}?page=${currentPage.value}&per_page=${itemsPerPage.value}`
      );
      totalItems.value = response.data.meta.count || cityZones.value.length;
    } else {
      response = await axios.get(
          `/city-zone?page=${currentPage.value}&per_page=${itemsPerPage.value}`
      );
      // data.value = response.data.data
      totalItems.value = response.data.meta.count || cityZones.value.length;
    }

    if (!response.data.data?.length) {
      toast.error('Записи не найдены');
      return
    }

    cityZones.value = response.data.data.map((item: any) => {
      return item
    });

  } catch (error: any) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
    renderTable.value++;
  }
}

function handleSearchEvent() {
  currentPage.value = 1;
  fetchData();
}
</script>
