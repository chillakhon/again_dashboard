<template>
  <DynamicsDataTable
      :data="product.variants || []"
      :columns="columns"
      :custom-actions="true"
      :show-print-button="false"
  >
    <template #actions="{row}">
      <!--      {{ row.original }}-->
      <Delete
          class="text-gray-400 hover:text-gray-500 transition cursor-pointer"
          :size="17"
      />

    </template>
  </DynamicsDataTable>
</template>

<script setup lang="ts">
import {Check, Delete, Pencil} from "lucide-vue-next";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {Product} from "@/models/Product";


const props = defineProps({
  product: {
    type: Product,
    required: true,
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

const columns = [
  {
    accessorKey: "id",
    header: "No",
    cell: (cell: any) => {
      return (cell.row.index += 1);
    },
  },

];


</script>

<style scoped></style>
