<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">
    <div class="flex items-center pb-4 justify-between">
      <router-link to="/products/create">
        <Button>Добавить товар</Button>
      </router-link>
    </div>
    <div v-if="data.length && data.length > 0">
      <div class="">
        <AgGridTable
            :key="renderTable"
            :cols-ag="colDefs"
            :data-ag="data"
            :treeData="true"
            :auto-group-column-def="autoGroupColumnDef"
            tree-data-children-field="variants"
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
              @current-page="currentPage = $event; fetchData($event)"
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
import {ref, onMounted} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import axios from "axios";
import Loader from "@/components/common/Loader.vue";
import Button from "@/components/ui/button/Button.vue";
import AgGridTable from "@/components/AgGridTable.vue";
import {toast} from 'vue-sonner'
import {useRouter} from "vue-router";
import product from "@/models/Product";

const router = useRouter()

const data = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isLoading = ref(true)
const renderTable = ref(0)

const back_url = process.env.VUE_APP_BASE_URL

const colDefs = ref([
  {
    headerName: "Фото",
    field: "images",
    maxWidth: 100,
    cellRenderer: (params) => {
      return `<img src="${back_url}/products/${params.data.product_id ?? params.data.id}/image?path=${params.data.image_path}" class="border border-green-400 rounded-lg" style="width: 50px; height: 38px; object-fit: cover; border-radius: 5px;"  alt=""/>`;
    },
  },

  {
    headerName: "Название",
    field: "name",
    cellStyle: {color: "blue", cursor: "pointer"},
    onCellClicked: (params) => {
      router.push(`/product/update/${params.data.product_id ?? params.data.id}`);
    }
  },

  {headerName: "Остаток", field: "stock_quantity"},
  {headerName: "Цена", field: "cost_price"},
  {headerName: "Цена до скидки", field: "price"},
  {headerName: "Штрих-код", field: "barcode"},
  {headerName: "Себестоимость", field: "Себестоимость"},
  {headerName: "Артикул", field: "sku"},
  {
    headerName: "Габариты",
    field: "dimensions",
    valueGetter: (params) => {
      const {length, width, height} = params.data;
      return [length, width, height].filter(Boolean).join(" x ") || "";
    }
  },
  {headerName: "Вес", field: "weight"},
  {headerName: "Опции", field: "options_"},
  // {headerName: "Характеристики", field: "description"},
  {headerName: "Описание", field: "description"},
  {
    headerName: "Действия",
    field: "actions",
    maxWidth: 120,
    cellRenderer: (params) => {
      const button = document.createElement("button");
      button.innerHTML = `
  <svg class="lucide lucide-trash2-icon lucide-trash-2 text-red-300 hover:text-red-400 trandition"
  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
`;

      button.onclick = () => {
        if (confirm("Вы уверены, что хотите удалить этот товар?")) {
          deleteProduct(params.data.id);
        }
      };

      return button;

    }
  },
]);


const autoGroupColumnDef = ref({
  headerName: "Артикул",
  field: "variants",
  cellRendererParams: {
    innerRenderer: () => `<span class="text-blue-400">Вариантов:</span>`
  },
})

onMounted(() => {
  fetchData(currentPage.value)
})

async function deleteProduct(id) {
  await axios.delete(`products/${id}`)
      .then(res => {
        toast("Удалено!", {
          description: "Товар был успешно удалён.",
          action: {
            label: "Ок",
          },
        });
        fetchData(currentPage.value)
      })
      .catch(err => {
        toast("Ошибка!", {
          description: `Не удалось удалить товар: ${err.message}`,
          action: {
            label: "Ок",
          },
        });
      });
}


async function fetchData(curPage: any) {
  isLoading.value = true
  await axios.get('products', {
    params: {
      page: curPage
    }
  })
      .then(res => {
        data.value = res.data?.data
        totalItems.value = res.data?.total ?? 0
        renderTable.value++
      })
      .finally(() => {
        isLoading.value = false
      })
}

</script>
