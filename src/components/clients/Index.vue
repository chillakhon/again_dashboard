<template>
  <Loader v-if="isLoading"/>
  <div v-else>
    <div class="md:flex justify-between md:mb-2">
      <BackButton title="Все клиенты"/>
      <ClientsAdd
          class="max-md:my-2"
          @submit="fetchData()"
      />
    </div>
    <ClientsTable
        :clients="clients"
        @deleted="deleteClient($event)"
        @updated="fetchData"
        :key="clients.length"
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

const clients = ref<Client[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(15);

const deleteClient = (client: Client) => {
  clients.value = clients.value.filter(
      (item) => item.id !== client.id
  );
};

async function fetchData() {
  isLoading.value = true;

  try {
    const response = await axios.get(
        `/clients?page=${currentPage.value}&per_page=${itemsPerPage.value}`
    );

    if (response.data?.clients) {
      clients.value = response.data.clients.data.map((item: any) => Client.fromJSON(item));
      totalItems.value = response.data.clients.total;
      console.log(clients.value)
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
    clients.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>