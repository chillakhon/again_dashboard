<template>
  <section class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
    <h3 class="text-sm font-semibold text-gray-900">Задачи</h3>
    <ul v-if="tasks.length" class="mt-3 space-y-2 text-sm">
      <li v-for="task in tasks" :key="task.id" class="text-gray-900">
        {{ task.title }}
      </li>
    </ul>
    <p v-else class="mt-2 text-sm text-gray-500">Нет задач</p>
  </section>
</template>

<script setup>
defineProps({
  tasks: { type: Array, default: () => [] },
});
</script>
