<template>
  <section class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900">Доставка</h3>
      <Button
        v-if="!editing"
        variant="ghost"
        size="sm"
        type="button"
        @click="startEdit"
      >
        <Pencil class="mr-2 h-3.5 w-3.5" /> Редактировать
      </Button>
      <div v-else class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          :disabled="saving"
          @click="cancelEdit"
        >
          Отмена
        </Button>
        <Button
          variant="default"
          size="sm"
          type="button"
          :disabled="saving"
          @click="save"
        >
          {{ saving ? "Сохранение..." : "Сохранить" }}
        </Button>
      </div>
    </div>

    <!-- Read-only вид -->
    <div v-if="!editing" class="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-4">
      <div>
        <div class="text-xs uppercase text-gray-500">Тип</div>
        <div class="text-gray-900">{{ deliveryMethodName || "—" }}</div>
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

    <!-- Editable вид -->
    <div v-else class="mt-4 space-y-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label for="delivery_method">Способ доставки</Label>
          <Select
            id="delivery_method"
            v-model="draftDeliveryMethodName"
            :options="deliveryMethodOptions"
            option-label="label"
            option-value="value"
            placeholder="Выберите способ доставки"
          />
        </div>
      </div>

      <OrderDeliveryDetails v-model:delivery-address="draftAddress" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { Pencil } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import { Label } from "@/components/ui/label";
import Select from "@/components/dynamics/Dropdown/Select.vue";
import OrderDeliveryDetails from "@/components/orders/create/OrderDeliveryDetails.vue";

const props = defineProps({
  order: { type: Object, required: true },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["save"]);

const editing = ref(false);

const deliveryMethodOptions = [
  { value: "Курьерская доставка", label: "Курьерская доставка" },
  { value: "Сдэк", label: "Сдэк" },
];

const deliveryMethodName = computed(
  () =>
    props.order?.delivery_method?.name ||
    props.order?.deliveryMethod?.name ||
    null,
);

const createEmptyAddress = () => ({
  country: "",
  region: "",
  city: "",
  postal_code: "",
  address: "",
  entrance: "",
  floor: "",
  intercom: "",
  delivery_comment: "",
  delivery_date: "",
  buyer_comment: "",
});

const formatDateTimeLocal = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const draftAddress = ref(createEmptyAddress());
const draftDeliveryMethodName = ref("Курьерская доставка");

const startEdit = () => {
  const a = props.order?.delivery_address || {};
  const empty = createEmptyAddress();
  draftAddress.value = {
    country: a.country || empty.country,
    region: a.region || empty.region,
    city: a.city || empty.city,
    postal_code: a.postal_code || empty.postal_code,
    address: a.address || props.order?.delivery_target?.name || empty.address,
    entrance: a.entrance || empty.entrance,
    floor: a.floor || empty.floor,
    intercom: a.intercom || empty.intercom,
    delivery_comment: a.delivery_comment || empty.delivery_comment,
    buyer_comment: a.buyer_comment || empty.buyer_comment,
    delivery_date: formatDateTimeLocal(
      a.delivery_date || props.order?.delivery_date,
    ),
  };
  draftDeliveryMethodName.value =
    deliveryMethodName.value || "Курьерская доставка";
  editing.value = true;
};

const cancelEdit = () => {
  editing.value = false;
};

const save = () => {
  emit("save", {
    delivery_address: { ...draftAddress.value },
    delivery_date: draftAddress.value.delivery_date || null,
    delivery_method: { name: draftDeliveryMethodName.value },
    onSuccess: () => {
      editing.value = false;
    },
  });
};

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
  const date =
    props.order?.delivery_date || props.order?.delivery_address?.delivery_date;
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
</script>
