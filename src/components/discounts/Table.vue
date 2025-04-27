<template>
<!--  {{discounts}}-->
  <DynamicsDataTable
      :data="discounts"
      :columns="columns"
      :loading="loading"
      @save_changes="handlingUpdate($event)"
      @deleted="
      useDiscountFunctions().deleteDiscount($event.id);
      emits('deleted', $event);
    "
  />
</template>

<script setup lang="ts">
import DiscountsEdit from '@/components/discounts/Edit/Index.vue'
import {Check, X} from "lucide-vue-next";
import {h, PropType, ref} from "vue";
import {useDiscountFunctions} from "@/composables/useDiscountFunctions";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {Discount} from "@/models/Discount";

const props = defineProps({
  discounts: {
    type: Array as PropType<Discount[]>,
    default: () => []
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

async function handlingUpdate(data: Discount) {
  await useDiscountFunctions().updateDiscount(data)
  emits('updated')
}

const edit = ref({
  title: "Редактирование скидки",
  description: "Измените параметры скидки",
  component: DiscountsEdit,
  loader: false,
});

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "type",
    header: "Тип",
    cell: (row) => {
      return row.getValue() === 'percentage' ? 'Процентная' : 'Фиксированная';
    }
  },
  {
    accessorKey: "value",
    header: "Значение",
    cell: (row) => {
      const discount = row.row.original as Discount;
      return discount.formattedValue;
    }
  },
  {
    accessorKey: "discount_type",
    header: "Применение",
    cell: (row) => {
      const types: Record<string, string> = {
        'all': 'Ко всем товарам',
        'specific': 'Конкретные товары',
        'category': 'Категории'
      };
      return types[row.getValue()] || row.getValue();
    }
  },
  {
    accessorKey: "starts_at",
    header: "Начало действия",
    cell: (row) => {
      return new Date(row.getValue()).toLocaleDateString();
    }
  },
  {
    accessorKey: "ends_at",
    header: "Окончание",
    cell: (row) => {
      return row.getValue() ? new Date(row.getValue()).toLocaleDateString() : '—';
    }
  },
  {
    accessorKey: "isActive",
    header: "Активна",
    cell: (row) => {
      const discount = row.row.original as Discount;
      return discount.isCurrentlyActive
          ? h(Check, {class: "h-4 w-4 text-green-500"})
          : h(X, {class: "h-4 w-4 text-red-500"});
    },
  },
];
</script>

<style scoped></style>