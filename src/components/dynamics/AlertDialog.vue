<template>
  <AlertDialog>
    <!--    <AlertDialogTrigger>-->
    <!--    {{ disabledButton }}-->
    <Button variant="outline" v-if="!icon" :disabled="disabledButton" :class="buttonStyle">
      <AlertDialogTrigger>{{ buttonName }}</AlertDialogTrigger>
    </Button>
    <!--    <button v-else :disabled="true" class="">-->
    <AlertDialogTrigger :disabled="disabledButton">
      <component
          v-if="showIcon"
          :is="icon"
          :size="17"
          class="text-gray-400 hover:text-gray-500 transition"
      />
    </AlertDialogTrigger>
    <!--    </button>-->

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Отменить</AlertDialogCancel>
        <AlertDialogAction @click="emit('continue', true)">
          Да
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Button} from '@/components/ui/button'


const emit = defineEmits(["continue"]);

const props = defineProps({
  disabledButton: {
    type: Boolean,
    default: false,
  },
  buttonName: String,
  title: String,
  description: String,
  buttonStyle: String,
  icon: Object,
  showIcon: Boolean,
});
</script>
