<template>
<!--  {{data}}-->
  <DynamicsDataTable
      :data="data"
      :columns="columns"
      :custom-actions="true"
      :loading="loading"
  >
    <template #actions="{ row }">
      <CustomActionsForDynamicTable
          :item="row?.original"
          :edit="edit"
          @save_changes="handleSaveChanges"
          @deleted="handleDelete($event.id)"
      />
    </template>
  </DynamicsDataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue"
import CustomActionsForDynamicTable from "@/components/warehouses/production/edit/CustomActionsForDynamicTable.vue"
import {BatchGet} from "@/models/BatchGet";
import {useDateFormat} from "@/composables/useDateFormat";

const props = defineProps({
  loading: Boolean,
  data: {
    type: Array as () => BatchGet,
    default: () => []
  },
  performers: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(["deleted", "updated"])

const edit = ref({
  title: "Редактирование партии",
  component: BatchGet,
  dynamicData: {
    performers: props.performers
  },
  loader: false
})

const columns = [
  {
    accessorKey: "base_batch_number",
    header: "№"
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }: any) => {
      const status = row.original?.status
      return status ? translateStatus(status) : '—'
    }
  },
  {
    accessorKey: "planned_start_datetime",
    header: "Начало произ-ва",
    cell: ({ row }: any) => useDateFormat().formatDateToRussian(row.original?.planned_start_datetime)
  },
  {
    accessorKey: "planned_end_datetime",
    header: "Завершение произ-ва",
    cell: ({ row }: any) => row.original?.planned_end_datetime ?
        useDateFormat().formatDateToRussian(row.original?.planned_end_datetime) :
        'Произ-ва не завершено'
  },
  {
    accessorKey: "performers",
    header: "Исполнители",
    cell: ({ row }: any) => {
      const performers = row.original?.performers
      return performers?.map(p => p.email).join(', ') || '—'
    }
  }
]

function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'in_progress': 'В процессе',
    'planned': 'Запланировано',
    'completed': 'Завершено',
    'cancelled': 'Отменено'
  }
  return statusMap[status] || status
}



const handleDelete = async (id: number) => {
  // Implement batch deletion logic here
  // const success = await useBatchFunctions().deleteBatch(id)
  // if (success) emits("deleted")
}

const handleSaveChanges = async (data: BatchGet) => {
  // Implement batch update logic here
  // const success = await useBatchFunctions().updateBatch(data.toJSON())
  // if (success) emits("updated")
}
</script>