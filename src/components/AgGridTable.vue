<template>
  <!-- The AG Grid component -->
  <div class="flex space-x-2 items-end mb-1 justify-between">

    <div v-if="props.title"
         class="font-medium text-lg">
      {{ props.title }}
    </div>
    <div class="flex space-x-2 mb-1">
      <div>
        <Button
            class="relative overflow-hidden group flex items-center justify-center p-3 font-medium tracking-wide text-gray-800 transition-all duration-300 rounded-lg bg-gradient-to-r from-gray-300 to-gray-200 hover:from-gray-200 hover:to-gray-100 shadow-md hover:shadow-gray-400/20 active:scale-95"
        >
  <span class="relative z-10 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
    </svg>
    Импорт
  </span>

          <span
              class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </Button>
      </div>
      <div>
        <Button
            @click="onBtExport()"
            class="relative overflow-hidden group flex items-center justify-center p-3 font-medium tracking-wide text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/30 active:scale-95"
        >
  <span class="relative z-10 flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
    </svg>
    Экспорт
  </span>
          <span
              class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
        </Button>
      </div>
    </div>
  </div>

  <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      :rowDragManaged="true"
      :rowDragEntireRow="false"

      :treeData="treeData"
      :treeDataChildrenField="treeDataChildrenField"
      :autoGroupColumnDef="autoGroupColumnDef"

      @grid-ready="onGridReady"
      domLayout="autoHeight"
      :defaultColDef="{
        flex: 1,
        minWidth: 150,
        filter: true,
        floatingFilter: false
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
  ClientSideRowModelModule,
  ModuleRegistry,
  RowDragModule,
  RowSelectionModule
} from 'ag-grid-community';

import {
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
  TreeDataModule
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ContextMenuModule,
  RowGroupingModule,
  RowDragModule,
  RowSelectionModule,
  ExcelExportModule,
  TreeDataModule,
  ClientSideRowModelModule,
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

  treeData: {
    type: Boolean,
    default: false
  },
  autoGroupColumnDef: {
    type: Object,
    default: {}
  },

  treeDataChildrenField: {
    type: String,
    default: ''
  }

})

const treeDataChildrenField = ref(props.treeDataChildrenField);
const autoGroupColumnDef = ref(props.autoGroupColumnDef);
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
  color: gray;
}

.ag-input-wrapper:before {
  display: none;
}

.ag-watermark {
  display: none !important;
}

</style>