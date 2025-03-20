<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">
    <div class="flex items-center pb-4 justify-between">
      <!--      <Input-->
      <!--          class="max-w-sm"-->
      <!--          placeholder="Поиск по название..."-->
      <!--      />-->
      <router-link to="/products/create">
        <Button>Добавить товар</Button>
      </router-link>

    </div>
    <div v-if="data.length && data.length > 0">
      <div class="">
        <AgGridTable
            :cols-ag="colDefs"
            :data-ag="data"
            title="Все товары"
        />
      </div>
      <div class="flex items-center justify-end space-x-2 py-4">
        <div class="space-x-2">
          <PaginationTable
              :total="totalItems"
              :default-page="currentPage"
              :items-per-page="itemsPerPage"
              :sibling-count="1"
              :show-edges="true"
              @current-page="currentPage = $event;"
          />
        </div>
      </div>
    </div>
    <div v-else class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
      <h3 class="text-3xl font-extrabold text-gray-500 sm:text-4xl">Ничего не найдено</h3>
    </div>
  </div>

</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import axios from "axios";
import Loader from "@/components/common/Loader.vue";
import Button from "@/components/ui/button/Button.vue";
import AgGridTable from "@/components/AgGridTable.vue";

const columnDefs = ref([
  {
    headerName: "Aggregated (Sum)",
    aggFunc: "sum",
    field: "items",
  },
  {
    headerName: "Provided",
    field: "items",
  },
]);
const datah = [
  {
    name: 'Desktop',
    type: 'folder',
    size: 2097152,
    items: 2,
    children: [
      {
        name: 'ProjectAlpha',
        type: 'folder',
        size: 1572864,
        children: [
          {
            name: 'Proposal.docx',
            size: 512000,
            created: '2023-07-10',
            modified: '2023-08-01',
            items: 1,
          },
          {
            name: 'Timeline.xlsx',
            size: 1048576,
            created: '2023-07-12',
            modified: '2023-08-03',
            items: 1,
          },
        ],
      },
      {
        name: 'ToDoList.txt',
        size: 51200,
        created: '2023-08-05',
        modified: '2023-08-10',
        items: 1,
      },
      {
        name: 'MeetingNotes_August.pdf',
        size: 460800,
        created: '2023-08-15',
        modified: '2023-08-15',
        items: 1,
      },
    ],
  },
];

const data = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isLoading = ref(true)


const colDefs = ref([
  {headerName: "Фото", field: "photo", maxWidth: 100,},
  {headerName: "Название", field: "name"},
  // {
  //   headerName: "Артикул",
  //   field: "variants",
  //   cellRenderer: (params) => {
  //     return params.data.variants.length
  //         ? `<span style="cursor:pointer; color:blue;">▼ ${params.data.variants.length} вариантов</span>`
  //         : "—";
  //   },
  // },
  {headerName: "Параметры", field: "model"},
  {headerName: "Остаток", field: "stock_quantity"},
  {headerName: "Цена", field: "cost_price"},
  {headerName: "Старая", field: "price"},
  {headerName: "Себестоимость", field: "Себестоимость"},
]);


onMounted(() => {
  fetchData(currentPage.value)
})

async function fetchData(curPage: any) {
  await axios.get('products')
      .then(res => {
        data.value = res.data.data
      })
      .finally(() => {
        isLoading.value = false
      })
}


</script>
