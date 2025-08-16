<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
          variant="outline"
          :class="cn(
          'w-full justify-start text-left font-normal',
          !filter[column.field]?.start && 'text-muted-foreground'
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4"/>
        <template v-if="localRange.start">
          <template v-if="localRange.end">
            {{ formatDisplay(localRange.start) }} - {{ formatDisplay(localRange.end) }}
          </template>
          <template v-else>
            {{ formatDisplay(localRange.start) }}
          </template>
        </template>
        <template v-else>
          {{ column.placeholder || 'Pick a date' }}
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
          v-model="localRange"
          initial-focus
          locale="ru-RU"
          :number-of-months="1"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {Popover, PopoverTrigger, PopoverContent} from '@/components/ui/popover'
import {Button} from '@/components/ui/button'
import {RangeCalendar} from '@/components/ui/range-calendar'
import {CalendarIcon} from 'lucide-vue-next'
import {getLocalTimeZone} from '@internationalized/date'
import {cn} from '@/lib/utils'

const props = defineProps({
  column: Object,
  filter: Object
})

// локальный ref для диапазона
const localRange = ref(props.filter[props.column.field] || {})

// форматирование для кнопки с русскими месяцами
const formatDisplay = (date) => {
  if (!date) return ''
  const jsDate = date.toDate(getLocalTimeZone())
  return jsDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// форматирование для бэка
const formatForBackend = (date) => {
  const jsDate = date.toDate(getLocalTimeZone())
  const year = jsDate.getFullYear()
  const month = String(jsDate.getMonth() + 1).padStart(2, '0')
  const day = String(jsDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// следим за изменениями и обновляем filter
watch(
    localRange,
    (range) => {
      if (range?.start) {
        props.filter[props.column.field] = {
          start: formatForBackend(range.start),
          end: range.end ? formatForBackend(range.end) : null
        }
      } else {
        props.filter[props.column.field] = {}
      }
    },
    {deep: true, immediate: true}
)
</script>
