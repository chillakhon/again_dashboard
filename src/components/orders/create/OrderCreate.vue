<template>
  <div>
    <PageHeading :title="pageTitle" />
    <div
      class="mt-10 mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
    >
      <div
        class="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2"
      >
        <div class="mt-6">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-sm/6 font-medium text-gray-900">
                Позиции заказа
              </h3>
              <p class="text-sm text-gray-500">
                Добавьте товары в заказ через поиск.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <OrderPositionModal
                v-model="productSearch"
                :products="filteredProducts"
                @select="addPosition"
              />
              <TooltipProvider v-if="!data.items.length">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <span class="inline-flex">
                      <Button
                        type="button"
                        variant="outline"
                        class="gap-2"
                        :disabled="true"
                      >
                        <TicketPercent class="h-4 w-4" />
                        Купон
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Сначала добавьте хотя бы одну позицию</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                v-else
                type="button"
                variant="outline"
                class="gap-2"
                @click="toggleCouponInput"
              >
                <TicketPercent class="h-4 w-4" />
                Купон
              </Button>
            </div>
          </div>

          <p v-if="validationErrors.items" class="mt-2 text-sm text-red-600">
            {{ validationErrors.items[0] }}
          </p>

          <div class="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Товар
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Цена
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Кол-во
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Остаток
                  </th>
                  <th
                    class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Сумма
                  </th>
                  <th
                    class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500"
                  ></th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-if="!data.items.length">
                  <td colspan="6" class="px-4 py-6 text-sm text-gray-500">
                    Пока нет позиций. Добавьте товар через кнопку "Позиция".
                  </td>
                </tr>

                <tr
                  v-for="(item, index) in data.items"
                  :key="`${item.product_id}-${item.variant_id ?? 'default'}-${index}`"
                >
                  <td class="px-4 py-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getProductName(item.product_id) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      Артикул: {{ getProductSku(item.product_id) }}
                    </div>
                  </td>

                  <td class="px-4 py-3">
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      step="0.01"
                      class="block w-28 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </td>

                  <td class="px-4 py-3">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      step="1"
                      class="block w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </td>

                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ getProductStock(item.product_id) }} шт
                  </td>

                  <td
                    class="px-4 py-3 text-right text-sm font-medium text-gray-900"
                  >
                    {{ formatPrice(getItemTotal(item)) }}
                  </td>

                  <td class="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      @click="removePosition(index)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="data.items.length" class="mt-4">
            <label
              for="delivery_method"
              class="block text-sm/6 font-medium text-gray-900"
              >Способ доставки</label
            >
            <select
              id="delivery_method"
              v-model="formData.delivery_method_name"
              class="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="Курьерская доставка">Курьерская доставка</option>
              <option value="Сдэк">Сдэк</option>
            </select>
          </div>

          <div
            v-if="showCouponInput && data.items.length"
            class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div class="w-full">
                <label
                  for="couponCode"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Купон</label
                >
                <input
                  id="couponCode"
                  v-model.trim="couponCode"
                  type="text"
                  placeholder="Введите код купона"
                  class="mt-2 block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <Button type="button" class="sm:w-auto" @click="applyCoupon"
                >Добавить</Button
              >
            </div>

            <div class="mt-3 flex items-center justify-between gap-3">
              <p v-if="appliedCouponCode" class="text-sm text-green-700">
                Добавлен купон:
                <span class="font-medium">{{ appliedCouponCode }}</span>
              </p>
              <a
                :href="couponCalculationLink"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Ссылка для расчета купона
              </a>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <DynamicForm
            v-model="formData"
            :fields="formFields"
            :show-submit-button="false"
          />
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            @click="handleCreate"
            :disabled="isLoading"
            class="rounded-md bg-red-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <span v-if="!isLoading">Создать</span>
            <span v-else>Создание...</span>
          </button>
        </div>
      </div>

      <OrderQuickClientCreate
        :clients="clients"
        :refresh-clients="getClients"
        :errors="validationErrors"
        @created="handleQuickClientCreated"
      />

      <OrderDeliveryDetails
        v-model:delivery-address="formData.delivery_address"
        :errors="validationErrors"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { TicketPercent, Trash2 } from "lucide-vue-next";

