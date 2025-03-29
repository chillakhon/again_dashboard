<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">
    <div class="flex items-center pb-4 justify-between">
      <!--      <router-link to="/products/create">-->
      <!--        <Button>Добавить товар</Button>-->
      <!--      </router-link>-->
    </div>
    <div>
      <div class="">
        <AgGridTable
            :key="renderTable"
            :cols-ag="colDefs"
            :data-ag="orders"
            title="Заказы"
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
    <!--    <div v-else class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">-->
    <!--      <h3 class="text-3xl font-extrabold text-gray-500 sm:text-4xl">Ничего не найдено</h3>-->
    <!--    </div>-->
  </div>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import PaginationTable from "@/components/PaginationTable.vue";
import axios from "axios";
import Loader from "@/components/common/Loader.vue";
import AgGridTable from "@/components/AgGridTable.vue";
import {toast} from 'vue-sonner'
import {useRouter} from "vue-router";
import Order from "@/models/Order"

const router = useRouter()

const isLoading = ref(true)
const renderTable = ref(0)
const orders = ref<Order[]>([])

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);


const colDefs = ref([
  {headerName: "No", field: "id", maxWidth: 100},
  {headerName: "Создан ", field: "created_at"},
  {headerName: "Доставить", field: "delivery_date"},
  {headerName: "Сумма", field: "total_amount"},
  {headerName: "ФИО получателя", field: "client.full_name"},
  {
    headerName: "Статус", field: "status", cellRenderer: params => {
      const ord = new Order(params.data)
      const {label, color} = ord.getStatusInfo();

      return `
      <span style="
        background: ${color};
        color: white;
        padding: 6px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        min-width: 80px;
      ">
        ${label}
      </span>
    `;
    }
  },
  {
    headerName: "Оплата", field: "payment_status",
    cellRenderer: params => {
      const ord = new Order(params.data)
      return ord.getPaymentStatusLabel()
    }
  },
  {headerName: "Доставка", field: "delivery_target"},
  {headerName: "Ответственный", field: ""},
  // {
  //   headerName: "Действия",
  //   field: "actions",
  //   maxWidth: 120,
  //   cellRenderer: (params) => {
  //     const button = document.createElement("button");
  //     button.innerText = "Удалить";
  //     button.style.color = "red";
  //     button.style.cursor = "pointer";
  //     button.onclick = () => {
  //       if (confirm("Вы уверены, что хотите удалить этот товар?")) {
  //         deleteProduct(params.data.id)
  //       }
  //     };
  //     return button;
  //   },
  // },
]);


onMounted(async () => {
  await fetchData(currentPage.value)
})

async function deleteProduct(id) {
  await axios.delete(`products/${id}`)
      .then(() => {
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
  await axios.get(`orders?page=${curPage}&per_page=${itemsPerPage.value}`)
      .then(res => {
        orders.value = res.data.orders?.map((order: any) => Object.assign(new Order({}), order));
        totalItems.value = res.data?.total ?? 0
        renderTable.value++
      })
      .finally(() => {
        isLoading.value = false
      })
}

</script>
