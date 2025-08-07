<template>
  <Label v-if="title" class="text-xs">{{ title }}</Label>
  <!--  {{options}}-->
  <Select
      :required="props.required"
      :disabled="props.disabled"
      :modelValue="modelValue"
      @update:modelValue="(value: any) => emit('update:modelValue', value)"
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
        <X class="h-4 w-4"/>
      </button>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel v-if="label">{{ label }}</SelectLabel>
        <!--        <SelectItem-->
        <!--            v-for="option in options"-->
        <!--            :key="option.value"-->
        <!--            :value="option[optionValue ?? 'label']"-->
        <!--            :disabled="option.disabled"-->
        <!--        >-->
        <!--          &lt;!&ndash;          {{JSON.stringify(option)}}&ndash;&gt;-->
        <!--          {{ option[optionLabel ?? 'label'] }}-->
        <!--        </SelectItem>-->


        <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option[optionValue ?? 'label']"
            :disabled="option.disabled"
        >
          <span class="flex items-center gap-2 text-xs">
    <!-- Рендер иконки -->
          <component
              v-if="option.icon && typeof option.icon !== 'string'"
              class="w-4 h-4"
              :is="option.icon"
              :class="option.styleIcon"/>

            <span v-else-if="option.icon" class="text-base">{{ option.icon }}</span>


            {{ option[optionLabel ?? 'label'] }}

           </span>

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
import {X} from 'lucide-vue-next'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: object | string,
  styleIcon?: string,
}

const props = defineProps<{
  options: SelectOption[]
  modelValue: string | number | undefined
  placeholder?: string
  label?: string
  optionLabel?: string
  optionValue?: string
  disabled?: boolean,
  required?: boolean,
  title?: {
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
