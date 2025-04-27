<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <Loader v-if="loading"/>

    <div class="overflow-auto">
      <Table>
        <TableHeader class="bg-gray-50">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
                v-for="header in headerGroup.headers"
                :key="header.id"
                class="text-gray-600 font-medium py-3"
            >
              <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
              />
            </TableHead>
            <TableHead class="w-32"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() && 'selected'"
                class="hover:bg-gray-50 border-b"
            >
              <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  class="py-3"
              >
                <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                />
              </TableCell>

              <TableCell class="py-3">
                <div class="flex space-x-3 justify-end">
                  <template v-if="customActions">
                    <slot name="actions"/>
                  </template>
                  <template v-else-if="restoreActions">
                    <ArchiveRestore
                        class="text-gray-500 hover:text-blue-600 transition cursor-pointer"
                        :size="18"
                        @click="emits('restore', row.original)"
                    />
                    <AlertDialog
                        title="Подтверждение удаления"
                        description="Вы уверены что хотите навсегда удалить? Действие безвозвратно!"
                        button-name="Удалить"
                        button-style="bg-red-500 hover:bg-red-600"
                        :icon="Trash2"
                        @continue="emits('hard_deleted', row.original)"
                    />
                  </template>
                  <template v-else>
                    <Edit
                        :item="JSON.parse(JSON.stringify(row.original))"
                        :edit="edit"
                        @save_changes="emits('save_changes', $event)"
                    />
                    <AlertDialog
                        title="Подтверждение удаления"
                        description="Вы уверены что хотите удалить этот элемент?"
                        button-name="Удалить"
                        button-style="bg-red-500 hover:bg-red-600"
                        :icon="Trash2"
                        @continue="emits('deleted', row.original)"
                    />
                  </template>
                </div>
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
                :colspan="columns?.length + 1"
                class="h-24 text-center text-gray-500"
            >
              Нет данных для отображения
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {valueUpdater} from "@/lib/utils";
import type {ColumnFiltersState, SortingState} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import {Trash2, ArchiveRestore} from "lucide-vue-next";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Edit from "@/components/dynamics/DataTable/Edit.vue";
import AlertDialog from "@/components/dynamics/AlertDialog.vue";
import Loader from "@/components/common/Loader.vue";
import {ref} from "vue";

const props = defineProps({
  data: Array,
  columns: Array,
  edit: Object,
  customActions: Boolean,
  restoreActions: Boolean,
  loading: Boolean,
});

const emits = defineEmits([
  "deleted",
  "save_changes",
  "hard_deleted",
  "restore",
]);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);

const table = useVueTable({
  data: props.data,
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, columnFilters),
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