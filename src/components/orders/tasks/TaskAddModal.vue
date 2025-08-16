<template>
  <div>
    <ModalDialog
        :key="renderModal"
        dynamic-style="2xl:min-w-[70vw] xl:min-w-[80vw] max-md:min-w-full md:min-w-[95vw] min-h-[75vh]"
        title="Создать новую задачу"
        description="Заполните форму для создания задачи. Укажите название, описание, выберите статус, приоритет, исполнителя и установите сроки выполнения."
    >
      <template #trigger>
        <Button variant="outline">
          Добавить
        </Button>
      </template>

      <template #content>
        <TaskAdd @created="handleTaskCreated"/>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import ModalDialog from "@/components/dynamics/shadcn/ModalDialog.vue";
import {Button} from "@/components/ui/button";
import {ref} from "vue";
import TaskAdd from "@/components/orders/tasks/TaskAdd.vue";

const emit = defineEmits(["created"]);

const renderModal = ref(1);

const handleTaskCreated = (task: any) => {
  emit("created", task);
  renderModal.value += 1; // Закрываем модальное окно
};
</script>

<style scoped>
</style>