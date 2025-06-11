<template>
  <component
    :is="dynamicComponent"
    :column="column"
    :filter="filter"
  ></component>
</template>

<script setup>
const props = defineProps({
  column: Object,
  filter: Object,
});

const dynamicComponent = ref(
  (
    await import(
      `@/components/dynamics/Filter/UI/${props.column.type}/Index.vue`
    )
  ).default
);
</script>

<style scoped></style>
