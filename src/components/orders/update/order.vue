<template>
  <Loader v-if="isPageLoading" />
  <div v-else>
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
                Измените состав заказа через поиск товаров.
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
                      {{ getProductName(item) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      Артикул: {{ getProductSku(item) }}
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
                    {{ getProductStock(item) }} шт
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
                >Сохранить</Button
              >
            </div>

            <div class="mt-3 flex items-center justify-between gap-3">
              <p v-if="appliedCouponCode" class="text-sm text-green-700">
                Применен купон:
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
            @click="handleUpdate"
            :disabled="isSaving"
            class="rounded-md bg-red-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <span v-if="!isSaving">Сохранить</span>
            <span v-else>Сохранение...</span>
          </button>
        </div>
      </div>

      <OrderQuickClientCreate
        :clients="clients"
        :selected-client="selectedClient"
        :refresh-clients="getClients"
        :errors="validationErrors"
        @created="handleQuickClientCreated"
        @cleared="handleClientCleared"
      />

      <OrderDeliveryDetails
        v-model:delivery-address="formData.delivery_address"
        :errors="validationErrors"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { TicketPercent, Trash2 } from "lucide-vue-next";

import Loader from "@/components/common/Loader.vue";
import PageHeading from "@/components/common/PageHeading.vue";
import DynamicForm from "@/components/dynamics/DynamicForm.vue";
import OrderDeliveryDetails from "@/components/orders/create/OrderDeliveryDetails.vue";
import OrderQuickClientCreate from "@/components/orders/create/OrderQuickClientCreate.vue";
import OrderPositionModal from "@/components/orders/modals/OrderPositionModal.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProductFunctions } from "@/composables/useProductFunctions";
import { useStatusFunctions } from "@/composables/useStatusFunctions";
import { useOrderFunctions } from "@/composables/useOrderFunctions";
import { useOrderPaymentMethods } from "@/composables/orders/useOrderPaymentMethods";
import { ORDER_SOURCE_OPTIONS } from "@/composables/orders/orderSourceOptions";

const store = useStore();
const route = useRoute();
const router = useRouter();

const productSearch = ref("");
const products = ref([]);
const isPageLoading = ref(true);
const isSaving = ref(false);
const showCouponInput = ref(false);
const couponCode = ref("");
const appliedCouponCode = ref("");
const validationErrors = ref({});
const couponCalculationLink = "/clients/discounts";
const orderMeta = ref(null);

const { getProducts: getProductsFromApi } = useProductFunctions();
const { getAllStatuses, getStatuses } = useStatusFunctions();
const { getOrderById, updateOrder } = useOrderFunctions();
const { paymentMethodOptions, fetchPaymentMethods } = useOrderPaymentMethods();

const pageTitle = computed(() => `Редактировать заказ #${route.params.id}`);

const data = reactive({
  items: [],
});

const createEmptyDeliveryAddress = () => ({
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

const formData = reactive({
  client_id: null,
  user: {
    first_name: "",
    last_name: "",
    phone: "",
  },
  delivery_address: createEmptyDeliveryAddress(),
  source: "",
  status: "new",
  payment_status: "pending",
  payment_method: "",
  delivery_method_name: "Курьерская доставка",
  address: "",
});

const getClients = () => store.dispatch("clients/getClients");
const clients = computed(() => store.getters["clients/clients"]);
const filteredProducts = computed(() => products.value);
const selectedClient = computed(() => {
  if (!formData.client_id) {
    return null;
  }

  return (
    (clients.value || []).find(
      (client) => `${client?.id}` === `${formData.client_id}`,
    ) ||
    (`${orderMeta.value?.client?.id ?? ""}` === `${formData.client_id}`
      ? orderMeta.value?.client
      : null)
  );
});
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
  await Promise.all([
    getAllStatuses(),
    fetchPaymentMethods(),
    getClients(),
    fetchProducts(),
  ]);
  await loadOrder(route.params.id);
});

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

const getFallbackItemProductData = (item) => ({
  name: item.product_name || item.product?.name || `Товар #${item.product_id}`,
  sku: item.product_sku || item.product?.sku || item.variant?.name || "—",
  stock_quantity: Number(
    item.stock_quantity ?? item.product?.stock_quantity ?? 0,
  ),
});

const getProductName = (item) => {
  return (
    getProductById(item.product_id)?.name ||
    getFallbackItemProductData(item).name
  );
};

const getProductSku = (item) => {
  return (
    getProductById(item.product_id)?.sku || getFallbackItemProductData(item).sku
  );
};

const getProductStock = (item) => {
  const product = getProductById(item.product_id);
  return Number(
    product?.stock_quantity ??
      getFallbackItemProductData(item).stock_quantity ??
      0,
  );
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
    return;
  }

  data.items.push({
    product_id: product.id,
    variant_id: variantId,
    quantity: 1,
    price: getApiPrice(product),
    product_name: product.name || `Товар #${product.id}`,
    product_sku: product.sku || "—",
    stock_quantity: Number(product.stock_quantity ?? 0),
  });
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

const handleClientCleared = () => {
  formData.client_id = null;
  formData.user.first_name = "";
  formData.user.last_name = "";
  formData.user.phone = "";
};

const syncUserFromClient = (clientId) => {
  const client = (clients.value || []).find(
    (item) => `${item?.id}` === `${clientId}`,
  );
  if (!client) return;

  formData.user.first_name = client.first_name || "";
  formData.user.last_name = client.last_name || "";
  formData.user.phone = client.phone || "";
};

const formatDateTimeLocal = (value) => {
  if (!value) return "";

  const stringValue = String(value).trim();

  // Если формат только дата (YYYY-MM-DD), добавляем время по умолчанию
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    return `${stringValue}T00:00`;
  }

  // Пробуем распарсить дату
  let date = new Date(value);

  // Если дата невалидна, пробуем другие форматы
  if (Number.isNaN(date.getTime())) {
    // Пробуем заменить пробел на T для ISO формата
    const isoValue = stringValue.replace(" ", "T");
    date = new Date(isoValue);
  }

  if (Number.isNaN(date.getTime())) {
    console.warn("Invalid date format:", value);
    return "";
  }

  const pad = (num) => String(num).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const normalizeOrderItemPrice = (item) => {
  const quantity = Number(item?.quantity ?? 1) || 1;
  const candidates = [
    item?.unit_price,
    item?.price_per_unit,
    item?.variant?.price,
  ];

  for (const candidate of candidates) {
    const amount = Number(candidate);
    if (
      !Number.isNaN(amount) &&
      candidate !== null &&
      candidate !== undefined
    ) {
      return amount;
    }
  }

  const linePrice = Number(item?.price ?? 0);
  return quantity > 0 ? linePrice / quantity : linePrice;
};

const normalizeOrderItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const productId = item?.product_id ?? item?.product?.id ?? null;

      if (!productId) {
        return null;
      }

      return {
        product_id: productId,
        variant_id:
          item?.variant_id ??
          item?.product_variant_id ??
          item?.variant?.id ??
          null,
        quantity: Number(item?.quantity ?? 1) || 1,
        price: normalizeOrderItemPrice(item),
        product_name:
          item?.product?.name || item?.name || `Товар #${productId}`,
        product_sku: item?.product?.sku || item?.variant?.name || "—",
        stock_quantity: Number(item?.product?.stock_quantity ?? 0),
        product: item?.product,
        variant: item?.variant,
        color_id: item?.color_id ?? item?.color?.id ?? null,
      };
    })
    .filter(Boolean);
};

