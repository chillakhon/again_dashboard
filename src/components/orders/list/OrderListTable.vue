<template>
  <div>
    <DynamicsDataTable
        :data="items"
        :columns="columns"
        :custom-actions="true"
        :show-print-button="true"
    >
      <template #actions="{row}">
        <IconButtons
            :buttons="[
              {
                type: 'edit',
                onClick: () => handlerEdit(row.original)
              },
              {
                type: 'delete',
                onClick: () => handleDeleted(row.original)
              },
             ]"
        />

      </template>
    </DynamicsDataTable>
  </div>
</template>

<script setup lang="ts">
import {h, PropType} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import usePermission from "@/composables/usePermission";
import {RouterLink, useRouter} from "vue-router";
import IconButtons from "@/components/dynamics/IconButtons.vue";
import Order from "@/models/Order";
import {useStatuses} from "@/composables/useStatuses";
import {useOrderFunctions} from "@/composables/useOrderFunctions";


const props = defineProps({
  items: {
    type: Array as PropType<Order[]>,
    default: () => []
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

const router = useRouter();


const handlerEdit = (row: Order) => {

  router.push(`/order/update/${row.id}`)
}


const {getStatus} = useStatuses()

const columns = [
  {
    accessorKey: "id",
    header: "No",
    cell: (cell: any) => {
      return (cell.row.index += 1);
    },
  },

  {
    accessorKey: 'id',
    header: 'Номер заказа',
    cell: ({row}: any) => {
      const id = row.original.id
      return h(
          RouterLink,
          {
            to: `/order/update/${id}`,
            class: 'text-blue-500 hover:underline',
          },
          {default: () => id}
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Создан",
    cell: ({ row }: any) =>
        h(
            "span",
            { class: "whitespace-nowrap" },
            row.original.created_at
        ),
  },
  {
    accessorKey: "total_amount",
    header: "Сумма",
  },
  {
    accessorKey: "client.full_name",
    header: "ФИО получателя",
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({row}: any) => {
      const raw = row.original?.status ?? ''
      const value = String(raw).trim()
      const status = getStatus('order', value)

      const bg = status?.color ?? '#8a8a8a'
      const label = status?.label ?? 'Неизвестный статус'

      return h(
          'span',
          {
            style: {backgroundColor: bg},
            class: 'px-2 py-1 rounded text-white whitespace-nowrap',
            title: label,
            'aria-label': label,
          },
          label
      )
    },
  },

  {
    accessorKey: "payment_status",
    header: "Оплата",
    cell: ({row}: any) => {
      const status = getStatus('payment', row.original.payment_status)

      return h('span',
          {
            style: {backgroundColor: status.color},
            class: `px-2 py-1 rounded text-white whitespace-nowrap`,
          },
          status.label
      )
    },
  },

  {
    accessorKey: "delivery_method.name",
    header: "Доставка",
  },

];

const {hasPermission} = usePermission()

const {deleteOrder} = useOrderFunctions()


const handleDeleted = async (order: Order) => {

  if (!order.id) return

  await deleteOrder(order.id)
  emits('deleted')

}

</script>

<style scoped></style>
