<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child :disabled="true">

      <button
          :disabled="disabled"
          aria-disabled="true"
          class="inline-flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-500"
      >
        <Pencil size="17"/>
      </button>

      <!--      <Pencil-->
      <!--          class="text-gray-400 hover:text-gray-500 transition cursor-pointer"-->
      <!--          :size="17"-->
      <!--          @click="openDialog"-->
      <!--      />-->
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ edit.title }}</DialogTitle>
        <DialogDescription>
          {{ edit.description }}
        </DialogDescription>
      </DialogHeader>

      <component
          :is="edit.component"
          :item="item"
          :key="renderContent"
      />

      <DialogFooter>
        <Button type="button" variant="outline" @click="closeDialog">
          Отменить
        </Button>
        <Button
            type="submit"
            @click="saveChanges"
            :disabled="edit?.loader"
        >
          <Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="edit.loader"/>
          Сохранить
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import {Pencil, Loader2} from "lucide-vue-next";
import {ref} from "vue"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

const props = defineProps({
  edit: Object,
  item: Object,
  disabled: {
    type: Boolean,
    default: false
  },
});

const emits = defineEmits(["save_changes"]);

const dialogOpen = ref(false);
const renderContent = ref(1);

const openDialog = () => {
  dialogOpen.value = true;
};

const closeDialog = () => {
  dialogOpen.value = false;
};

const saveChanges = () => {
  emits('save_changes', props.item);
  closeDialog();
  renderContent.value++;
};
</script>

<style scoped></style>