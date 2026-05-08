<template>
  <Loader v-if="isLoading" />
  <div v-else-if="!order" class="p-6 text-sm text-gray-500">Заказ не найден</div>
  <div v-else class="space-y-6">
    <OrderHeader
      :order="order"
      :neighbors="neighbors"
      @copy="onCopy"
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Основная колонка -->
      <div class="space-y-6 lg:col-span-2">
        <OrderStatuses :order="order" />
        <OrderActions :order="order" />
        <OrderItemsTable :items="order.items || []" :summary="summary" />
        <OrderDeliveryRow :order="order" />
        <OrderTotals :order="order" :summary="summary" />
        <OrderCustomFields :fields="customFields" />
        <OrderComments :order="order" />
        <OrderBonuses :order="order" />
        <OrderHistory :history="history" />
      </div>

      <!-- Боковая колонка -->
      <aside class="space-y-6">
        <SideApps :order="order" />
        <SideDelivery :order="order" />
        <SideClient :client="order.client" :stats="clientStats" />
        <SideTasks
          :order-id="order.id"
          :tasks="tasks"
          @refresh="fetchOrder(order.id)"
        />
        <SideCdek :order="order" />
        <SideSource :source="source" />
        <SideViewedProducts :products="viewedProducts" />
        <SidePaymentWidgets :payments="payments" />
        <SideMoySklad :order="order" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import Loader from "@/components/common/Loader.vue";

import OrderHeader from "./partials/OrderHeader.vue";
import OrderStatuses from "./partials/OrderStatuses.vue";
import OrderActions from "./partials/OrderActions.vue";
import OrderItemsTable from "./partials/OrderItemsTable.vue";
import OrderDeliveryRow from "./partials/OrderDeliveryRow.vue";
import OrderTotals from "./partials/OrderTotals.vue";
import OrderCustomFields from "./partials/OrderCustomFields.vue";
import OrderComments from "./partials/OrderComments.vue";
import OrderBonuses from "./partials/OrderBonuses.vue";
import OrderHistory from "./partials/OrderHistory.vue";

import SideApps from "./partials/side/SideApps.vue";
import SideDelivery from "./partials/side/SideDelivery.vue";
import SideClient from "./partials/side/SideClient.vue";
import SideTasks from "./partials/side/SideTasks.vue";
import SideCdek from "./partials/side/SideCdek.vue";
import SideSource from "./partials/side/SideSource.vue";
import SideViewedProducts from "./partials/side/SideViewedProducts.vue";
import SidePaymentWidgets from "./partials/side/SidePaymentWidgets.vue";
import SideMoySklad from "./partials/side/SideMoySklad.vue";

const route = useRoute();

const isLoading = ref(true);
const order = ref(null);
const summary = ref(null);
const clientStats = ref(null);
const history = ref([]);
const payments = ref([]);
const tasks = ref([]);
const customFields = ref([]);
const viewedProducts = ref([]);
const source = ref({});
const neighbors = ref({ prev_id: null, next_id: null });

const fetchOrder = async (id) => {
  isLoading.value = true;
  try {
    const { data } = await axios.get(`/orders/${id}/view`);
    order.value = data?.order ?? null;
    summary.value = data?.summary ?? null;
    clientStats.value = data?.client_stats ?? null;
    history.value = data?.history ?? [];
    payments.value = data?.payments ?? [];
    tasks.value = data?.tasks ?? [];
    customFields.value = data?.custom_fields ?? [];
    viewedProducts.value = data?.viewed_products ?? [];
    source.value = data?.source ?? {};
    neighbors.value = data?.neighbors ?? { prev_id: null, next_id: null };
  } catch (e) {
    console.error("Failed to load order view", e);
    order.value = null;
  } finally {
    isLoading.value = false;
  }
};

const onCopy = () => {
  // TODO: реализовать копирование заказа (POST /orders/{id}/duplicate)
};

onMounted(() => fetchOrder(route.params.id));

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      fetchOrder(newId);
    }
  },
);
</script>
