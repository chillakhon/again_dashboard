<template>
  <!-- The AG Grid component -->
  <div class="flex space-x-2 items-center">

    <div v-on:click="onBtExport()"
         class="w-[120px] whitespace-nowrap border border-gray-200 p-1 mb-1 rounded shadow text-[15px] text-center font-medium bg-gray-100  hover:bg-gray-200 cursor-pointer">
      Export to Excel
    </div>
    <div v-if="props.title"
         class="min-w-[120px] w-full border border-gray-200 p-1 mb-1 rounded shadow text-[15px] text-center font-medium">
      {{ props.title }}
    </div>
  </div>

  <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      :pagination="pagination"
      :paginationPageSize="paginationPageSize"
      :paginationPageSizeSelector="paginationPageSizeSelector"
      :rowDragManaged="true"
      :rowDragEntireRow="!useAppStore().is_mobile"
      @grid-ready="onGridReady"
      domLayout="autoHeight"
      :defaultColDef="{
        flex: 1,
        minWidth: 150,
        filter: true,
        floatingFilter: false,
        cellClassRules: {
        'editable-cell': (params) => params.column.isCellEditable(params),
        'empty-editable-cell': (params) => params.column.isCellEditable(params) && !params.value
          },

  }"
  >
  </ag-grid-vue>
</template>

<script setup>
import {onBeforeMount, ref} from 'vue';
import {reactive} from 'vue';
import {AgGridVue} from "ag-grid-vue3";
import {
  AllCommunityModule,
  ModuleRegistry,
  RowDragModule,
  RowSelectionModule,
} from 'ag-grid-community';

import {
  AgChartsCommunityModule,
} from "ag-charts-community";
import {SparklinesModule} from "ag-grid-enterprise";

import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import {useAppStore} from "~/store/index.js";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  RowDragModule,
  RowSelectionModule,
  ExcelExportModule,
  SparklinesModule.with(AgChartsCommunityModule),
]);

const props = defineProps({
  dataAg: {
    type: Array,
    required: true,
  },
  colsAg: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
})

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [10, 20, 50, 100];

// const rowData = reactive(props.dataAg)
const rowData = reactive(props.dataAg)
const colDefs = reactive(props.colsAg)
const gridApi = ref(null);

function onBtExport() {
  gridApi.value?.exportDataAsExcel();
}

function onGridReady(params) {
  gridApi.value = params.api;
}

const enterpriseErrors = [
  '****************************************************************************************************************************',
  '************************************************ AG Grid Enterprise License ************************************************',
  '************************************************** License Key Not Found ***************************************************',
  '* All AG Grid Enterprise features are unlocked for trial.',
  '* If you want to hide the watermark please email info@ag-grid.com for a trial license key.'
]

onBeforeMount(() => {
  const originalError = console.error;
  console.error = function (...args) {
    if (args.some(arg =>
        typeof arg === 'string' &&
        enterpriseErrors.some(errorMessage => arg.includes(errorMessage))
    )) {
      return;
    }
    originalError.apply(console, args);
  };
});


</script>

<style>
.ag-header-cell-label {
  white-space: normal;
}

.editable-cell {
  text-decoration: underline dashed #76b2ff;
  text-underline-offset: 4px;
  cursor: pointer;
}

.empty-editable-cell {
  color: #d32f2f;
  font-style: italic;
}


</style>