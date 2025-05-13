<script setup lang="ts">
import {computed} from 'vue'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

interface Tab {
  value: string
  title: string
  content: string | any // Можете указать более конкретный тип для content
}

const props = defineProps<{
  tabs: Tab[]
  modelValue?: string // для v-model
  class?: string
}>()

const emit = defineEmits(['update:modelValue'])

const activeTab = computed({
  get: () => props.modelValue || props.tabs[0]?.value,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <Tabs v-model="activeTab" :class="['w-[400px]', props.class]">
    <TabsList class="grid w-full" :style="`grid-template-columns: repeat(${tabs.length}, 1fr)`">
      <TabsTrigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
      >
        {{ tab.title }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
        v-for="tab in tabs"
        :key="`content-${tab.value}`"
        :value="tab.value"
    >
      <!-- Слот для контента таба -->
      <slot :name="`tab-${tab.value}`" :tab="tab">
        {{ tab.content }}
      </slot>
    </TabsContent>
  </Tabs>
</template>