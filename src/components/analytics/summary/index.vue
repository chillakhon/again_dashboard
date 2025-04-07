<template>
  <div>
    <h1 class="text-xl font-semibold mb-4 ml-2text-gray-800 dark:text-gray-200">Сводка</h1>
    <financial-analytics />
    <Line class="mt-2"/>
  </div>
</template>

<script setup lang="ts">
import FinancialAnalytics from "@/components/analytics/summary/FinancialAnalytics.vue";
import Line from "@/components/analytics/summary/charts/Line.vue";
</script>

<style scoped>

</style>