import PageHeading from "@/components/common/PageHeading.vue";
import OrderPositionModal from "@/components/orders/modals/OrderPositionModal.vue";
import DynamicForm from "@/components/dynamics/DynamicForm.vue";
import OrderQuickClientCreate from "@/components/orders/create/OrderQuickClientCreate.vue";
import OrderDeliveryDetails from "@/components/orders/create/OrderDeliveryDetails.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProductFunctions } from "@/composables/useProductFunctions";
import { useStatusFunctions } from "@/composables/useStatusFunctions";
import { useOrderPaymentMethods } from "@/composables/orders/useOrderPaymentMethods";
import { ORDER_SOURCE_OPTIONS } from "@/composables/orders/orderSourceOptions";

const store = useStore();
const router = useRouter();
const productSearch = ref("");
const products = ref([]);
const showCouponInput = ref(false);
const couponCode = ref("");
const appliedCouponCode = ref("");
const validationErrors = ref({});
const couponCalculationLink = "/clients/discounts";
const { getProducts: getProductsFromApi } = useProductFunctions();
const { getAllStatuses, getStatuses } = useStatusFunctions();
const { paymentMethodOptions, fetchPaymentMethods } = useOrderPaymentMethods();

const pageTitle = "Добавить заказ";

const data = reactive({
  items: [],
});

const formData = reactive({
  client_id: null,
  user: {
    first_name: "",
    last_name: "",
    phone: "",
  },
  delivery_address: {
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
  },
  source: "",
  status: "new",
  payment_status: "pending",
  payment_method: "",
  delivery_method_name: "Курьерская доставка",
  address: "",
});

const getProducts = () => store.dispatch("products/getProducts");
const getClients = () => store.dispatch("clients/getClients");
const clients = computed(() => store.getters["clients/clients"]);
const status = computed(() => store.getters["orderActions/status"]);
const isLoading = computed(() => store.getters["orderActions/isLoading"]);

const filteredProducts = computed(() => products.value);
const addressOptions = computed(() => {
  const rawList = (clients.value || [])
    .map((client) => client?.profile?.address || client?.address || "")
    .filter((addr) => typeof addr === "string" && addr.trim().length > 0);
  const unique = Array.from(new Set(rawList));
  return unique.map((a) => ({ value: a, label: a }));
});
const formFields = computed(() => [
  [
    {
      name: "status",
      component: "select",
      label: "Статус заказа",
      required: true,
      options: getStatuses("order"),
      optionLabel: "label",
      optionValue: "value",
    },
    {
      name: "payment_status",
      component: "select",
      label: "Статус оплаты",
      required: true,
      options: [
        { value: "pending", label: "Ожидание" },
        { value: "paid", label: "Оплачено" },
      ],
      optionLabel: "label",
      optionValue: "value",
    },
  ],
  [
    {
      name: "payment_method",
      component: "select",
      label: "Способ оплаты",
      required: false,
      placeholder: "Выберите способ оплаты",
      options: paymentMethodOptions.value,
      optionLabel: "label",
      optionValue: "value",
    },
    {
      name: "source",
      component: "select",
      label: "Источник",
      required: false,
      placeholder: "Выберите источник",
      options: ORDER_SOURCE_OPTIONS,
      optionLabel: "label",
      optionValue: "value",
    },
  ],
  [
    {
      name: "address",
      component: "select",
      label: "Адрес",
      required: false,
      placeholder: "Выберите адрес",
      options: addressOptions.value,
      optionLabel: "label",
      optionValue: "value",
    },
  ],
]);

onMounted(async () => {
  await getAllStatuses();
  await fetchPaymentMethods();
  getProducts();
  getClients();
  fetchProducts();
});

const create = (payload) => store.dispatch("orderActions/createOrder", payload);

const normalizeProductsResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  return [];
};

const fetchProducts = async (search = "") => {
  const response = await getProductsFromApi({
    per_page: 50,
    paginate: false,
    search: search || undefined,
  });

  products.value = normalizeProductsResponse(response);
};

const getDefaultVariantId = (product) => {
  if (Array.isArray(product?.variants) && product.variants.length) {
    return product.variants[0].id ?? null;
  }

  return null;
};

