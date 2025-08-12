<template>
  <Toaster/>
  <Loader v-if="isLoading"/>
  <div v-else>
    <div class="flex items-center space-x-2">
      <BackButton :title="`Заказ ${order?.id}`" class=""/>
      <span>от {{ useDateFormat().formatDateToRussian(order?.created_at ?? new Date(), true) }}</span>
    </div>

    <DynamicForm
        v-model="formData"
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
import Order from "@/models/Order";
import {useRoute, useRouter} from "vue-router";
import Loader from "@/components/common/Loader.vue";
import DynamicForm from "@/components/dynamics/DynamicForm.vue";
import {useOrderFunctions} from "@/composables/useOrderFunctions";
import {useStatuses} from "@/composables/useStatuses";
import {useDateFormat} from "@/composables/useDateFormat";

const isLoading = ref<boolean>(true);
const route = useRoute();
const order = ref<Order | null>(null)


const router = useRouter();

const {getStatuses} = useStatuses()
const {getOrderById, updateOrder} = useOrderFunctions()

const formData = ref<any>({})

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
        {
          name: 'created_at',
          component: 'date',
          label: '',
          required: false,
          placeholder: 'Дата',
        },
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
  order.value = await getOrderById(id);

  formData.value = order.value?.toJSONForUpdate();

  isLoading.value = false;
}

async function handleUpdate() {

  if (!order.value?.id) return

  const result = await updateOrder(order.value?.id, formData.value);

  if (result?.success) {
    await router.push('/orders/list');
  }

  console.log(result)


  isLoading.value = false;
}

</script>