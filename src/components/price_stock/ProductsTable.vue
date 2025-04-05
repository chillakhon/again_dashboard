<template>
  <div class="rounded-md border bg-white text-sm">
    <Table>
      <TableHeader class="bg-gray-50">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-3 py-2 font-medium text-gray-600 text-xs"
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
                class="px-3 py-2"
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

onMounted(() => {
  nextTick()
})

const columns = [
  {
    accessorKey: 'name',
    header: 'Название',
    cell: ({row}) => h('div', { class: 'truncate max-w-[120px]' }, row.original.name)
  },
  {
    accessorKey: 'barcode',
    header: 'Штрихкод',
    cell: ({row}) => h('span', { class: 'text-gray-600 text-xs' }, row.original.barcode)
  },
  {
    accessorKey: 'price',
    header: 'Цена',
    cell: ({row}) => {
      return h(Input, {
        modelValue: row.original.price,
        'onUpdate:modelValue': (value) => {
          row.original.price = Number(value)
        },
        class: 'w-20 text-center border-gray-300 text-sm h-8 px-2',
        type: 'number',
        min: 0,
      });
    },
  },
  {
    accessorKey: 'discount_price',
    header: 'Скидка',
    cell: ({row}) => h('span', { class: 'text-blue-600 text-sm' }, row.original.discount_price)
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
:deep(input[type='number']::-webkit-inner-spin-button),
:deep(input[type='number']::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(input[type='number']) {
  -moz-appearance: textfield;
  height: 32px;
  padding: 0 8px;
}
</style>