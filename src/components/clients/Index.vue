<template>
  <div>
    <div class="md:flex justify-between md:mb-2">
      <!--      <BackButton title="Все клиенты"/>-->

      <ClientSearch
          :filter="filters"
          @search="fetchData()"
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
        @deleted="deleteClient($event)"
        @updated="fetchData"
    />
    <div
        class="mt-2 flex justify-end"
    >
      <PaginationTable
          :items-per-page="itemsPerPage"
          :total="totalItems"
          :default-page="currentPage"
          @current-page="
          currentPage = $event;
          fetchData();
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref, onMounted} from "vue"
import PaginationTable from "@/components/PaginationTable.vue";
import ClientsTable from "@/components/clients/Table.vue";
import ClientsAdd from "@/components/clients/Add/Index.vue";
import Loader from "@/components/common/Loader.vue";
import {Client} from "@/models/Client";
import BackButton from "@/components/BackButton.vue";
import ClientSearch from "@/components/clients/ClientSearch.vue";

const clients = ref<Client[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(15);

const renderTable = ref(1)

const filters = ref({
  search: "",
})


const deleteClient = (client: Client) => {
  clients.value = clients.value.filter(
      (item) => item.id !== client.id
  );
};

async function fetchData() {

  const p = {
    page: currentPage.value,
    per_page: itemsPerPage.value,
    ...filters.value,
  }

  try {
    const response = await axios.get(`/clients`, {
      params: p
    });

    if (response.data?.clients) {
      clients.value = response.data.clients.data.map((item: any) => Client.fromJSON(item));
      totalItems.value = response.data.clients.total;
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
</script>