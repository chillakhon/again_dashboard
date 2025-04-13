<template>
  <Dialog :open="dialogOpen" @update:open="emits('close')">
    <DialogTrigger as-child>
<!--      <Pencil-->
<!--        class="text-gray-400 hover:text-gray-500 transition cursor-pointer"-->
<!--        :size="17"-->
<!--      />-->
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <slot name="content" />

      <DialogFooter>
        <slot name="footer" />
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
});
const emits = defineEmits(["close"]);
</script>

<style scoped></style>
