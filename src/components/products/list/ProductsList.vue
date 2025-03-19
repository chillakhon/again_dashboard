<template>
  <Loader v-if="isLoading"/>
  <div v-else class="">
    <div class="flex items-center pb-4 justify-between">
      <Input
          class="max-w-sm"
          placeholder="Поиск по название..."
          :model-value="table.getColumn('name')?.getFilterValue() as string"
          @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />
      <router-link to="/products/create">
        <Button>Добавить товар</Button>
      </router-link>
    </div>
    <div v-if="data.length && data.length > 0">
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead v-for="header in headerGroup.headers" :key="header.id">
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                            :props="header.getContext()"/>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <template v-for="row in table.getRowModel().rows" :key="row.id">
                <TableRow :data-state="row.getIsSelected() && 'selected'">
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()"/>
                  </TableCell>
                </TableRow>

                <TableRow v-if="expandedRows[row.id]" class="">
                  <TableCell v-for="col in columns" :key="col.accessorKey" :colspan="1" class="p-2">
                    <div v-if="row.original.variants?.length">
                      <div v-for="variant in row.original.variants" :key="variant.id" class="py-1">
                        {{ variant[col.accessorKey] ?? 0 }}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </template>
            </template>
            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24 text-center">No results.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div class="flex items-center justify-end space-x-2 py-4">
        <div class="space-x-2">
          <PaginationTable
              :total="totalItems"
              :default-page="currentPage"
              :items-per-page="itemsPerPage"
              :sibling-count="1"
              :show-edges="true"
              @current-page="currentPage = $event;"
          />
        </div>
      </div>
    </div>
    <div v-else class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
      <h3 class="text-3xl font-extrabold text-gray-500 sm:text-4xl">Ничего не найдено</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import {h, onMounted, ref} from 'vue';
import {valueUpdater} from "@/lib/utils";
import type {ColumnDef, ColumnFiltersState, SortingState} from '@tanstack/vue-table';
import {FlexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useVueTable} from '@tanstack/vue-table';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import PaginationTable from "@/components/PaginationTable.vue";
import {useStore} from 'vuex';
import axios from "axios";
import Loader from "@/components/common/Loader.vue";
import Button from "@/components/ui/button/Button.vue";
import {funcTableVue} from "@/composables/funcTableVue";

const store = useStore()
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const selectedIds = ref<number[]>([]);
const data = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const expandedRows = ref<Record<number, boolean>>({});
const isLoading = ref(true)


onMounted(async () => {
  await fetchData(currentPage.value)
})

async function fetchData(curPage: any) {
  await axios.get('products')
      .then(res => {
        data.value = res.data.data
      })
      .finally(() => {
        isLoading.value = false
      })
}

const toggleRow = (rowId: number) => {
  expandedRows.value[rowId] = !expandedRows.value[rowId];
};

// const {useSelectColumn} = await funcTableVue();
// const selectColumn = useSelectColumn(selectedIds, data);

const columns: ColumnDef<any>[] = [
  // selectColumn,
  {accessorKey: 'id', header: 'Фото'},
  {accessorKey: 'name', header: 'Название'},

  {
    accessorKey: 'variants',
    header: 'Артикул',
    cell: ({row}) => {
      return h(
          'button',
          {
            class: 'text-blue-300 cursor-pointer text-sm font-sans whitespace-nowrap',
            onClick: () => {
              toggleRow(row.index)
              row.toggleExpanded()
            },
          },
          `${row.original?.variants?.length} Вариантов`
      );
    }
  },

  {
    accessorKey: 'stock_quantity', header: 'Остаток',
    cell: ({row}) => {
      return `${row.original?.variants?.length} шт`
    }
  },
  {
    accessorKey: 'discount_price', header: 'Цена',
    cell: ({row}) => {
      return `${row.original?.discount_price ?? 0} руб`
    }
  },
  {
    accessorKey: 'price', header: 'Старая',
    cell: ({row}) => {
      return `${row.original?.price ?? 0} руб`
    }
  },
  {
    accessorKey: 'cost_price', header: 'Себестоимость',
    cell: ({row}) => {
      return `${row.original?.cost_price ?? 0} руб`
    }
  },
];


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
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
  },
});
</script>
