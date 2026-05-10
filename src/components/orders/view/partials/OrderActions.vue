<template>
  <section class="flex flex-wrap items-center gap-2 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
    <OrderPositionModal
      v-model="productSearch"
      :products="products"
      @select="onAddPosition"
    />
    <Button variant="outline" size="sm" type="button" disabled>
      <Percent class="mr-2 h-4 w-4" /> Скидка
    </Button>
    <PromoCodeListModal
      trigger-label="Купон"
      :client-id="order.client?.id ?? order.client_id ?? null"
      @select="onCouponSelect"
    />
    <span class="ml-auto flex items-center gap-2">
      <Button variant="outline" size="sm" type="button" disabled>
        <Printer class="mr-2 h-4 w-4" /> Печать
      </Button>
      <Button variant="outline" size="sm" type="button" disabled>
        <Mail class="mr-2 h-4 w-4" /> Письмо
      </Button>
      <Button variant="outline" size="sm" type="button" disabled>
        <MessageSquare class="mr-2 h-4 w-4" /> Чат
      </Button>
    </span>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Percent, Printer, Mail, MessageSquare } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import OrderPositionModal from "@/components/orders/modals/OrderPositionModal.vue";
import PromoCodeListModal from "@/components/orders/modals/PromoCodeListModal.vue";
import { useProductFunctions } from "@/composables/useProductFunctions";

defineProps({
  order: { type: Object, required: true },
});

const emit = defineEmits(["add-position", "coupon-select"]);

const { getProducts: getProductsFromApi } = useProductFunctions();
const productSearch = ref("");
const products = ref([]);

const normalizeProductsResponse = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.products)) return response.products;
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

onMounted(() => fetchProducts());

watch(productSearch, (value) => fetchProducts(value));

const onAddPosition = (product) => {
  if (!product?.id) return;
  emit("add-position", product);
};

const onCouponSelect = (promoCode) => {
  if (!promoCode?.code) return;
  emit("coupon-select", promoCode);
};
</script>
