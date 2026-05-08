<template>
  <section class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="text-xs uppercase text-gray-500">Статус заказа</div>
        <div class="mt-1 text-sm font-medium text-gray-900">
          {{ order.status?.label || order.status || "—" }}
        </div>
      </div>
      <div>
        <div class="text-xs uppercase text-gray-500">Статус оплаты</div>
        <div class="mt-1 text-sm font-medium text-gray-900">
          {{ order.payment_status?.label || order.payment_status || "—" }}
        </div>
      </div>
      <div>
        <div class="text-xs uppercase text-gray-500">Дата оплаты</div>
        <div class="mt-1 text-sm text-gray-900">
          {{ order.paid_at ? formatDate(order.paid_at) : "—" }}
        </div>
        <div v-if="order.payment_id" class="text-xs text-gray-500">
          ID транзакции: {{ order.payment_id }}
        </div>
      </div>
      <div>
        <div class="text-xs uppercase text-gray-500">Менеджер</div>
        <div class="mt-1 text-sm text-gray-900">
          {{ order.manager?.name || order.assignee?.name || "—" }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  order: { type: Object, required: true },
});

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
</script>
