<template>
  <section class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Label for="order-status" class="text-xs uppercase text-gray-500">
          Статус заказа
        </Label>
        <Select
          id="order-status"
          v-model="localStatus"
          :options="orderStatusOptions"
          option-label="label"
          option-value="value"
          :disabled="savingField === 'status'"
          placeholder="Выберите статус"
          @update:modelValue="onChange('status', $event)"
        />
      </div>

      <div>
        <Label for="payment-status" class="text-xs uppercase text-gray-500">
          Статус оплаты
        </Label>
        <Select
          id="payment-status"
          v-model="localPaymentStatus"
          :options="paymentStatusOptions"
          option-label="label"
          option-value="value"
          :disabled="savingField === 'payment_status'"
          placeholder="—"
          @update:modelValue="onChange('payment_status', $event)"
        />
      </div>

      <div>
        <div class="text-xs uppercase text-gray-500">Дата оплаты</div>
        <div class="mt-2 text-sm text-gray-900">
          {{ order.paid_at ? formatDate(order.paid_at) : "—" }}
        </div>
        <div v-if="order.payment_id" class="text-xs text-gray-500">
          ID транзакции: {{ order.payment_id }}
        </div>
      </div>

      <div>
        <div class="text-xs uppercase text-gray-500">Менеджер</div>
        <div class="mt-2 text-sm text-gray-900">
          {{ order.manager?.name || order.assignee?.name || "—" }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Label } from "@/components/ui/label";
import Select from "@/components/dynamics/Dropdown/Select.vue";
import { useStatusFunctions } from "@/composables/useStatusFunctions";

const props = defineProps({
  order: { type: Object, required: true },
});

const emit = defineEmits(["update"]);

const { getStatuses, getAllStatuses } = useStatusFunctions();

const savingField = ref(null);

const extractValue = (val) => {
  if (val == null) return null;
  if (typeof val === "object") return val.value ?? val.code ?? null;
  return val;
};

const localStatus = ref(extractValue(props.order?.status));
const localPaymentStatus = ref(
  extractValue(props.order?.payment_status) || "pending",
);

watch(
  () => props.order,
  (newOrder) => {
    localStatus.value = extractValue(newOrder?.status);
    localPaymentStatus.value =
      extractValue(newOrder?.payment_status) || "pending";
  },
  { deep: true },
);

const orderStatusOptions = computed(() => {
  const list = getStatuses("order");
  return Array.isArray(list) && list.length
    ? list
    : [{ value: "new", label: "Новый" }];
});

const paymentStatusOptions = [
  { value: "pending", label: "Ожидание" },
  { value: "paid", label: "Оплачено" },
];

// Подгружаем статусы, если ещё не закэшированы
getAllStatuses();

const onChange = async (field, value) => {
  savingField.value = field;
  try {
    await emit("update", { [field]: value });
  } finally {
    savingField.value = null;
  }
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
</script>
