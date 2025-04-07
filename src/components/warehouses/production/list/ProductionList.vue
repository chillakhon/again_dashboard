<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Производственные задания</h1>
      <RouterLink to="/warehouses/production/create">
        <Button class="gap-2">
          <PlusIcon class="h-4 w-4" />
          Создать задания
        </Button>
      </RouterLink>
    </div>

    <div>
      <ProductionTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TableRecipes from "@/components/warehouses/recipes/partials/TableRecipes.vue"
import { PlusIcon } from "lucide-vue-next"
import ProductionTable from "@/components/warehouses/production/partials/ProductionTable.vue";
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>