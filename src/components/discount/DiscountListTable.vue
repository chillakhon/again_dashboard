<template>
  <DynamicsDataTable
      :data="items"
      :columns="columns"
      :custom-actions="true"
  >
    <template #actions="{row}">

      <ProductShowModal
          :products="products"
          @dialog-open="getProducts(row.original)"
      />

      <CategoryEditModal
          :item="row.original"
          @update="emits('updated')"
      />

      <IconButtons
          :buttons="[
              { type: 'delete', onClick: deleteCategoryHandle }
              ]"
          :context="row.original"
      />

    </template>

    <template #actionsVariant="{row}">

      <ProductShowModal
          :products="products"
          @dialog-open="getProducts(row.original)"
      />

      <CategoryEditModal
          :item="row.original"
          @update="emits('updated')"
      />

      <IconButtons
          :buttons="[
              { type: 'delete', onClick: deleteCategoryHandle }
              ]"
          :context="row.original"
      />

    </template>

  </DynamicsDataTable>
</template>

<script setup lang="ts">
import {h, PropType, ref} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import usePermission from "@/composables/usePermission";
import {Category} from "@/models/Category";
import {Check, X} from 'lucide-vue-next'
import {useRouter} from "vue-router";
import IconButtons from "@/components/dynamics/IconButtons.vue";
import CategoryEditModal from "@/components/category/CategoryEditModal.vue";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";
import ProductShowModal from "@/components/products/ProductShowModal.vue";
import {Product} from "@/models/Product";
import {Discount} from "@/models/Discount";
import {useDateFormat} from "@/composables/useDateFormat";
import {row} from "@unovis/ts/components/timeline/style";


const props = defineProps({
  items: {
    type: Array as PropType<Discount[]>,
    default: () => []
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

const products = ref<Product[]>([]);

const {deleteCategory, getProductsByCategory} = useCategoryFunctions()

const router = useRouter();


const deleteCategoryHandle = async (category: Category) => {
  const success = await deleteCategory(category.id, {})
  if (success) {
    emits('deleted')
  }
};


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
    accessorKey: "typeLabel",
    header: "Тип",
  },
  {
    accessorKey: "formattedValue",
    header: "Значение",
  },
  {
    accessorKey: "discountTypeLabel",
    header: "Применение",
  },
  {
    accessorKey: "priority",
    header: "Приоритет",
  },
  {
    accessorKey: "startsAt",
    header: "Начало действия",
    cell: ({row}) => useDateFormat().formatDateToRussian(row.original.startsAt)
  },
  {
    accessorKey: "endsAt",
    header: "Окончание",
    cell: ({row}) => useDateFormat().formatDateToRussian(row.original.endsAt)
  },
  {
    accessorKey: "isActive",
    header: "Активна",
    cell: ({row}: any) => {
      return row.original.isActive
          ? h(Check, {class: "h-4 w-4 text-green-500"})
          : h(X, {class: "h-4 w-4 text-red-500"});
    },
  },
];

const {hasPermission} = usePermission()


const getProducts = async (item: Category) => {
  products.value = await getProductsByCategory({category_id: item.id})
      .then(res => {
        return res.products.map(product => Product.fromJSON(product));
      })
}

</script>

<style scoped></style>
