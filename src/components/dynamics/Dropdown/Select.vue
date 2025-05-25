<template>
  <Label v-if="title" class="text-xs">{{title}}</Label>
  <Select
      :required="props.required"
      :disabled="props.disabled"
      :modelValue="modelValue"
      @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <SelectTrigger class="relative">
      <SelectValue :placeholder="placeholder || 'Выберите...'"/>
      <button
          v-if="modelValue"
          @pointerdown.stop
          @mousedown.stop
          @click.stop="clearSelection"
          class="absolute right-8 h-full flex items-center text-muted-foreground hover:text-foreground transition-colors"
          type="button"
          :disabled="disabled"
      >
        <X class="h-4 w-4" />
      </button>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel v-if="label">{{ label }}</SelectLabel>
        <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option[optionValue ?? 'value']"
            :disabled="option.disabled"
        >
          {{ option[optionLabel ?? 'label'] }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-vue-next'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const props = defineProps<{
  options: SelectOption[]
  modelValue: string | number
  placeholder?: string
  label?: string
  optionLabel?: string
  optionValue?: number | string
  disabled: boolean,
  required: boolean,
  title: {
    type: string,
    default: ''
  }
}>()

const emit = defineEmits(['update:modelValue'])

const clearSelection = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  emit('update:modelValue', '')
}
</script>
