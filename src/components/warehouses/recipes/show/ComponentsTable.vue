<template>
  <DynamicsDataTable
      v-if="components?.length"
      :data="components"
      :columns="columns"
      :custom-actions="true"
      :loadingL A="loading"
  />
</template>

<script setup lang="ts">
import {h, PropType, ref} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {CreateRecipeComponent} from "@/models/CreateRecipeComponent";
import {Check, X} from "lucide-vue-next";

const props = defineProps({
  components: {
    type: Array as PropType<CreateRecipeComponent[]>,
    default: () => []
  },
  loading: Boolean,
});


const columns = [
  {
    accessorKey: "id",
    header: "№",
    cell: (cell) => cell.row.index + 1,
  },
  {
    accessorKey: "product_name",
    header: "Готовая продукция",
  },

  {
    accessorKey: "quantity",
    header: "Кол-во",
    cell: ({row}) => Math.trunc(row.original?.quantity) || Math.trunc(row.original?.qty),
  },
  {
    accessorKey: "quantity",
    header: "Запланировано",
    cell: ({row}) => Math.trunc(row.original?.quantity) || Math.trunc(row.original?.qty),
  },

  // {
  //   accessorKey: "isActive",
  //   header: "Активен",
  //   cell: (row) => {
  //     return row.getValue()
  //         ? h(Check, {class: "h-4 w-4 text-green-500"})
  //         : h(X, {class: "h-4 w-4 text-red-500"});
  //   },
  // },
];


</script>

<style scoped></style>