<template>
  <form @submit.prevent="emits('search')" class="flex gap-3 w-full">
    <div class="flex gap-3 w-full">
<!--      {{columns}}-->
      <DynamicsFilterColumn
          v-for="(column, index) in columns"
          :key="index"
          :column="column"
          :filter="filter"
      />
    </div>
    <Button v-if="showButton" type="submit">Найти</Button>
  </form>
</template>

<script setup>
import {Button} from "@/components/ui/button";
import DynamicsFilterColumn from "@/components/dynamics/Filter/Column.vue";

const props = defineProps({
  columns: Array,
  filter: Object,
  showButton: {
    type: Boolean,
    default: true
  }
});

const emits = defineEmits(["search"]);
</script>

<style scoped></style>
