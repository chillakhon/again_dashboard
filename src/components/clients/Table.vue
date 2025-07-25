<template>
  <DynamicsDataTable
      v-if="clients?.length"
      :data="clients"
      :columns="columns"
      :edit="edit"
      :loading="loading"
      @save_changes="handlingUpdate($event)"
      @deleted="
      useClientFunctions().deleteClient($event.id);
      emits('deleted', $event);
    "
  />
</template>

<script setup lang="ts">
import ClientsEdit from '@/components/clients/Edit/Index.vue'
import {Check, X} from "lucide-vue-next";
import {h, PropType, ref} from "vue";
import {useClientFunctions} from "@/composables/useClientFunctions";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {Client} from "@/models/Client";

const props = defineProps({
  clients: {
    type: Array as PropType<Client[]>,
    default: () => []
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);


async function handlingUpdate(data: Client) {
  console.log(data);
  // return

  await useClientFunctions().updateClient(data)
  emits('updated')
}


const edit = ref({
  title: "Редактирование клиента",
  description: "Измените данные клиента",
  component: ClientsEdit,
  loader: false,
});

const columns = [
  {
    accessorKey: "id",
    header: "No",
    cell: (cell: any) => {
      return (cell.row.index += 1);
    },
  },
  {
    accessorKey: "profile.fullName",
    header: "Клиент",
    cell: (row: any) => {
      return row.row.original.profile?.fullName || '—';
    }
  },
  {
    accessorKey: "profile.phone",
    header: "Телефон",
    cell: (row: any) => {
      return row.row.original.profile?.phone || '—';
    }
  },
  {
    accessorKey: "email",
    header: "Почта",
  },
  {
    accessorKey: "bonus_balance",
    header: "Бонусный баланс",
    cell: (row: any) => {
      return parseFloat(row.getValue()).toFixed(2);
    }
  },
  {
    accessorKey: "created_at",
    header: "Дата регистрации",
    cell: (row: any) => {
      return new Date(row.getValue()).toLocaleDateString();
    }
  },
  {
    accessorKey: "isActive",
    header: "Активен",
    cell: (row: any) => {
      return row.getValue()
          ? h(Check, {class: "h-4 w-4 text-green-500"})
          : h(X, {class: "h-4 w-4 text-red-500"});
    },
  },
];
</script>

<style scoped></style>