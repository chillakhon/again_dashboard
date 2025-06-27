<template>
  <div class="space-y-6">
    <!-- Заголовок и кнопки -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
<!--        <h1 class="text-2xl font-bold text-gray-900">Задачи по заказам</h1>-->
        <p class="text-sm text-gray-500 mt-1">Активные и завершенные задачи</p>
      </div>
      <router-link
          to="/orders/tasks/create"
          class="w-full sm:w-auto"
      >
        <Button class="gap-2">
          <Plus class="h-4 w-4" />
          Новая задача
        </Button>
      </router-link>
    </div>

    <!-- Контент -->
    <Loader v-if="isLoading" class="py-8"/>

    <div v-else class="space-y-4">
      <!-- Таблица -->
      <div class="  ">
        <AgGridTable
            :key="renderTable"
            :cols-ag="colDefs"
            :data-ag="orderTasks"
            title="Задачи"
            class="min-h-[400px]"
        />
      </div>

      <!-- Пагинация -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div class="text-sm text-gray-500">
          Показано {{ orderTasks.length }} из {{ totalItems }} задач
        </div>
        <PaginationTable
            :total="totalItems"
            :default-page="currentPage"
            :items-per-page="itemsPerPage"
            :sibling-count="1"
            :show-edges="true"
            @current-page="currentPage = $event; fetchData($event)"
            class="mt-0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import axios from "axios"
import { toast } from 'vue-sonner'
import { useRouter, useRoute } from "vue-router"
import { Button } from '@/components/ui/button'
import Loader from "@/components/common/Loader.vue"
import PaginationTable from "@/components/PaginationTable.vue"
import OrderTask from "@/models/OrderTask"
import { useDateFormat } from "@/composables/useDateFormat"

const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const renderTable = ref(0)
const orderTasks = ref<OrderTask[]>([])

const totalItems = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Функция для форматирования статуса
const formatStatus = (status: boolean, inProgress: boolean) => {
  if (status) return { class: 'bg-green-100 text-green-800', label: 'Завершено' }
  if (inProgress) return { class: 'bg-blue-100 text-blue-800', label: 'В работе' }
  return { class: 'bg-amber-100 text-amber-800', label: 'Ожидание' }
}

const colDefs = ref([
  {
    headerName: "№ заказа",
    field: "order",
    valueGetter: params => params.data.order?.id ?? '-',
    headerClass: 'font-semibold',
    cellClass: 'font-medium text-gray-900',
    width: 120
  },
  {
    headerName: "Срок исполнения",
    field: "due_date",
    valueGetter: params => useDateFormat().formatDateToRussian(params.data.due_date, true),
    headerClass: 'font-semibold',
    cellClass: params => {
      const isOverdue = new Date(params.data.due_date) < new Date() && !params.data.completed
      return isOverdue ? 'text-red-500' : 'text-gray-600'
    },
    width: 160
  },
  {
    headerName: "Дата создания",
    field: "created_at",
    valueGetter: params => useDateFormat().formatDateToRussian(params.data.created_at, true),
    headerClass: 'font-semibold',
    cellClass: 'text-gray-600',
    width: 160
  },
  {
    headerName: "Описание задачи",
    field: "description",
    headerClass: 'font-semibold',
    cellClass: 'text-blue-600 hover:underline cursor-pointer',
    minWidth: 200,
    flex: 1,
    tooltipField: 'description',
    valueGetter: params => params.data.description || 'Без описания'
  },
  {
    headerName: "Исполнитель",
    field: "assignee.name",
    headerClass: 'font-semibold',
    cellClass: 'text-gray-600',
    width: 160,
    valueGetter: params => params.data.assignee?.name || 'Не назначено'
  },
  {
    headerName: "Автор",
    field: "creator.name",
    headerClass: 'font-semibold',
    cellClass: 'text-gray-600',
    width: 160
  },
  {
    headerName: "Статус",
    field: "status",
    headerClass: 'font-semibold',
    width: 140,
    cellClass: params => formatStatus(params.data.completed, params.data.in_progress).class,
    valueGetter: params => formatStatus(params.data.completed, params.data.in_progress).label
  }
])

onMounted(async () => {
  await fetchData(currentPage.value)
})

async function fetchData(curPage: any) {
  isLoading.value = true
  try {
    const res = await axios.get(`tasks?page=${curPage}&per_page=${itemsPerPage.value}`)
    orderTasks.value = res.data.tasks?.map((task: any) => new OrderTask(task))
    totalItems.value = res.data?.total ?? 0
    renderTable.value++
  } catch (error) {
    toast.error("Ошибка загрузки задач", {
      description: error.message
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
:deep(.ag-header-cell) {
  @apply bg-gray-50 text-gray-600;
}

:deep(.ag-cell) {
  @apply py-2;
}

:deep(.ag-row:hover) {
  @apply bg-gray-50/50;
}
</style>