const getProductById = (productId) => {
  return (products.value || []).find(
    (product) => `${product.id}` === `${productId}`,
  );
};

const getProductName = (productId) => {
  return getProductById(productId)?.name || `Товар #${productId}`;
};

const getProductSku = (productId) => {
  return getProductById(productId)?.sku || "—";
};

const getProductStock = (productId) => {
  return Number(getProductById(productId)?.stock_quantity ?? 0);
};

const formatPrice = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format(amount);
};

const getItemTotal = (item) => {
  return Number(item.price || 0) * Number(item.quantity || 0);
};

const getApiPrice = (product) => {
  return Number(product?.price ?? 0);
};

const addPosition = (product) => {
  if (!product?.id) return;

  const variantId = getDefaultVariantId(product);
  const existingItem = data.items.find(
    (item) =>
      `${item.product_id}` === `${product.id}` &&
      `${item.variant_id ?? ""}` === `${variantId ?? ""}`,
  );

  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity || 0) + 1;
  } else {
    data.items.push({
      product_id: product.id,
      variant_id: variantId,
      quantity: 1,
      price: getApiPrice(product),
    });
  }
};

const removePosition = (index) => {
  data.items.splice(index, 1);

  if (!data.items.length) {
    showCouponInput.value = false;
  }
};

const toggleCouponInput = () => {
  showCouponInput.value = !showCouponInput.value;
};

const applyCoupon = () => {
  const value = couponCode.value?.trim();
  if (!value) return;
  appliedCouponCode.value = value;
};

const handleQuickClientCreated = (client) => {
  formData.client_id = client.id ?? null;
  formData.user.first_name = client.first_name || "";
  formData.user.last_name = client.last_name || "";
  formData.user.phone = client.phone || "";
};

const handleCreate = async () => {
  validationErrors.value = {};

  try {
    await create({
      client_id: formData.client_id,
      user: formData.user,
      delivery_address: formData.delivery_address,
      source: formData.source || null,
      items: data.items,
      status: formData.status,
      payment_status: formData.payment_status,
      payment_method: formData.payment_method || null,
      delivery_method: {
        name: formData.delivery_method_name,
      },
      ...(appliedCouponCode.value
        ? { promo_code: appliedCouponCode.value }
        : {}),
    });
  } catch (error) {
    if (error?.response?.data?.errors) {
      const errors = error.response.data.errors;

      // Преобразуем ошибки вида "delivery_address.city" в вложенную структуру
      const processedErrors = {};
      Object.keys(errors).forEach((key) => {
        if (key.startsWith("delivery_address.")) {
          const field = key.replace("delivery_address.", "");
          processedErrors[field] = errors[key];
        } else if (key.startsWith("user.")) {
          const field = key.replace("user.", "");
          if (!processedErrors.user) processedErrors.user = {};
          processedErrors.user[field] = errors[key];
        } else {
          processedErrors[key] = errors[key];
        }
      });

      validationErrors.value = processedErrors;
    }
  }
};

watch(status, (newValue) => {
  if (newValue) {
    router.push("/orders/list");
  }
});

watch(
  clients,
  (newClients) => {
    if (!formData.client_id && Array.isArray(newClients) && newClients.length) {
      formData.client_id = newClients[0].id;
    }
  },
  { immediate: true },
);

watch(
  paymentMethodOptions,
  (newOptions) => {
    if (
      !formData.payment_method &&
      Array.isArray(newOptions) &&
      newOptions.length
    ) {
      formData.payment_method = newOptions[0].value;
    }
  },
  { immediate: true },
);

watch(productSearch, (value) => {
  fetchProducts(value);
});

// Синхронизация адреса между DynamicForm (поле «Адрес») и строкой в delivery_address
watch(
  () => formData.delivery_address.address,
  (newVal) => {
    if (formData.address !== newVal) {
      formData.address = newVal || "";
    }
  },
  { immediate: true },
);

watch(
  () => formData.address,
  (newVal) => {
    if (formData.delivery_address.address !== newVal) {
      formData.delivery_address.address = newVal || "";
    }
  },
);
</script>
