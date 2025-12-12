<template>
  <!--  <Toaster/>-->
  <Loader v-if="isLoading"/>
  <div v-else>
    <div class="flex items-center space-x-2">
      <BackButton :title="`Заказ ${order?.id}`" class=""/>
      <span>от {{ useDateFormat().formatDateToRussian(order?.created_at ?? new Date(), true) }}</span>
    </div>

    <DynamicForm
        v-model="order"
        submit-button-text="Сохранить"
        :fields="formFields"
        :show-submit-button="true"
        @submit-form="handleUpdate"
    />

  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import BackButton from "@/components/BackButton.vue";
import Order from "@/models/order/Order";
import {useRoute, useRouter} from "vue-router";
import Loader from "@/components/common/Loader.vue";
import DynamicForm from "@/components/dynamics/DynamicForm.vue";
import {useOrderFunctions} from "@/composables/useOrderFunctions";
import {useDateFormat} from "@/composables/useDateFormat";
import {useStatusFunctions} from "@/composables/useStatusFunctions";
import {orderToFormData} from "@/types/order";

const isLoading = ref<boolean>(true);
const route = useRoute();
const order = ref<Order>()


const router = useRouter();
const {getStatuses} = useStatusFunctions()
const {getOrderById, updateOrder} = useOrderFunctions()

const formFields = ref<any[]>(
    [
      [
        {
          name: 'status',
          component: 'select',
          label: '',
          required: false,
          placeholder: 'Выберите статус',
          options: getStatuses('order'),
          optionLabel: 'label',
          optionValue: 'value'
        },
        {
          name: 'payment_status',
          component: 'select',
          label: '',
          required: false,
          placeholder: 'Выберите  статус',
          options: getStatuses('payment'),
          optionLabel: 'label',
          optionValue: 'value'
        },
        // {
        //   name: 'created_at',
        //   component: 'date',
        //   label: '',
        //   required: false,
        //   placeholder: 'Дата',
        // },
      ],

      {
        name: 'notes',
        component: 'text',
        label: 'Заметка',
        required: true,
        placeholder: 'Заметка',
      },

    ]
)


onMounted(async () => {
  await getOrder(route.params.id);
});

async function getOrder(id: any) {


  order.value = await getOrderById(id)

  isLoading.value = false;
}

async function handleUpdate() {

  if (!order.value?.id) return

  const FD = orderToFormData(order.value);

  try {

    await updateOrder(order.value?.id, FD);
    await router.push('/orders/list');
    isLoading.value = false;

  } catch (e) {
    console.error(e);
  }


}

</script>