<template>
  <form @submit.prevent="emits('search')" class="flex gap-3 w-full">
    <div class="flex gap-3 w-full">
      <DynamicsFilterColumn
          v-for="(column, index) in columns"
          :key="index"
          :column="column"
          :filter="filter"
      />
    </div>
    <Button type="submit">Найти</Button>
  </form>
</template>

<script setup>
import {Button} from "@/components/ui/button";

const props = defineProps({
  columns: Array,
  filter: Object,
});

const emits = defineEmits(["search"]);
</script>

<style scoped></style>
