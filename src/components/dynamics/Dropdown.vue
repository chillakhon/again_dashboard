<!-- components/DynamicSelect.vue -->
<template>
  <div class="flex flex-col space-y-1.5">
    <Label :for="id">{{ label }}</Label>
    <Select v-model="selectedValue">
      <SelectTrigger :id="id">
        <SelectValue :placeholder="placeholder"/>
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem v-for="item in items" :key="item.id" :value="item.id">
          {{ item.name }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const props = defineProps<{
  label: string;
  id: string;
  placeholder: string;
  items: { id: number; name: string }[];
  modelValue: number | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});


onMounted(() => {
  console.log(props.items)
})

</script>
