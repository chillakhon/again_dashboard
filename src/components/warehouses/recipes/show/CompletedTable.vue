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
import {PropType} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {CreateRecipeComponent} from "@/models/CreateRecipeComponent";

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
    accessorKey: "output.name",
    header: "Готовая продукция",
  },

  {
    accessorKey: "quantity",
    header: "Норма",
    cell: ({row}) => {
      // return 231
      return Math.trunc(row.original?.quantity) || Math.trunc(row.original?.qty)
    },
  },
  {
    accessorKey: "quantity",
    header: "Запланировано",
    cell: ({row}) => {
      let qty = ` ${ Math.trunc(row.original?.qtyInit || row.original?.qtyInitQuantity ||
          Math.trunc(row.original?.qty) || Math.trunc(row.original?.quantity) )} шт`
      // return 231
      // console.log(row.original)
      return qty
    },
  },
];


</script>

<style scoped></style>