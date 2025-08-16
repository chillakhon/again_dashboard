<template>
  <div>
    <TaskForm
        :form-data="task"
        @submit-form="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import TaskForm from "@/components/orders/tasks/TaskForm.vue";
import {ref} from "vue";
import Task from "@/models/Task";
import {useTaskFunctions} from "@/composables/useTaskFunctions";

const emit = defineEmits(['created'])
const task = ref(Task.fromJSON({}))
const {createTask} = useTaskFunctions()


const handleSubmit = () => {
  const result = createTask(task.value.toJSONForCreate())
  if (result) {
    emit('created', result)
  }
}

</script>

<style scoped>

</style>