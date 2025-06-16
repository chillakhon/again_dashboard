<template>
  <DynamicsDataTable
      :data="product.variants || []"
      :columns="columns"
      :custom-actions="true"
      :show-print-button="false"
  >
    <template #actions="{row}">
      <Trash2
          @click="product.deleteProductByUuidToVariants(row.original.uuid); emits('deleted')"
          class="text-gray-400 hover:text-gray-500 transition cursor-pointer"
          :size="17"
      />

    </template>
  </DynamicsDataTable>
</template>

<script setup lang="ts">
import {Trash2} from "lucide-vue-next";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {Product} from "@/models/Product";
import {Input} from '@/components/ui/input'
import {h} from "vue"


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

  {
    accessorKey: 'price',
    header: 'Цена',
    cell: ({row}: any) => {
      return h(Input, {
        modelValue: row.original.price,
        'onUpdate:modelValue': (val: any) => {
          row.original.price = Number(val)
        },
        class: 'w-24 text-center',
        type: 'number',
        min: 0,
      })
    },
  },
  {
    accessorKey: 'price',
    header: 'Цена',
    cell: ({row}: any) => {
      return h(Input, {
        modelValue: row.original.price,
        'onUpdate:modelValue': (val: any) => {
          row.original.price = Number(val)
        },
        class: 'w-24 text-center',
        type: 'number',
        min: 0,
      })
    },
  },

];


</script>

<style scoped></style>
