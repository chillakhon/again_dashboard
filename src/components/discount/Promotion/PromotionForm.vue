<template>
  <Loader v-if="isLoading" />
  <div v-else class="space-y-4">
    <DynamicForm
      v-model="props.formData"
      :key="renderForm"
      :fields="formFields"
      :errors="errors"
      :show-submit-button="false"
    />

    <!-- Товары акции -->
    <div class="space-y-2">
      <label class="text-sm font-medium">
        Товары акции <span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-500">
        Выберите товары, на которые действует акция
      </p>

      <TriggerProductListModal
        :selectedList="selectedTriggerProducts"
        @addToSelectList="handleAddTriggerProduct"
      />

      <div v-if="selectedTriggerProducts.length === 0" class="text-sm text-gray-400 italic">
        Товары не выбраны
      </div>
      <div v-else class="mt-2 space-y-2">
        <div
          v-for="(product, index) in selectedTriggerProductsData"
          :key="product.id"
          class="flex items-center justify-between p-2 border rounded"
        >
          <div>
            <span class="font-medium">{{ product.name }}</span>
            <span class="text-sm text-gray-500 ml-2"
              >(ID: {{ product.id }})</span
            >
          </div>
          <Button
            variant="ghost"
            size="sm"
            @click="removeTriggerProduct(product.id)"
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>

    <!-- Товары-подарки -->
    <div class="space-y-2">
      <label class="text-sm font-medium">
        Товары-подарки <span class="text-red-500">*</span>
      </label>
      <p class="text-sm text-gray-500">
        Добавьте товары, которые клиент может выбрать в качестве подарка
      </p>

      <GiftProductListModal
        :selectedList="giftProducts"
        @addToSelectList="handleAddGiftProduct"
      />

      <div v-if="giftProducts.length === 0" class="text-sm text-gray-400 italic">
        Товары-подарки не добавлены
      </div>
      <div v-else class="mt-2 space-y-2">
        <div
          v-for="(gift, index) in giftProducts"
          :key="index"
          class="flex items-center justify-between p-2 border rounded"
        >
          <div>
            <span class="font-medium">{{
              giftProductsData[index]?.name || "Товар"
            }}</span>
            <span class="text-sm text-gray-500 ml-2"
              >(ID: {{ gift.product_id }}, Количество:
              {{ gift.quantity }})</span
            >
          </div>
          <Button variant="ghost" size="sm" @click="removeGiftProduct(index)">
            Удалить
          </Button>
        </div>
      </div>
    </div>

    <Button @click="handleSubmit" class="w-full">
      {{ submitButtonName }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DynamicForm from "@/components/dynamics/DynamicForm.vue";
import { Promotion } from "@/models/Promotion";
import Loader from "@/components/common/Loader.vue";
import { usePromotionFunctions } from "@/composables/usePromotionFunctions";
import TriggerProductListModal from "@/components/discount/Promotion/trigger_product/TriggerProductListModal.vue";
import GiftProductListModal from "@/components/discount/Promotion/gift_product/GiftProductListModal.vue";
import { Button } from "@/components/ui/button";

const props = defineProps({
  formData: {
    type: Promotion,
    required: true,
  },
  submitButtonName: {
    type: String,
    default: "Создать",
  },
});

const emit = defineEmits(["submitForm", "validationErrors"]);

const renderForm = ref(1);
const isLoading = ref<boolean>(true);
const errors = ref<Record<string, string>>({});
const formFields = ref<any[]>([]);

const selectedTriggerProducts = ref<number[]>([]);
const selectedTriggerProductsData = ref<any[]>([]);
const giftProducts = ref<{ product_id: number; quantity: number }[]>([]);
const giftProductsData = ref<any[]>([]);

const { getProductsList } = usePromotionFunctions();

onMounted(async () => {
  // Initialize from formData
  selectedTriggerProducts.value = props.formData.triggerProductIds || [];
  giftProducts.value = props.formData.giftProductsData || [];

  // Заполняем данные товаров для отображения при редактировании
  if (props.formData.triggerProducts && props.formData.triggerProducts.length > 0) {
    selectedTriggerProductsData.value = props.formData.triggerProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
    }));
  }

  if (props.formData.giftProducts && props.formData.giftProducts.length > 0) {
    giftProductsData.value = props.formData.giftProducts.map((g: any) => ({
      id: g.product.id,
      name: g.product.name,
      price: g.product.price,
    }));
  }

  buildFormFields();
  isLoading.value = false;
});

