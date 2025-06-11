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
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="filter[column.field]?.start">
          <template v-if="filter[column.field]?.end">
            {{ df.format(localRange.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(localRange.end.toDate(getLocalTimeZone())) }}
          </template>
          <template v-else>
            {{ df.format(localRange.start.toDate(getLocalTimeZone())) }}
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
          :number-of-months="1"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup >
import { ref, watch } from 'vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { CalendarIcon } from 'lucide-vue-next'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone
} from '@internationalized/date'
import { cn } from '@/lib/utils'

const props = defineProps({
  column: Object,
  filter: Object
})

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

const formatForBackend = (date) => {
  const jsDate = date.toDate(getLocalTimeZone())
  const year = jsDate.getFullYear()
  const month = String(jsDate.getMonth() + 1).padStart(2, '0')
  const day = String(jsDate.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// локальный ref для диапазона дат
const localRange = ref(props.filter[props.column.field] || {})

// следим за изменениями и обновляем filter в нужном формате
watch(
    localRange,
    (range) => {
      if (range?.start) {
        props.filter[props.column.field] = {
          start: formatForBackend(range.start),
          end: range.end ? formatForBackend(range.end) : null
        }
      }
    },
    { deep: true, immediate: true }
)
</script>

<style scoped></style>
