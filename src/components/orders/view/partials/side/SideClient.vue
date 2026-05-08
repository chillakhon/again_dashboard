<template>
  <section class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
    <h3 class="text-sm font-semibold text-gray-900">Клиент</h3>
    <div v-if="!client" class="mt-2 text-sm text-gray-500">Не указан</div>
    <dl v-else class="mt-3 space-y-2 text-sm">
      <div>
        <dt class="text-xs uppercase text-gray-500">ФИО</dt>
        <dd class="text-gray-900">
          <router-link
            v-if="client.id"
            :to="`/clients/${client.id}`"
            class="text-blue-600 hover:underline"
          >
            {{ fullName }}
          </router-link>
          <span v-else>{{ fullName }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-xs uppercase text-gray-500">Телефон</dt>
        <dd class="text-gray-900">{{ client.phone || "—" }}</dd>
      </div>
      <div>
        <dt class="text-xs uppercase text-gray-500">Email</dt>
        <dd class="text-gray-900">{{ client.email || "—" }}</dd>
      </div>
      <div>
        <dt class="text-xs uppercase text-gray-500">Согласие на обработку ПД</dt>
        <dd class="text-gray-900">{{ client.personal_data_consent ? "Да" : "—" }}</dd>
      </div>
      <div v-if="stats">
        <dt class="text-xs uppercase text-gray-500">Заказов</dt>
        <dd class="text-gray-900">{{ stats.orders_count }}</dd>
      </div>
      <div v-if="stats">
        <dt class="text-xs uppercase text-gray-500">Оборот</dt>
        <dd class="text-gray-900">{{ formatPrice(stats.orders_total) }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  client: { type: Object, default: null },
  stats: { type: Object, default: null },
});

const fullName = computed(() => {
  if (!props.client) return "—";
  return (
    [props.client.last_name, props.client.first_name, props.client.middle_name]
      .filter(Boolean)
      .join(" ") || "—"
  );
});

const formatPrice = (value) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format(n);
};
</script>
