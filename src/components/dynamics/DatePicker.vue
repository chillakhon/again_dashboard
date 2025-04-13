<template>
  <VDatePicker
      v-model="localDateTime"
      :popover="false"
      is24hr
      mode="dateTime"
  >
    <template #default="{ togglePopover, inputValue, inputEvents }">
      <div class="flex rounded-md border overflow-hidden">
        <button
            type="button"
            class="flex justify-center items-center px-2 bg-accent-100 hover:bg-accent-200 text-accent-700 border-r border-gray-300 dark:bg-gray-700 dark:text-accent-300 dark:border-gray-600 dark:hover:bg-gray-600"
            @click="togglePopover"
        >
          <Calendar class="border-none"/>
        </button>
        <input
            :value="inputValue"
            v-on="inputEvents"
            class="w-full px-3 py-1 border border-gray-200"
            placeholder="Выберите дату и время"
        />
      </div>
    </template>
  </VDatePicker>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {Calendar} from 'lucide-vue-next'

// Определяем модель с типом Date | null
const model = defineModel<Date | null>({
  required: true,
  default: null
})

// Локальное вычисляемое свойство для работы с VDatePicker
const localDateTime = computed({
  get: () => model.value ?? new Date(),
  set: (value: Date | null) => {
    model.value = value
  }
})
</script>
