<template>
  <div class="pb-1" v-if="selectedIds.length">
    <BulkActionsMenu
        :selected-ids="selectedIds"
        :actions="[
        { label: 'Активировать', icon: Eye, onClick: handleActivate },
        { label: 'Деактивировать', icon: EyeOff, onClick: handleDeactivate },
      ]"
    />
  </div>

  <DynamicsDataTable
      :data="items"
      :columns="columns"
      :custom-actions="true"
      :show-print-button="showPrint"
  >
    <template v-if="showActionButton" #actions="{row}">
      <IconButtons
          :buttons="[
              { type: 'edit', onClick: editProduct },
              { type: 'delete', onClick: deleteProductHandle }
              ]"
          :context="row.original"
      />

    </template>

    <template #actionsVariant="{row}">

    </template>
  </DynamicsDataTable>
</template>

<script setup lang="ts">
import {h, onMounted, PropType, ref} from "vue";
import DynamicsDataTable from "@/components/dynamics/DataTable/Index.vue";
import {Product} from "@/models/Product";
import {ChevronRight, ChevronDown, Check, X} from 'lucide-vue-next'
import {useRouter} from "vue-router";
import {useImageFunctions} from "@/composables/useImageFunctions";
import IconButtons from "@/components/dynamics/IconButtons.vue";
import {useProductFunctions} from "@/composables/useProductFunctions";
import {useSelectableColumn} from "@/composables/useSelectableColumn";
import {Eye, EyeOff} from "lucide-vue-next"
import BulkActionsMenu from "@/components/dynamics/BulkActionsMenu.vue"
import EditableOrderCell from "@/components/products/list/online/EditableOrderCell.vue";
import EditableAbsorbencyCell from "@/components/products/list/online/AbsorbencyLevel/EditableAbsorbencyCell.vue";

const props = defineProps({
  items: {
    type: Array as PropType<Product[]>,
    default: () => []
  },
  loading: Boolean,

  showActionButton: {
    type: Boolean,
    default: true
  },

  showPrint: {
    type: Boolean,
    default: true
  }

});

const emits = defineEmits(["deleted", "updated", "updated_absorbency_level"]);

const router = useRouter();


const {deleteProduct, bulkActivateProducts, bulkDeactivateProducts} = useProductFunctions()

const editProduct = (product: Product) => {
  router.push(`/product/update/${product.id}`)
};
const deleteProductHandle = async (product: Product) => {
  await deleteProduct(product.id, {})
  emits('deleted')
};


const {getImageByNameProduct} = useImageFunctions()


const {selectedIds, selectColumn} = useSelectableColumn()

const columns = [
  selectColumn,

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
    accessorKey: "display_order",
    header: "Порядок",
    cell: ({row}: any) => {
      const product = row.original
      return h(EditableOrderCell, {
        productId: product.id,
        initialOrder: product.display_order,
        onUpdated: () => emits('updated')
      })
    }
  },


  {
    accessorKey: "absorbency_level",
    header: "Капли",
    cell: ({row}: any) => {
      const product = row.original
      return h(EditableAbsorbencyCell, {
        productId: product.id,
        initialAbsorbency: product.absorbency_level ?? 0,
        onUpdated: (event) => {
        }
      })
    }
  },






  {
    accessorKey: "name",
    header: "Название",
    cell: ({row}: any) => {
      const product = row.original;

      return h('span', {
            class: 'text-blue-500 cursor-pointer hover:underline',
            onClick: () => editProduct(product)
          },
          `${product.name} ${product?.color ? ' / ' + product.color.name : ''}`
      );
    }
  },

  {
    accessorKey: "stock_quantity",
    header: "Остаток",
  },

  {
    accessorKey: 'price',
    header: 'Цена продажи',
  },

  {
    header: "Скидка",
    accessorKey: "discount_percentage",
    cell: ({row}: any) =>
        h(
            "span",
            {class: "whitespace-nowrap"},
            `${row.original.discount_percentage ?? 0}%`
        ),
  },


  {
    accessorKey: 'old_price',
    header: 'Цена до скидки',
  },
  {
    accessorKey: 'code',
    header: 'Код',
  },


  {
    accessorKey: "is_active",
    header: "Активен",
    cell: ({row}: any) => {
      return row.original.is_active
          ? h(Check, {class: "h-4 w-4 text-green-500"})
          : h(X, {class: "h-4 w-4 text-red-500"});
    },
  },

];

async function handleActivate(ids: number[]) {
  await bulkActivateProducts(ids)
  emits('updated')
}

async function handleDeactivate(ids: number[]) {
  await bulkDeactivateProducts(ids)
  emits('updated')
}

</script>

<style scoped></style>
