<template>
  <div class="border rounded">
    <Table>
      <TableHeader class="bg-gray-50">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap"
          >
            <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
              class="hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="px-3 py-2 whitespace-nowrap"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()"/>
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else>
          <TableCell
              :colspan="columns.length"
              class="h-20 text-center text-gray-500 py-3"
          >
            Нет данных
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import {valueUpdater} from "@/lib/utils";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/vue-table'

import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {computed, h, nextTick, onMounted, ref} from "vue";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Product from "@/models/Product";

const products = defineModel<Product[] | null>('products')

const data = computed(() => products.value)
const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])


const columns = [
  {
    accessorKey: 'name',
    header: 'Название',
    cell: ({row}) => h('div', {class: 'truncate max-w-[120px]'}, row.original.name)
  },
  // {
  //   accessorKey: 'cost_price',
  //   header: 'Себестоимость',
  //   cell: ({row}) => {
  //     return h(Input, {
  //       modelValue: row.original.cost_price,
  //       'onUpdate:modelValue': (value) => {
  //         row.original.cost_price = Number(value)
  //       },
  //       class: 'w-24 text-center border-gray-300 text-sm h-8 px-2',
  //       type: 'number',
  //       min: 0,
  //     });
  //   },
  // },
  {
    accessorKey: 'stock_quantity',
    header: 'Остаток',
    cell: ({row}) => {
      return h(Input, {
        modelValue: row.original.stock_quantity,
        'onUpdate:modelValue': (value) => {
          row.original.stock_quantity = Number(value)
        },
        class: 'w-20 text-center border-gray-300 text-sm h-8 px-2',
        type: 'number',
        min: 0,
      });
    },
  },

  // {
  //   accessorKey: 'discount_price',
  //   header: 'Цена продаж',
  //   cell: ({row}) => {
  //     if (row.original.discount_price && row.original.discount_price <= 0) {
  //       row.original.changeDiscount = Number(row.original.price);
  //     }
  //     return h(Input, {
  //       modelValue: row.original.discount_price,
  //       'onUpdate:modelValue': (value) => {
  //         row.original.discount_price = Number(value)
  //       },
  //       class: 'w-24 text-center border-gray-300 text-sm h-8 px-2',
  //       type: 'number',
  //       min: 0,
  //     });
  //   },
  // },


  // {
  //   accessorKey: 'discountPercentage',
  //   header: 'Скидка',
  //   cell: ({row}) => h('span', {class: 'text-gray-600 text-xs whitespace-nowrap'}, row.original.discountPercentage + '%')
  // },
  //
  // {
  //   accessorKey: 'price',
  //   header: 'Цена до скидки',
  //   cell: ({row}) => {
  //     row.original.discountPercentage
  //     return h(Input, {
  //       modelValue: row.original.price,
  //       'onUpdate:modelValue': (value) => {
  //         row.original.price = Number(value)
  //       },
  //       class: 'w-24 text-center border-gray-300 text-sm h-8 px-2',
  //       type: 'number',
  //       min: 0,
  //     });
  //   },
  // },

  {
    accessorKey: 'barcode',
    header: 'Штрихкод',
    cell: ({row}) => h('span', {class: 'text-gray-600 text-xs whitespace-nowrap'}, row.original.barcode)
  },


]

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
  },
})
</script>

<style scoped>

</style>