<template>
  <!--  {{ formData }}-->
  <DynamicForm
      v-if="!isLoading"
      v-model="props.formData"
      :key="renderForm"
      :fields="formFields"
      :errors="errors"
      :show-submit-button="true"
      :submit-button-text="submitButtonName"
      @submit-form="emit('submitForm')"
  />
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import DynamicForm from '@/components/dynamics/DynamicForm.vue'
import {FormDynamicFieldType} from "@/types/form";
import {useCategoryFunctions} from "@/composables/useCategoryFunctions";
import {useProductFunctions} from "@/composables/useProductFunctions";
import {Product} from "@/models/Product";
import {DiscountTargetOptions, DiscountTargetType, DiscountValueOptions} from "@/constants/DiscountType";
import {Discount} from "@/models/Discount";
import {Category} from "@/models/Category";


const props = defineProps({
  formData: {
    type: Discount,
    required: true,
  },
  submitButtonName: {
    type: String,
    default: 'Создать'
  }
})

const emit = defineEmits(['submitForm'])

const renderForm = ref(1)
const isLoading = ref<boolean>(true)
const errors = ref<Record<string, string>>({})
const formFields = ref<any[]>([])


const categories = ref<Category[]>([])
const products = ref<Product[]>([])

const {getCategories} = useCategoryFunctions()
const {getProducts} = useProductFunctions()


onMounted(async () => {
  categories.value = await getCategories({get_children: false});
  products.value = await getProducts({per_page: 200, paginate: false})
      .then(response => {
        return response.map((item: any) => Product.fromJSON(item));
      });

  buildFormFields();
  isLoading.value = false;
});


watch(
    () => props.formData?.discountType,
    (newValue) => {
      if (props.formData) {
        if (newValue != DiscountTargetType.SPECIFIC) {
          props.formData.productIds = undefined
        }
        if (newValue != DiscountTargetType.CATEGORY) {
          props.formData.categoryIds = undefined
        }
      }

      buildFormFields();
    }
);


const buildFormFields = () => {
  formFields.value = [
    {
      name: 'isActive',
      component: 'checkbox',
      label: 'Активна',
    },

    {
      name: 'name',
      component: 'text',
      type: 'text',
      label: 'Название',
      required: true,
      placeholder: 'Введите название'
    },

    {
      name: 'priority',
      component: 'text',
      type: 'number',
      label: 'Приоритет',
      required: true,
      placeholder: 'Введите число',
      description: 'Чем меньше значение, тем раньше эта скидка будет применяться при совпадении нескольких акций.'
    },
    [
      {
        name: 'type',
        component: 'select',
        label: 'Тип скидки',
        required: true,
        placeholder: 'Введите название',
        options: DiscountValueOptions,
        optionLabel: 'label',
        optionValue: 'value'
      },
      {
        name: 'value',
        component: 'text',
        type: 'number',
        label: 'Значение',
        required: true,
        placeholder: 'Введите...'
      },
    ],
    [
      {
        name: 'startsAt',
        component: 'date',
        label: 'Дата начала',
        placeholder: '',
      },
      {
        name: 'endsAt',
        component: 'date',
        label: 'Дата окончания',
        placeholder: ''
      },
    ],
    {
      name: 'discountType',
      component: 'select',
      label: 'Применять',
      required: true,
      placeholder: 'Введите название',
      options: DiscountTargetOptions,
      optionLabel: 'label',
      optionValue: 'value'
    },

    ...(props.formData?.discountType == DiscountTargetType.SPECIFIC
        ? [
          {
            name: 'productIds',
            component: 'multiSelect',
            label: 'Продукты',
            required: true,
            placeholder: 'Выберите продукты',
            options: products.value,
            optionLabel: 'name',
            optionValue: 'id'
          }
        ]
        : []),


    ...(props.formData?.discountType == DiscountTargetType.CATEGORY
        ? [
          {
            name: 'categoryIds', // исправлено
            component: 'multiSelect',
            label: 'Категории',
            required: true,
            placeholder: 'Выберите категории', // исправлено
            options: categories.value,
            optionLabel: 'name',
            optionValue: 'id'
          }

        ]
        : [])


  ]
}


</script>