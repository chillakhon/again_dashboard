<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  parseDate,
  today,
  fromDate
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'
import { computed, PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Date, Object] as PropType<string | Date | DateValue | null>,
    default: new Date()
  },
  placeholder: {
    type: String,
    default: 'Выберите дату'
  },
  locale: {
    type: String,
    default: 'ru-RU'
  }
})

const emit = defineEmits(['update:modelValue'])

const df = new DateFormatter(props.locale, {
  dateStyle: 'long'
})

const internalValue = computed<DateValue | null>({
  get() {
    if (!props.modelValue) return null
    if (typeof props.modelValue === 'string') {
      return parseDate(props.modelValue)
    }
    if (props.modelValue instanceof Date) {
      return fromDate(props.modelValue, getLocalTimeZone())
    }
    return props.modelValue as DateValue
  },
  set(newValue) {
    if (!newValue) {
      emit('update:modelValue', null)
      return
    }

    // Возвращаем дату в формате ISO строки (YYYY-MM-DD)
    emit('update:modelValue', newValue.toString())
  }
})

const displayValue = computed(() => {
  if (!internalValue.value) return props.placeholder

  // Альтернативный способ форматирования даты без toDate
  const date = new Date(
      internalValue.value.year,
      internalValue.value.month - 1,
      internalValue.value.day
  )
  return df.format(date)
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
          variant="outline"
          :class="cn(
          'w-full justify-start text-left font-normal',
          !internalValue && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ displayValue }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="internalValue" initial-focus />
    </PopoverContent>
  </Popover>
</template>