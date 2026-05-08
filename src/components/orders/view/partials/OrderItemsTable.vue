<template>
  <section class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
    <h3 class="text-sm font-semibold text-gray-900">Позиции заказа</h3>

    <div class="mt-4 overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">№</th>
            <th class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Фото</th>
            <th class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Артикул</th>
            <th class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Наименование</th>
            <th class="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Цена</th>
            <th class="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Вес</th>
            <th class="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Кол-во</th>
            <th class="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Резерв</th>
            <th class="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Остаток</th>
            <th class="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">Сумма</th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="!items.length">
            <td colspan="11" class="px-3 py-6 text-center text-sm text-gray-500">
              Нет позиций
            </td>
          </tr>
          <tr v-for="(item, index) in items" :key="item.id || index">
            <td class="px-3 py-2 text-sm text-gray-700">{{ index + 1 }}</td>
            <td class="px-3 py-2">
              <img
                v-if="getImage(item)"
                :src="getImage(item)"
                alt=""
                class="h-10 w-10 rounded object-cover"
              />
              <div v-else class="h-10 w-10 rounded bg-gray-100" />
            </td>
            <td class="px-3 py-2 text-sm text-gray-700">
              {{ item.product?.sku || item.variant?.name || "—" }}
            </td>
            <td class="px-3 py-2 text-sm text-gray-900">
              {{ item.product?.name || item.name || "—" }}
            </td>
            <td class="px-3 py-2 text-right text-sm text-gray-900">
              {{ formatPrice(getUnitPrice(item)) }}
            </td>
            <td class="px-3 py-2 text-right text-sm text-gray-700">
              {{ item.product?.weight ?? "—" }}
            </td>
            <td class="px-3 py-2 text-right text-sm text-gray-900">
              {{ item.quantity }}
            </td>
            <td class="px-3 py-2 text-right text-sm text-gray-700">
              {{ item.reserved_quantity ?? "—" }}
            </td>
            <td class="px-3 py-2 text-right text-sm text-gray-700">
              {{ item.product?.stock_quantity ?? "—" }}
            </td>
            <td class="px-3 py-2 text-right text-sm font-medium text-gray-900">
              {{ formatPrice(getRowTotal(item)) }}
            </td>
            <td class="px-3 py-2 text-right">
              <Button variant="ghost" size="icon" type="button" :disabled="true">
                <Trash2 class="h-4 w-4" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { Trash2 } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  summary: { type: Object, default: null },
});

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format(amount);
};

const getUnitPrice = (item) => {
  const candidates = [item?.unit_price, item?.price_per_unit, item?.variant?.price, item?.price];
  for (const c of candidates) {
    const n = Number(c);
    if (!Number.isNaN(n) && c !== null && c !== undefined) {
      return n;
    }
  }
  return 0;
};

const getRowTotal = (item) => getUnitPrice(item) * Number(item.quantity || 0);

const getImage = (item) => {
  return (
    item?.variant?.images?.[0]?.url ||
    item?.product?.images?.[0]?.url ||
    null
  );
};
</script>
