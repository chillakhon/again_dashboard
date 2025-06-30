<script setup lang="ts">
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  parseDate,
  fromDate,
  toCalendarDate,
  toDate
} from '@internationalized/date'
import {CalendarIcon} from 'lucide-vue-next'
import {computed, PropType, watch} from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Date, Object] as PropType<string | Date | DateValue | null>,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Выберите дату'
  },
  locale: {
    type: String,
    default: 'ru-RU'
  },
})

const emit = defineEmits(['update:modelValue'])

const df = new DateFormatter(props.locale, {
  dateStyle: 'long'
})

/**
 * Parses various incoming date formats, including ISO with microseconds and Z
 */
const parseInputDate = (date: string | Date | DateValue | null): DateValue | null => {
  if (!date) return null
  try {
    // Already DateValue
    if (typeof date === 'object' && 'year' in date && 'month' in date && 'day' in date) {
      return toCalendarDate(date as DateValue)
    }
    // JS Date object
    if (date instanceof Date) {
      return fromDate(date, getLocalTimeZone())
    }
    // String input
    if (typeof date === 'string') {
      let iso = date.trim()
      // Strip microseconds to milliseconds precision if needed
      // e.g. "2025-04-29T18:05:31.000000Z" -> "2025-04-29T18:05:31.000Z"
      iso = iso.replace(/\.(\d{3})\d*Z$/, '.$1Z')

      // Try native ISO parsing
      const jsDate = new Date(iso)
      if (!isNaN(jsDate.getTime())) {
        return fromDate(jsDate, getLocalTimeZone())
      }
      // Fallback: simple YYYY-MM-DD
      const datePart = iso.split('T')[0]
      return parseDate(datePart)
    }
  } catch (e) {
    console.warn('Could not parse date:', date, e)
  }
  return null
}

const internalValue = computed<DateValue | null>({
  get() {
    return parseInputDate(props.modelValue)
  },
  set(newValue) {
    if (!newValue) {
      emit('update:modelValue', null)
      return
    }
    // build a JS Date so we can zero-pad everything
    const js = new Date(newValue.year, newValue.month - 1, newValue.day)
    const pad = (n: number, len = 2) => n.toString().padStart(len, '0')
    const iso = `${js.getFullYear()}-${pad(js.getMonth() + 1)}-${pad(js.getDate())}` +
        `T${pad(js.getHours())}:${pad(js.getMinutes())}` +
        `:${pad(js.getSeconds())}.${pad(js.getMilliseconds(), 3)}Z`
    emit('update:modelValue', iso)
  }
})

const displayValue = computed(() => {
  if (!internalValue.value) return props.placeholder
  const date = new Date(
      internalValue.value.year,
      internalValue.value.month - 1,
      internalValue.value.day
  )
  return df.format(date)
})


watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        internalValue.value = parseInputDate(val)
      }
    },
    {immediate: true}
)

</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
          variant="outline"
          :class="cn(
          'w-full justify-start text-left font-normal',
          !internalValue && 'text-muted-foreground'
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4"/>
        {{ displayValue }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="internalValue" initial-focus/>
    </PopoverContent>
  </Popover>
</template>