const handleSubmit = () => {
  // Валидация перед отправкой
  const validationErrors: string[] = [];

  if (!props.formData.name || props.formData.name.trim() === '') {
    validationErrors.push('Название акции обязательно для заполнения');
  }

  if (!props.formData.startsAt) {
    validationErrors.push('Дата начала акции обязательна');
  }

  if (!props.formData.endsAt) {
    validationErrors.push('Дата окончания акции обязательна');
  }

  if (props.formData.startsAt && props.formData.endsAt) {
    const startDate = new Date(props.formData.startsAt);
    const endDate = new Date(props.formData.endsAt);
    if (endDate <= startDate) {
      validationErrors.push('Дата окончания должна быть позже даты начала');
    }
  }

  if (!selectedTriggerProducts.value || selectedTriggerProducts.value.length === 0) {
    validationErrors.push('Необходимо выбрать хотя бы один товар акции');
  }

  if (!giftProducts.value || giftProducts.value.length === 0) {
    validationErrors.push('Необходимо добавить хотя бы один товар-подарок');
  }

  if (validationErrors.length > 0) {
    // Отправляем ошибки в родительский компонент
    emit("validationErrors", validationErrors);
    return;
  }

  // Очищаем ошибки если все ок
  emit("validationErrors", []);
  
  props.formData.triggerProductIds = selectedTriggerProducts.value;
  props.formData.giftProductsData = giftProducts.value;
  emit("submitForm");
};

const handleAddTriggerProduct = (product: any) => {
  if (!selectedTriggerProducts.value.includes(product.id)) {
    selectedTriggerProducts.value.push(product.id);
    selectedTriggerProductsData.value.push(product);
  }
};

const removeTriggerProduct = (productId: number) => {
  selectedTriggerProducts.value = selectedTriggerProducts.value.filter(
    (id) => id !== productId,
  );
  selectedTriggerProductsData.value = selectedTriggerProductsData.value.filter(
    (p) => p.id !== productId,
  );
};

const handleAddGiftProduct = (data: { product: any; quantity: number }) => {
  const exists = giftProducts.value.find(
    (g) => g.product_id === data.product.id,
  );
  if (!exists) {
    giftProducts.value.push({
      product_id: data.product.id,
      quantity: data.quantity,
    });
    giftProductsData.value.push(data.product);
  }
};

const removeGiftProduct = (index: number) => {
  giftProducts.value.splice(index, 1);
  giftProductsData.value.splice(index, 1);
};

const buildFormFields = () => {
  formFields.value = [
    [
      {
        name: "isActive",
        component: "checkbox",
        label: "Активна",
      },
      {
        name: "allowPromoCodes",
        component: "checkbox",
        label: "Разрешить промокоды",
        description: "Клиент сможет выбрать между подарком и промокодом",
      },
    ],

    {
      name: "name",
      component: "text",
      type: "text",
      label: "Название",
      required: true,
      placeholder: "Например: Купи на 5000₽ и получи подарок",
    },

    {
      name: "description",
      component: "textarea",
      label: "Описание",
      placeholder: "Описание акции для клиентов",
    },

    [
      {
        name: "startsAt",
        component: "date",
        label: "Дата начала",
        required: true,
        placeholder: "Выберите дату начала",
      },
      {
        name: "endsAt",
        component: "date",
        label: "Дата окончания",
        required: true,
        placeholder: "Выберите дату окончания",
      },
    ],

    [
      {
        name: "minPurchaseAmount",
        component: "text",
        type: "number",
        label: "Минимальная сумма покупки (₽)",
        placeholder: "Например: 5000",
        description: "Оставьте пустым, если нет минимума",
      },
      {
        name: "maxUses",
        component: "text",
        type: "number",
        label: "Максимальное количество использований",
        placeholder: "Например: 100",
        description: "Оставьте пустым для неограниченного",
      },
    ],

    {
      name: "priority",
      component: "text",
      type: "number",
      label: "Приоритет",
      required: true,
      placeholder: "10",
      description: "Чем выше число, тем выше приоритет",
    },
  ];

  renderForm.value++;
};
</script>

<style scoped></style>