const fillFormFromOrder = (order) => {
  Object.assign(formData.user, {
    first_name: order?.user?.first_name || order?.client?.first_name || "",
    last_name: order?.user?.last_name || order?.client?.last_name || "",
    phone: order?.user?.phone || order?.client?.phone || "",
  });

  formData.client_id = order?.client_id ?? order?.client?.id ?? null;
  formData.source = order?.source || "";
  formData.status = order?.status || "new";
  formData.payment_status = order?.payment_status || "pending";
  formData.payment_method = order?.payment_method || "";
  formData.delivery_method_name =
    order?.delivery_method?.name || "Курьерская доставка";

  // Заполняем delivery_address
  const emptyAddress = createEmptyDeliveryAddress();
  const orderAddress = order?.delivery_address || {};

  formData.delivery_address.country =
    orderAddress.country || emptyAddress.country;
  formData.delivery_address.region = orderAddress.region || emptyAddress.region;
  formData.delivery_address.city = orderAddress.city || emptyAddress.city;
  formData.delivery_address.postal_code =
    orderAddress.postal_code || emptyAddress.postal_code;
  formData.delivery_address.address =
    orderAddress.address ||
    order?.delivery_target?.name ||
    emptyAddress.address;
  formData.delivery_address.entrance =
    orderAddress.entrance || emptyAddress.entrance;
  formData.delivery_address.floor = orderAddress.floor || emptyAddress.floor;
  formData.delivery_address.intercom =
    orderAddress.intercom || emptyAddress.intercom;
  formData.delivery_address.delivery_comment =
    orderAddress.delivery_comment || emptyAddress.delivery_comment;
  formData.delivery_address.buyer_comment =
    orderAddress.buyer_comment || emptyAddress.buyer_comment;

  // Дата доставки может быть в delivery_address.delivery_date или в order.delivery_date
  const deliveryDateValue = orderAddress.delivery_date || order?.delivery_date;
  formData.delivery_address.delivery_date = formatDateTimeLocal(deliveryDateValue);

  formData.address = formData.delivery_address.address || "";

  data.items.splice(0, data.items.length, ...normalizeOrderItems(order?.items));

  appliedCouponCode.value = order?.promo_code?.code || "";
  couponCode.value = appliedCouponCode.value;
  showCouponInput.value = Boolean(appliedCouponCode.value);
};

