<template>
  <section class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
    <h3 class="text-sm font-semibold text-gray-900">Доставка</h3>
    <dl class="mt-3 space-y-2 text-sm">
      <div>
        <dt class="text-xs uppercase text-gray-500">Получатель</dt>
        <dd class="text-gray-900">{{ recipientName || "—" }}</dd>
      </div>
      <div>
        <dt class="text-xs uppercase text-gray-500">Телефон</dt>
        <dd class="text-gray-900">{{ recipientPhone || "—" }}</dd>
      </div>
      <div>
        <dt class="text-xs uppercase text-gray-500">Адрес</dt>
        <dd class="text-gray-900">{{ address }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  order: { type: Object, required: true },
});

const addressObj = computed(() => props.order?.delivery_address || null);

const recipientName = computed(() => {
  const a = addressObj.value;
  if (!a) return null;
  return [a.recipient_last_name, a.recipient_first_name, a.recipient_middle_name]
    .filter(Boolean)
    .join(" ");
});

const recipientPhone = computed(() => addressObj.value?.recipient_phone || null);

const address = computed(() => {
  const a = addressObj.value;
  if (!a) return "—";
  return [a.country, a.region, a.city, a.address].filter(Boolean).join(", ") || "—";
});
</script>
