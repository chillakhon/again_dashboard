<template>
  <component
      :is="dynamicComponent"
      :column="column"
      :filter="filter"
  />
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const props = defineProps({
  column: Object,
  filter: Object,
});

const dynamicComponent = defineAsyncComponent(() =>
    import(`@/components/dynamics/Filter/UI/${props.column.type}/Index.vue`)
);
</script>
