<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot name="button"/>
    </DialogTrigger>

    <DialogContent
        :class="dynamicStyle"
        class="w-full max-h-[75vh] overflow-y-auto flex flex-col items-start"
    >
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

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {ref} from "vue";

const props = defineProps({
  title: String,
  description: {
    type: String,
    default: '',
  },
  dynamicStyle: String,
})

const dialogOpen = ref(false)

</script>
