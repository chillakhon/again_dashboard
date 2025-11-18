<template>
  <div>
    <div class="md:flex justify-between md:mb-2">
      <!--      <BackButton title="Все клиенты"/>-->

      <ClientSearch
          :filter="filters"
          @search="handleSearch"
      />

      <ClientsAdd
          class="max-md:my-2"
          @submit="fetchData()"
      />
    </div>
    <Loader v-if="isLoading"/>
    <ClientsTable
        v-else
        :key="renderTable"
        :clients="clients"
        :pagination="pagination"
        @deleted="deleteClient($event)"
        @updated="fetchData"
    />
    <!--    <div-->
    <!--        class="mt-2 flex justify-end"-->
    <!--    >-->
    <!--      <PaginationTable-->
    <!--          :items-per-page="itemsPerPage"-->
    <!--          :total="totalItems"-->
    <!--          :default-page="currentPage"-->
    <!--          @current-page="-->
    <!--          currentPage = $event;-->
    <!--          fetchData();-->
    <!--        "-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref, onMounted, watch} from "vue"
import PaginationTable from "@/components/PaginationTable.vue";
import ClientsTable from "@/components/clients/Table.vue";
import ClientsAdd from "@/components/clients/Add/Index.vue";
import Loader from "@/components/common/Loader.vue";
import {Client} from "@/models/Client";
import BackButton from "@/components/BackButton.vue";
import ClientSearch from "@/components/clients/ClientSearch.vue";
import {Pagination} from "@/types/Types";

const clients = ref<Client[]>([]);
const isLoading = ref(true);


const pagination = ref<Pagination>({
  page: 1,
  per_page: 15,
  total: 0,
});

const renderTable = ref(1)

const filters = ref({
  search: "",
  birth_date: {
    start: undefined,
    end: undefined,
  }
})


const deleteClient = (client: Client) => {
  clients.value = clients.value.filter(
      (item) => item.id !== client.id
  );
};

async function fetchData() {

  const p = {
    page: pagination.value.page,
    per_page: pagination.value.per_page,
    search: filters.value.search,
    birth_date_from: filters.value.birth_date.start ?? null,
    birth_date_to: filters.value.birth_date.end ?? null,
  }

  try {
    const response = await axios.get(`/clients`, {
      params: p
    });

    if (response.data?.clients) {
      clients.value = response.data.clients.data.map((item: any) => Client.fromJSON(item));
      pagination.value.total = response.data.clients.total;
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
    clients.value = [];
  } finally {
    isLoading.value = false;
    renderTable.value++
  }
}

onMounted(() => {
  fetchData();
});


const handleSearch = async () => {
  pagination.value.page = 1;
  await fetchData()
}


watch(
    () => pagination.value,
    () => {
      fetchData()
    },
    {
      deep: true,
    }
)

</script>