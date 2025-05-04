<template>
  <div class="grid gap-4">
    <div class="space-y-2">
      <Label for="name">Название скидки <span class="text-red-500">*</span></Label>
      <Input id="name" v-model="modelValue.name" placeholder="Название скидки"/>
      <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-2">
        <Label for="type">Тип скидки <span class="text-red-500">*</span></Label>
        <dynamic-select option-label="label" :options="discountTypes" v-model="modelValue.type"/>
      </div>

      <div class="space-y-2">
        <Label for="value">Значение <span class="text-red-500">*</span></Label>
        <Input
            id="value"
            type="number"
            v-model="modelValue.value"
            :min="0"
            :step="modelValue.type === 'percentage' ? 1 : 0.01"
        />
        <p v-if="errors.value" class="text-sm text-red-500">{{ errors.value }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-2">
        <Label for="starts_at">Дата начала</Label>
<!--        {{modelValue.starts_at}}-->
        <date-picker
            v-model="modelValue.starts_at"
        />
<!--        <Input id="starts_at" type="date" v-model="modelValue.starts_at"/>-->
      </div>

      <div class="space-y-2">
        <Label for="ends_at">Дата окончания</Label>
        <date-picker
            v-model="modelValue.ends_at"
        />

<!--        <Input id="ends_at" type="date" v-model="modelValue.ends_at"/>-->
      </div>
    </div>

    <div class="flex items-center space-x-2">
<!--      {{modelValue.is_active}}-->
      <Checkbox id="is_active" v-model="modelValue.is_active"/>
      <Label for="is_active">Активна</Label>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

import {Checkbox} from '@/components/ui/checkbox'
import DynamicSelect from "@/components/common/DynamicSelect.vue";
import DatePicker from "@/components/common/DatePicker.vue";
import {Discount} from "@/models/Discount";

defineProps({
  modelValue: {
    type: Discount,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  discountTypes: {
    type: Array as () => Array<{ value: string, label: string }>,
    required: true
  }
})
</script>