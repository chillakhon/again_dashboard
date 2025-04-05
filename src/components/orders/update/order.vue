<template>
  <Toaster/>
  <Loader v-if="isLoading"/>
  <div v-else>
    <div class="flex items-center space-x-2">
      <BackButton :title="order.name ?? `Заказ ${order.id}`" class=""/>
      <span>от {{ order.created_at }}</span>
    </div>
    <form @submit.prevent="handleCreate" class="">
      <div class="grid md:grid-cols-3 md:space-x-3 max-md:space-y-3 grid-cols-1 my-5 ">
        <!-- Статус заказа -->
        <div class="flex items-center">
          <!--          <Label>Статус заказа:</Label>-->
          <DynamicSelect
              v-model="order.status"
              :options="statusOptions"
              placeholder="Выберите статус"
          />
        </div>

        <!-- Статус платежа -->
        <div class="flex items-center">
          <!--          <Label>Статус платежа:</Label>-->
          <DynamicSelect
              v-model="order.payment_status"
              :options="paymentStatusOptions"
              placeholder="Выберите статус платежа"
          />
        </div>

        <div class="flex items-center">
          <DatePicker
              v-model="selectedDate"
              placeholder="Выберите дату"
          />

        </div>
      </div>

      <ProductsTable
          :order="order"
      />

      <Button
          type="submit"
          class="mt-2">
        Сохранить
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import BackButton from "@/components/BackButton.vue";
import Order from "@/models/Order";
import Button from "@/components/ui/button/Button.vue";
import {toast} from 'vue-sonner'
import axios from "axios";
import {useRoute} from "vue-router";
import Loader from "@/components/common/Loader.vue";
import DynamicSelect from "@/components/common/DynamicSelect.vue";
import DatePicker from "@/components/common/DatePicker.vue";
import ProductsTable from "@/components/orders/update/partials/ProductsTable.vue";

const isLoading = ref<boolean>(true);
const route = useRoute();
const order = ref<Order>();
const selectedDate = ref();


// Опции для селектов
const statusOptions = Order.getAllStatuses();
const paymentStatusOptions = Order.getAllPaymentStatuses();

onMounted(async () => {
  await getOrder(route.params.id);
});

async function getOrder(id: any) {
  await axios.get(`orders/${id}`)
      .then(res => {
        order.value = new Order(res.data);
      })
      .finally(() => {
        isLoading.value = false;
      });
}

const handleCreate = async () => {
  try {
    await axios.put(`orders/${order.value.id}`, {
      status: order.value.status,
      payment_status: order.value.payment_status,
      notes: 'order.value.notes'
    });

    toast.success('Успешно!', {
      description: 'Статусы заказа обновлены',
    });

  } catch (error) {
    toast.error('Ошибка!', {
      description: 'Не удалось обновить статусы',
    });
  }
};
</script>