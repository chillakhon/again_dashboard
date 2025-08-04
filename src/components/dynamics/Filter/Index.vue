<template>
  <form @submit.prevent="emits('search')" class="flex gap-3 w-full">
    <div class="flex max-md:flex-col gap-3 w-full">
      <!--      {{columns}}-->
      <DynamicsFilterColumn
          v-for="(column, index) in columns"
          :key="index"
          :column="column"
          :filter="filter"
      />
      <Button v-if="showButton" type="submit">Найти</Button>

    </div>
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
