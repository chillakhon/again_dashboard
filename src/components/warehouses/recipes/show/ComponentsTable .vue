<template>
  <DynamicsDataTable
      v-if="components?.length"
      :data="components"
      :columns="columns"
      :custom-actions="true"
      :loading="loading"
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
    accessorKey: "component_type",
    header: "Тип компонента",
    cell: (row) => {
      const type = row.getValue();
      switch(type) {
        case 'Product': return 'Продукт';
        case 'ProductVariant': return 'Вариант продукта';
        case 'Material': return 'Материал';
        default: return type;
      }
    }
  },
  {
    accessorKey: "component_id",
    header: "ID компонента",
  },
  {
    accessorKey: "quantity",
    header: "Количество",
  },
  {
    accessorKey: "unit_id",
    header: "ID единицы измерения",
  },
  {
    accessorKey: "isActive",
    header: "Активен",
    cell: (row) => {
      return row.getValue()
          ? h(Check, {class: "h-4 w-4 text-green-500"})
          : h(X, {class: "h-4 w-4 text-red-500"});
    },
  },
];

</script>

<style scoped></style>