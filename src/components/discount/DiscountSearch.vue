<template>
  <DynamicsFilter
      :columns="filterColumns"
      :filter="filter"
      @search="emits('search')"
  />
</template>

<script setup>
import { ref } from 'vue';
import DynamicsFilter from '@/components/dynamics/Filter/Index.vue';

const props = defineProps({
  filter: Object,
});

const emits = defineEmits(["search"]);

const filterColumns = ref([
  {
    type: "text",
    placeholder: "Поиск...",
    field: "search",
  },
]);
</script>

<style scoped></style>
