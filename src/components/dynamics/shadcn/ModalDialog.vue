<template>
  <Dialog v-model:open="internalOpen">

    <DialogTrigger as-child>
      <div @click="open()" class="cursor-pointer" >
        <slot name="trigger"/>
      </div>
    </DialogTrigger>


    <DialogContent
        :class="dynamicStyle"
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
import {ref, watch} from 'vue'

const props = defineProps({
  title: String,
  description: {
    type: String,
    default: null,
  },
  dynamicStyle: String,
})

const internalOpen = ref(false)

function open() {
  internalOpen.value = true
}

</script>
