<template>
  <section class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
    <h3 class="text-sm font-semibold text-gray-900">Поля заказа</h3>
    <div v-if="!fields.length" class="mt-2 text-sm text-gray-500">
      Нет дополнительных полей
    </div>
    <dl v-else class="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      <div v-for="field in fields" :key="field.id || field.key">
        <dt class="text-xs uppercase text-gray-500">{{ field.label || field.key }}</dt>
        <dd class="text-gray-900">{{ field.value || "—" }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
defineProps({
  fields: { type: Array, default: () => [] },
});
</script>
