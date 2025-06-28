<template>
  <DynamicsDataTable
      :data="items"
      :columns="columns"
      :custom-actions="true"
      sub-rows-field="children"
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
import {ChevronRight, ChevronDown} from 'lucide-vue-next'
import {useRouter} from "vue-router";
import IconButtons from "@/components/dynamics/IconButtons.vue";
import CategoryEditModal from "@/components/category/CategoryEditModal.vue";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";
import ProductShowModal from "@/components/products/ProductShowModal.vue";
import {Product} from "@/models/Product";


const props = defineProps({
  items: {
    type: Array as PropType<Category[]>,
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
    accessorKey: "name",
    header: "Название",
  },


  {
    accessorKey: "description",
    header: "Описание",
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
