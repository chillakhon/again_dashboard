<template>
  <DynamicForm
      v-if="!isLoading"
      v-model="props.formData"
      submit-button-text="Создать"
      :key="renderForm"
      :fields="formFields"
      :errors="errors"
      :show-submit-button="submitButtonButton"
      @emit-button="console.log(45)"
      @submit-form="emit('submitForm')"
  >

    <template #enyComponentSlot>
      <div class="flex justify-between  space-x-2">
        <PromoProductDrawer
            :promo-code="props.formData"
        />
        <span>Выбрано продуктов: {{ props.formData?.selected_products?.length ?? 0 }}</span>
      </div>
    </template>

  </DynamicForm>

</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import DynamicForm from '@/components/dynamics/DynamicForm.vue'
import {PromoCode} from "@/models/PromoCode";
import {DiscountTargetType, PromoCodeTargetOptions} from "@/constants/DiscountType";
import PromoProductDrawer from "@/components/discount/Promo/promo_product/PromoProductDrawer.vue";


const props = defineProps({
  formData: {
    type: PromoCode,
    required: true,
  },
  submitButtonButton: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submitForm', 'selectedProducts'])

const renderForm = ref(1)
const isLoading = ref<boolean>(true)
const errors = ref<Record<string, string>>({})
const formFields = ref<any[]>([])

onMounted(() => {
  buildFormFields()
  isLoading.value = false
})

const buildFormFields = () => {
  formFields.value = [
    [
      {
        name: 'isActive',
        component: 'checkbox',
        label: 'Активен',
      },
      {
        name: 'applies_to_all_clients',
        component: 'checkbox',
        label: 'Применить ко всем клиентам',
      },
    ],

    [
      {
        name: 'discount_behavior',
        component: 'select',
        label: 'Правило совмещения скидок',
        required: true,
        options: [
          {label: 'Заменяет скидку товара', value: 'replace'},
          {label: 'Добавляется поверх существующей скидки', value: 'stack'},
          {label: 'Не применяется к товарам со скидкой', value: 'skip'}
        ],
        optionLabel: 'label',
        optionValue: 'value',
        placeholder: 'Выберите поведение',
      },

      {
        name: 'template_type',
        component: 'checkbox',
        label: '🎂 Промокод на ДР',
      }

    ],


    [

      {
        name: 'code',
        component: 'text',
        type: 'text',
        label: 'Код промо',
        required: true,
        placeholder: 'Введите код промокода'
      },
      {
        name: 'maxUses',
        component: 'text',
        type: 'number',
        label: 'Максимальное количество использований',
        placeholder: 'Оставьте пустым для безлимитного',
        min: 1
      }

    ],

    [
      {
        name: 'discountAmount',
        component: 'text',
        type: 'number',
        label: 'Сумма скидки',
        required: true,
        placeholder: 'Введите сумму или %',
        min: 0
      },
      {
        name: 'discountType',
        component: 'select',
        label: 'Тип скидки',
        required: true,
        options: [
          {label: 'Процент', value: 'percentage'},
          {label: 'Фиксированная сумма', value: 'fixed'}
        ],
        optionLabel: 'label',
        optionValue: 'value',
        placeholder: 'Выберите тип'
      },

    ],
    [
      {
        name: 'startsAt',
        component: 'date',
        label: 'Дата начала'
      },
      {
        name: 'expiresAt',
        component: 'date',
        label: 'Дата окончания'
      },

    ],


    [

      {
        name: 'promo_code_type',
        component: 'select',
        label: 'Применять',
        required: true,
        placeholder: 'Выбрать',
        options: PromoCodeTargetOptions,
        optionLabel: 'label',
        optionValue: 'value'
      },


      ...(props.formData?.promo_code_type == DiscountTargetType.SPECIFIC
          ? [{
            name: 'enyComponentSlot',
            component: 'enyComponentSlot',
          }]
          : []),

    ],


    {
      name: 'image',
      component: 'text',
      type: 'file',
      label: 'Изображение',
      placeholder: 'Выберите файл изображения',
      accept: 'image/*',
      imagePreview: true
    }

  ]
}


watch(
    () => props.formData?.promo_code_type,
    () => {
      buildFormFields()
    }
)


</script>
