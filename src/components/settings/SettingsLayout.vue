<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="md:col-span-1">
      <div class="space-y-1">
        <Button
            v-for="tab in tabs"
            :key="tab.id"
            variant="ghost"
            class="w-full justify-start"
            :class="{ 'bg-accent': activeTab === tab.id }"
            @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </Button>
      </div>
    </div>
    <div class="md:col-span-3">
      <component :is="activeTabComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductSettings from './ProductSettings.vue'
import VariantProperties from './VariantProperties.vue'
import DeliveryMethods from './DeliveryMethods.vue'
import OrderStatuses from './OrderStatuses.vue'
import OneClickOrders from './OneClickOrders.vue'
// Импортируйте остальные компоненты...

const tabs = [
  { id: 'product', label: 'Параметры товаров' },
  { id: 'variant', label: 'Свойства вариантов' },
  { id: 'delivery', label: 'Способы доставки' },
  { id: 'statuses', label: 'Статусы заказов' },
  { id: 'oneclick', label: 'Заказы в 1 клик' },
]

const activeTab = ref('product')

const activeTabComponent = computed(() => {
  switch(activeTab.value) {
    case 'product': return ProductSettings
    case 'variant': return VariantProperties
    case 'delivery': return DeliveryMethods
    case 'statuses': return OrderStatuses
    case 'oneclick': return OneClickOrders
    default: return ProductSettings
  }
})
</script>