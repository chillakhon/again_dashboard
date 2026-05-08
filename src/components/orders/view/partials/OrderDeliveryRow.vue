<template>
  <section class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
    <h3 class="text-sm font-semibold text-gray-900">Доставка</h3>
    <div class="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-4">
      <div>
        <div class="text-xs uppercase text-gray-500">Тип</div>
        <div class="text-gray-900">{{ order.deliveryMethod?.name || "—" }}</div>
      </div>
      <div>
        <div class="text-xs uppercase text-gray-500">Адрес ПВЗ / получателя</div>
        <div class="text-gray-900">{{ formatAddress() }}</div>
      </div>
      <div>
        <div class="text-xs uppercase text-gray-500">Цена</div>
        <div class="text-gray-900">{{ formatPrice(order.delivery_cost) }}</div>
      </div>
      <div>
        <div class="text-xs uppercase text-gray-500">Интервал</div>
        <div class="text-gray-900">{{ formatInterval() }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  order: { type: Object, required: true },
});

const formatPrice = (value) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format(n);
};

const formatAddress = () => {
  const a = props.order?.delivery_address;
  if (!a) return "—";
  const parts = [a.city, a.address].filter(Boolean);
  return parts.join(", ") || "—";
};

const formatInterval = () => {
  const date = props.order?.delivery_date || props.order?.delivery_address?.delivery_date;
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
</script>
