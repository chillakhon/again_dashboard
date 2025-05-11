<template>
  <DynamicsDataTable
      :data="data"
      :columns="columns"
      :custom-actions="true"
      :loading="loading"
  >
    <template #actions="{ row }">
      <CityZoneEditCustomActionsForDynamicTable
          v-if="row?.original"
          :item="row.original"
          :edit="edit"
          @save_changes="handleSaveChanges"
          @deleted="handleDelete($event.id)"
          @arrow_right="console.log($event)"
      />
    </template>
  </DynamicsDataTable>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {CityZone} from "~/services/CityZone"
import CityZoneEdit from "@/components/city_zone/edit/index.vue"
import {useCityZoneFunctions} from "~/composables/useCityZoneFunctions"

const props = defineProps({
  loading: Boolean,
  data: {
    type: Array as () => CityZone[],
    default: () => []
  },
  deliverers: {
    type: Array,
    default: () => []
  },
  applicants: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(["deleted", "updated"])

const edit = ref({
  title: "Редактирование зоны",
  component: CityZoneEdit,
  dynamicData: {
    deliverers: props.deliverers,
    applicants: props.applicants
  },
  loader: false
})

const columns = [
  {
    accessorKey: "id",
    header: "No",
    cell: (cell: any) => cell.row.index + 1
  },
  {
    accessorKey: "zone",
    header: "Название"
  },
  {
    accessorKey: "applicant",
    header: "Торговый агент ",
    cell: ({row}: any) => row.original?.applicant?.name || '—'
  },
  {
    accessorKey: "deliverer",
    header: "Доставщик",
    cell: ({row}: any) => row.original?.deliverer?.name || '—'
  }
]

const handleDelete = async (id: number) => {
  const success = await useCityZoneFunctions().deleteCityZone(id)
  if (success) emits("deleted")
}

const handleSaveChanges = async (data: CityZone) => {
  const success = await useCityZoneFunctions().updateCityZone(data.toJSON())
  if (success) emits("updated")
}
</script>
