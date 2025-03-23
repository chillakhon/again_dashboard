<template>
  <!-- The AG Grid component -->
  <div class="flex space-x-2 items-center mb-1 justify-between">

    <div v-if="props.title"
         class="font-medium text-[30px]">
      {{ props.title }}
    </div>
    <Button v-on:click="onBtExport()" class="bg-blue-500 hover:bg-blue-400 active:bg-blue-500">
      Экспорт
    </Button>
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
    default:  {}
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
}

.ag-input-wrapper:before {
  display: none;
}

.ag-watermark {
  display: none !important;
}

</style>