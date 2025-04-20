<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <Label class="text-sm font-medium">Компоненты техкарты</Label>
        <p class="text-xs text-muted-foreground">Материалы и продукты для производства</p>
      </div>
      <Button
          type="button"
          variant="outline"
          size="sm"
          @click="addComponent"
          :disabled="isAddingDisabled"
          class="h-8 text-xs"
      >
        <PlusIcon class="h-3 w-3 mr-1" />
        Добавить
      </Button>
    </div>

    <div v-if="model && model.items?.length === 0" class="rounded-lg border border-dashed p-4 text-center">
      <PackageOpenIcon class="mx-auto h-5 w-5 text-muted-foreground" />
      <h3 class="mt-1 text-xs font-medium">Нет компонентов</h3>
      <p class="mt-1 text-xs text-muted-foreground">Добавьте материалы или продукты</p>
    </div>

    <div v-else class="space-y-2">
      <div
          v-for="(item, index) in model.items"
          :key="item?.id ?? index"
          class=""
      >
        <RecipeComponentItem
            :model="model.items[index]"
            @update:model="updateComponent(index, $event)"
            :index="index"
            :units="units"
            :materials="materials"
            :products="products"
            :is-units-loading="isUnitsLoading"
            @remove="removeComponent(index)"
            class="compact-item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RecipeComponentItem from '@/components/warehouses/recipes/items/RecipeComponentItem.vue'
import { computed } from 'vue'
import { PlusIcon, PackageOpenIcon } from 'lucide-vue-next'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const props = defineProps({
  model: { type: Object, required: true },
  units: { type: Array, required: true },
  materials: { type: Array, required: true },
  products: { type: Array, required: true },
  isUnitsLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:model'])

const isAddingDisabled = computed(() => {
  return props.isUnitsLoading || props.units?.length === 0
})

const addComponent = () => {
  emit('update:model', {
    ...props.model,
    items: [
      ...props.model.items,
      {
        id: Date.now().toString(),
        component_type: 'Material',
        component_id: null,
        quantity: 0,
        unit_id: props.units[0]?.id || null,
        waste_percentage: 0
      }
    ]
  })
}

const removeComponent = (index: number) => {
  const newItems = props.model.items.filter((_, i) => i !== index)
  emit('update:model', { ...props.model, items: newItems })
}

const updateComponent = (index: number, updatedItem: any) => {
  const newItems = [...props.model.items]
  newItems[index] = updatedItem
  emit('update:model', { ...props.model, items: newItems })
}
</script>

<style scoped>
.compact-item :deep(.form-row) {
  @apply gap-2;
}

.compact-item :deep(.select-trigger),
.compact-item :deep(.input) {
  @apply h-8 text-xs;
}

.compact-item :deep(.label) {
  @apply text-xs;
}
</style>