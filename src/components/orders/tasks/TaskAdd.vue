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

const props = defineProps<{
  orderId?: number | string | null;
}>();

const emit = defineEmits(['created'])
const task = ref(Task.fromJSON({}))
if (props.orderId) {
  task.value.order_id = Number(props.orderId);
}
const {createTask} = useTaskFunctions()


const handleSubmit = async () => {
  const result = await createTask(task.value.toJSONForCreate())
  if (result) {
    emit('created', result)
  }
}

</script>

<style scoped>

</style>