<template>
  <form class="space-y-4" @submit.prevent="emit('submitForm')">
    <div v-for="(row, rowIndex) in groupedFields" :key="rowIndex" class="grid gap-3" :class="`grid-cols-${row.length}`">
      <div v-for="field in row" :key="field.name" class="space-y-2">
        <Label :for="field.name">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </Label>

        <!-- Текстовое поле -->
        <Input
            v-if="field.component === 'text'"
            :id="field.name"
            :type="field.type || 'text'"
            v-model="formData[field.name]"
            :placeholder="field.placeholder || ''"
            :required="field.required"
        />

        <!-- Текстовая область -->
        <Textarea
            v-else-if="field.component === 'textarea'"
            :id="field.name"
            v-model="formData[field.name]"
            :placeholder="field.placeholder || ''"
            :rows="field.rows || 3"
            :required="field.required"
        />


        <Select
            v-else-if="field.component == 'select'"
            v-model="formData[field.name]"
            :options="field.options"
            :option-label="field.optionLabel"
            :option-value="field.optionValue"
            :placeholder="field.placeholder"
            :required="field.required"
            :disabled="field.disabled"
            title=""
        />

        <MultiSelect
            v-else-if="field.component == 'multiSelect'"
            v-model="formData[field.name]"
            :options="field.options"
            :option-label="field.optionLabel"
            :option-value="field.optionValue"
            :placeholder="field.placeholder"
            :required="field.required"
            :disabled="field.disabled"
            title=""
        />

        <p v-if="errors[field.name]" class="text-sm text-red-500">
          {{ errors[field.name] }}
        </p>
      </div>
    </div>


    <Button
        v-if="showSubmitButton"
        type="submit"
        class="mt-4 w-full"
        variant="secondary"
    >
      {{ submitButtonText }}
    </Button>

  </form>
</template>

<script setup lang="ts">
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Label} from '@/components/ui/label'
import {computed} from 'vue'
import Select from "@/components/dynamics/Dropdown/Select.vue";
import MultiSelect from "@/components/dynamics/Dropdown/MultiSelect.vue";
import {FormDynamicFieldType} from "@/types/form";
import {Button} from "@/components/ui/button";


interface Props {
  fields: (FormDynamicFieldType)[]
  modelValue: Record<string, any>
  errors?: Record<string, string>
  showSubmitButton?: boolean
  submitButtonText?: string
}

const props = withDefaults(
    defineProps<Props>(), {
      errors: () => ({}),
    })

const emit = defineEmits(['update:modelValue', 'submitForm'])

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Group fields into rows (arrays of fields)
const groupedFields = computed(() => {
  return props.fields.map(field => Array.isArray(field) ? field : [field])
})
</script>