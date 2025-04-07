<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">
    <div class="flex items-center pb-1 justify-between">
      <router-link to="/orders/tasks/create">
        <Button>Добавить задач</Button>
      </router-link>
    </div>
    <div>
      <div class="">
        <AgGridTable
            :key="renderTable"
            :cols-ag="colDefs"
            :data-ag="orderTasks"
            title="Задачи"
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
import {useRouter, useRoute} from "vue-router";
import OrderTask from "@/models/OrderTask";
import {useDateFormat} from "@/composables/useDateFormat";
import { Button } from '@/components/ui/button'

const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const renderTable = ref(0)
const orderTasks = ref<OrderTask[]>([])

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);


const colDefs = ref([
  {
    headerName: "No заказа",
    field: "order",
    cellRenderer: params => {
      return params.data.order?.id ?? '-'
    }
  },
  {
    headerName: "Срок исполнения ",
    field: "due_date",
    cellRenderer: params => {
      return useDateFormat().formatDateToRussian(params.data.due_date, true)
    }
  },
  {
    headerName: " Дата создания",
    field: "created_at",
    cellRenderer: params => {
      return useDateFormat().formatDateToRussian(params.data.created_at, true)
    }
  },

  {
    headerName: "Что сделать",
    field: "description",
    cellStyle: {
      color: "blue",
      cursor: "pointer",
    },
    minWidth: 200,
  },

  {headerName: "Назначена на", field: "assignee.name"},
  {headerName: "Кем назначена", field: "creator.name"},
]);


onMounted(async () => {
  await fetchData(currentPage.value)
  console.log(orderTasks.value)
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

  await axios.get(`tasks?page=${curPage}&per_page=${itemsPerPage.value}`)
      .then(res => {
        orderTasks.value = res.data.tasks?.map((task: any) => new OrderTask(task));
        totalItems.value = res.data?.total ?? 0
        renderTable.value++
      })
      .finally(() => {
        isLoading.value = false
      })
}

</script>
