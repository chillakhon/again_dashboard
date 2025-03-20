<template>
  <!-- The AG Grid component -->
  <div class="flex space-x-2 items-center mb-1 justify-between">

    <div v-if="props.title"
         class="font-medium text-[30px]">
      {{ props.title }}
    </div>
    <Button v-on:click="onBtExport()" class="bg-blue-500">
      Экспорт
    </Button>
  </div>

  <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      :rowDragManaged="true"
      :rowDragEntireRow="false"

      :treeData="true"
      :treeDataChildrenField="treeDataChildrenField"
      :autoGroupColumnDef="autoGroupColumnDef"

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
import Button from "@/components/ui/button/Button.vue";
import {onBeforeMount, reactive, ref} from 'vue';
import {AgGridVue} from "ag-grid-vue3";
import {
  AllCommunityModule,
  ModuleRegistry,
  RowDragModule,
  RowSelectionModule,
  ClientSideRowModelModule
} from 'ag-grid-community';

import {AgChartsCommunityModule,} from "ag-charts-community";
import {ContextMenuModule, ExcelExportModule, RowGroupingModule, SparklinesModule} from "ag-grid-enterprise";

import { TreeDataModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ContextMenuModule,
  RowGroupingModule,
  RowDragModule,
  RowSelectionModule,
  ExcelExportModule,
  TreeDataModule,
  ClientSideRowModelModule,
  SparklinesModule.with(AgChartsCommunityModule),
]);


const treeDataChildrenField = 'variants';


const autoGroupColumnDef = ref({
  headerName: "Артикул",
  field: "variants",
  cellRenderer: (params) => {
    return params.data.variants.length
        ? `<span style="cursor:pointer; color:blue;">▼ ${params.data.variants.length} вариантов</span>`
        : "0 вариантов";
  },
  cellRendererParams: {
    suppressCount: true,
  },
});


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


.editable-cell {
  text-decoration: underline dashed #76b2ff;
  text-underline-offset: 4px;
  cursor: pointer;
}

.empty-editable-cell {
  color: #d32f2f;
  font-style: italic;
}

.ag-header-cell-label {
  white-space: nowrap !important;
}

.ag-input-wrapper:before {
  display: none;
}

</style>