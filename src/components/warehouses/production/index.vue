<template>
  <div class="flex justify-between mb-2 max-md:flex-wrap">
    <div class="md:w-[500px]">
      <BackButton title="Производственные задания"/>
      <!--      <CityZoneSearch-->
      <!--          @search="handleSearchEvent"-->
      <!--          :filter="searchParams"-->
      <!--      />-->
    </div>
<!--    <WarehousesProductionAdd-->
<!--        @created="fetchData()"-->
<!--    />-->

    <Button
        variant="outline"
        size="icon"
        class="w-auto px-3"
        @click="router.push('/warehouses/production/create')"
    >
      <CirclePlus class="w-3 h-3"/>
    </Button>

  </div>

</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import axios from "axios";
import {toast} from "vue-sonner";
import BackButton from "@/components/BackButton.vue";
import {CirclePlus} from "lucide-vue-next";
import {Button} from "@/components/ui/button";
import {useRouter} from "vue-router";

const data = ref()
const router = useRouter()

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
