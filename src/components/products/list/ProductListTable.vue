<template>
  <DynamicsDataTable
      v-if="items?.length"
      :data="items"
      :columns="columns"
      :custom-actions="true"
  >
    <template #actions="{row}">
      <Pencil :size="17" class="cursor-pointer text-gray-400 hover:text-gray-500"
              @click="router.push(`/product/update/${row.original.id}`)"
      />
    </template>
  </DynamicsDataTable>
</template>

<script setup lang="ts">
import {h, onMounted, PropType, ref} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import usePermission from "@/composables/usePermission";
import {Product} from "@/models/Product";
import {ChevronRight, ChevronDown, Pencil} from 'lucide-vue-next'
import {useRouter} from "vue-router";
import {useImageFunctions} from "@/composables/useImageFunctions";


const props = defineProps({
  items: {
    type: Array as PropType<Product[]>,
    default: () => []
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

const router = useRouter();

const {getImageByNameProduct} = useImageFunctions()

const columns = [
  {
    id: 'expander',
    header: '',
    cell: ({row}: any) => (
        row.getCanExpand()
            ? h('button', {
              onClick: row.getToggleExpandedHandler(),
              class: 'p-1'
            }, [
              row.getIsExpanded()
                  ? h(ChevronDown, {class: 'w-4 h-4'})
                  : h(ChevronRight, {class: 'w-4 h-4'})
            ])
            : null

    ),
    meta: {isExpander: true},
  },


  {
    accessorKey: "id",
    header: "№",
  },

  {
    accessorKey: "image",
    header: "Фото",
    cell: ({row}: any) => {
      const imageName = row.original?.main_image?.path;

      return h('img', {
        src: getImageByNameProduct(imageName, 'md'),
        alt: imageName,
        class: 'w-10 h-10 object-cover rounded', // можно настроить
      });
    }
  },

  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "stock_quantity",
    header: "Остаток",
  },
  {
    header: "Цена",
    accessorKey: "price",
  },
  {
    accessorKey: "cost_price",
    header: "Себестоимость",
  },
  {
    accessorKey: "barcode",
    header: "Штрих-код",
  },
  {
    accessorKey: "sku",
    header: "Артикул",
  },
  {
    accessorKey: "dimensions",
    header: "Габариты (д*ш*в)",
    cell: ({row}: any) => {
      const {length, width, height} = row.original;
      return [length, width, height].filter(Boolean).join(" x ") || "";
    }
  },
  {
    accessorKey: "weight",
    header: "Вес Гр",
  },

  {
    accessorKey: "description",
    header: "Описание",
  },

];

const {hasPermission} = usePermission()


</script>

<style scoped></style>