const loadOrder = async (id) => {
  isPageLoading.value = true;

  try {
    const order = await getOrderById(id);
    orderMeta.value = order;
    fillFormFromOrder(order);
  } finally {
    isPageLoading.value = false;
  }
};

const handleUpdate = async () => {
  if (!route.params.id) return;

  isSaving.value = true;
  validationErrors.value = {};

  const payload = {
    client_id: formData.client_id,
    user: formData.user,
    delivery_address: formData.delivery_address,
    delivery_date: formData.delivery_address.delivery_date || null,
    source: formData.source || null,
    items: data.items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_variant_id: item.variant_id,
      color_id: item.color_id ?? null,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
    })),
    status: formData.status,
    payment_status: formData.payment_status,
    payment_method: formData.payment_method || null,
    created_at: orderMeta.value?.created_at || null,
    delivery_method_id: orderMeta.value?.delivery_method_id ?? null,
    delivery_method: {
      name: formData.delivery_method_name,
    },
    notes: orderMeta.value?.notes ?? null,
    ...(appliedCouponCode.value ? { promo_code: appliedCouponCode.value } : {}),
  };

  try {
    await updateOrder(route.params.id, payload);

    await router.push("/orders/list");
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
    // Error is already handled by useErrorHandler in useOrderFunctions
    // Just prevent navigation on error
  } finally {
    isSaving.value = false;
  }
};

watch(
  clients,
  (newClients) => {
    if (!formData.client_id && Array.isArray(newClients) && newClients.length) {
      formData.client_id = newClients[0].id;
    }

    if (formData.client_id) {
      syncUserFromClient(formData.client_id);
    }
  },
  { immediate: true },
);

watch(
  () => formData.client_id,
  (newValue, oldValue) => {
    if (!newValue || newValue === oldValue) return;
    syncUserFromClient(newValue);
  },
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
