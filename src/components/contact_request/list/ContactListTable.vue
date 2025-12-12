<template>
  <div>
    <DynamicsDataTable
        :data="items"
        :columns="columns"
        :show-print-button="false"
        :edit="edit"
        @deleted="handleDeleted"
        @save_changes="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import {h, PropType, ref} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import ContactRequest from "@/models/ContactRequest";
import {useContactRequestFunctions} from "@/composables/useContactRequestFunctions";
import {useDateFormat} from "@/composables/useDateFormat";
import ContactEdit from "@/components/contact_request/ContactEdit.vue";
import {useStatusFunctions} from "@/composables/useStatusFunctions";

const props = defineProps({
  items: {
    type: Array as PropType<ContactRequest[]>,
    default: () => []
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

const {getStatus} = useStatusFunctions();
const {deleteContactRequest, updateContactRequest} = useContactRequestFunctions();


const edit = ref({
  title: "Изменение статуса",
  description: "Здесь вы можете изменить «Статус» заявки",
  component: ContactEdit,
  loader: false,
});


const columns = [

  {
    accessorKey: "index",
    header: "№",
    cell: ({row}: any) => {
      return row.index + 1;
    },
  },

  // {
  //   accessorKey: "id",
  //   header: "№",
  // },
  {
    accessorKey: "created_at",
    header: "Создан",

    cell: ({ row }: any) =>
        h(
            "span",
            { class: "whitespace-nowrap" },
            useDateFormat().formatDateToRussian(row.original?.created_at)
        ),

    // cell: ({row}: any) => useDateFormat().formatDateToRussian(row.original?.created_at)
  },
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
    cell: ({ row }: any) =>
        h(
            "span",
            { class: "whitespace-nowrap" },
            row.original.phone
        ),
  },



  {
    accessorKey: "status",
    header: "Статус",
    cell: ({row}: any) => {
      const status = getStatus("contactRequest", row.original.status);
      return h(
          "span",
          {
            style: {backgroundColor: status.color},
            class: `px-2 py-1 rounded text-white whitespace-nowrap`,
          },
          status.label
      );
    },
  },


  {
    accessorKey: "client.profile.fullName",
    header: "Клиент",
  },

  {
    accessorKey: "source",
    header: "Источник",
  },

  {
    accessorKey: "message",
    header: "Сообщение",
  },

];

const handleDeleted = async (request: ContactRequest) => {
  if (!request.id) return;
  await deleteContactRequest(request.id);
  emits("deleted");
};
const handleSave = async (request: ContactRequest) => {

  if (!request.id) return;

  await updateContactRequest(request.id, {
    status: request.status ?? 'new',
  })
  emits('updated')
  console.log(request);
};
</script>

<style scoped></style>
