<template>
  <DynamicsDataTable
      :data="items"
      :columns="columns"
      :custom-actions="false"
      :edit="edit"
      @save_changes="handleUpdate"
      @deleted="deletePromoCodeHandle"
  />
</template>

<script setup lang="ts">
import {h, PropType, ref} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {Check, X} from 'lucide-vue-next';
import {PromoCode} from "@/models/PromoCode";
import {usePromoCodeFunctions} from "@/composables/usePromoCodeFunctions";
import {useDateFormat} from "@/composables/useDateFormat";
import PromoEdit from "@/components/discount/Promo/PromoEdit.vue";

const props = defineProps({
  items: {
    type: Array as PropType<PromoCode[]>,
    default: []
  },
  loading: Boolean,
});


const edit = ref({
  title: "Редактирование промокода",
  description: "Измените параметры промокода, включая код, скидку, срок действия и статус",
  component: PromoEdit,
  dynamicStyle: "2xl:min-w-[50vw] xl:min-w-[65vw] max-md:min-w-full md:min-w-[95vw]",
  loader: false,
});


const emits = defineEmits(["deleted", "updated"]);

const {deletePromoCode, updatePromoCode} = usePromoCodeFunctions();
const {formatDateToRussian} = useDateFormat();

const deletePromoCodeHandle = async (promo: PromoCode) => {
  if (promo.id) {
    const success = await deletePromoCode(promo.id);
    if (success) {
      emits('deleted', promo);
    }
  }
};

const handleUpdate = async (item: PromoCode) => {

  const success = await updatePromoCode(item);

  if (success) {
    emits('updated', item);
  }
}


const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "code",
    header: "Код",
  },

  {
    accessorKey: "image",
    header: "Картинка",
    cell: ({row}: any) => {
      const url = row.original.getImageURL();
      return url
          ? h(
              "img",
              {
                src: url,
                alt: row.original.title ?? "image",
                style: "height: 40px; object-fit: contain; cursor: pointer;",
                onClick: () => {
                  window.open(url, "_blank");
                },
              }
          )
          : "-";
    },
  },

  {
    accessorKey: "discountTypeLabel",
    header: "Тип скидки",
  },
  {
    accessorKey: "formattedValue",
    header: "Значение",
  },
  {
    accessorKey: "startsAt",
    header: "Начало",
    cell: ({row}: any) => formatDateToRussian(row.original.startsAt)
  },
  {
    accessorKey: "expiresAt",
    header: "Окончание",
    cell: ({row}: any) => formatDateToRussian(row.original.expiresAt)
  },
  {
    accessorKey: "maxUses",
    header: "Макс. использований",
  },
  {
    accessorKey: "timesUsed",
    header: "Использовано",
  },
  {
    accessorKey: "description",
    header: "Описание",
  },

  {
    accessorKey: "isActive",
    header: "Активен",
    cell: ({row}: any) => {
      return row.original.isActive
          ? h(Check, {class: "h-4 w-4 text-green-500"})
          : h(X, {class: "h-4 w-4 text-red-500"});
    },
  },
];
</script>

<style scoped></style>
