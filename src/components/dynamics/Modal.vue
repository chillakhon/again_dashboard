<template>
  <Dialog :open="dialogOpen" @update:open="emits('close')">
    <DialogTrigger as-child>
      <!--      <Pencil-->
      <!--        class="text-gray-400 hover:text-gray-500 transition cursor-pointer"-->
      <!--        :size="17"-->
      <!--      />-->
    </DialogTrigger>
    <DialogContent :class="dynamicStyle" class="w-full h-[75vh] overflow-y-auto flex flex-col items-start">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <div class="w-full">
        <slot name="content"/>
      </div>

      <DialogFooter>
        <slot name="footer"/>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const props = defineProps({
  dialogOpen: Boolean,
  title: String,
  description: {
    type: String,
    default: null,
  },
  dynamicStyle: String
});
const emits = defineEmits(["close"]);
</script>

<style scoped></style>
