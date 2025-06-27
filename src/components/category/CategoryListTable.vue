<template>
  <DynamicsDataTable
      :data="items"
      :columns="columns"
      :custom-actions="true"
      sub-rows-field="children"
  >
    <template #actions="{row}">
      <IconButtons
          :buttons="[
              { type: 'edit', onClick: editProduct },
              { type: 'delete', onClick: deleteProductHandle }
              ]"
          :context="row.original"
      />

    </template>

    <template #actionsVariant="{row}">

      <!--      <IconButtons-->
      <!--          :buttons="[-->
      <!--              { type: 'delete', onClick: deleteProductHandle }-->
      <!--              ]"-->
      <!--          :context="row.original"-->
      <!--      />-->
    </template>

  </DynamicsDataTable>
</template>

<script setup lang="ts">
import {h, PropType} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import usePermission from "@/composables/usePermission";
import {Product} from "@/models/Product";
import {ChevronRight, ChevronDown} from 'lucide-vue-next'
import {useRouter} from "vue-router";
import IconButtons from "@/components/dynamics/IconButtons.vue";
import {useProductFunctions} from "@/composables/useProductFunctions";
import {Category} from "@/models/Category";


const props = defineProps({
  items: {
    type: Array as PropType<Category[]>,
    default: () => []
  },
  loading: Boolean,
});

const emits = defineEmits(["deleted", "updated"]);

const router = useRouter();


const {deleteProduct} = useProductFunctions()

const editProduct = (product: Product) => {
  router.push(`/product/update/${product.id}`)
};
const deleteProductHandle = async (product: Product) => {
  await deleteProduct(product.id, {})
  emits('deleted')
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


</script>

<style scoped></style>
