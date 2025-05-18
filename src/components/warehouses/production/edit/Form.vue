<template>
  <div class="mx-auto p-6 bg-white rounded-lg shadow text-sm">
    <BackButton title="Редактировать производственное задание"/>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-5 items-end">
      <div>
        <Label>Номер задания</Label>
        <Input v-model="form.base_batch_number" disabled class="mt-1"/>
      </div>

      <div>
        <Label>Начало произ-ва</Label>
        <DatePicker
            placeholder="Выберите дату"
            v-model="form.planned_start_datetime"
            :time="true"
        />
      </div>
      <div>
        <Label>Завершение произ-ва</Label>
        <DatePicker
            placeholder="Выберите дату"
            v-model="form.planned_end_datetime"
            :time="true"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-5 items-end">
      <div>
        <Label>Статус</Label>
        <Input v-model="form.status" disabled class="mt-1"/>
      </div>

      <div>
        <Label>Кол-во про-ва</Label>
        <Input
            type="number"
            v-model="form.planned_quantity"
            min="1"
            placeholder="Кол-во производства"
            class="mt-1"
        />
      </div>

      <div>
        <Label>Исполнитель</Label>
        <DynamicSelect
            v-model="form.batches[0].performer_id"
            :options="users"
            placeholder="Выберите исполнитель"
            option-label="email"
            option-value="id"
            class="mt-1"
        />
      </div>
    </div>

    <div class="my-4" v-if="form.batches[0].recipe">
      <DynamicsShadcnTabs
          v-model="activeTab"
          :tabs="tabs"
          class="w-full"
      >
        <template #tab-product>
          <ProductsTable
              :components="form.batches[0].output_products"
          />
        </template>

        <template #tab-material>
          <ComponentsTable
              :components="form.batches[0].material_items"
          />
        </template>
        <template #tab-complete>
          <CompletedTable
              :components="form.batches[0].output_products"
              :status="form.status"
          />
        </template>
      </DynamicsShadcnTabs>
    </div>

    <div class="mb-8">
      <Label>Комментарий</Label>
      <Textarea
          v-model="form.notes"
          class="mt-1"
          placeholder="Дополнительные заметки"
          rows="3"
      />
    </div>

    <div class="flex justify-end gap-4">
      <Button variant="outline" @click="router.back()">Отмена</Button>
      <Button @click="onSubmit" :disabled="isLoading">
        <span v-if="isLoading">Обновление...</span>
        <span v-else>Сохранить изменения</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import axios from 'axios'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import DatePicker from "@/components/common/DatePicker.vue";
import BackButton from "@/components/BackButton.vue";
import ProductsTable from "@/components/warehouses/recipes/show/ProductsTable.vue";
import ComponentsTable from "@/components/warehouses/recipes/show//ComponentsTable.vue";
import CompletedTable from "@/components/warehouses/recipes/show/CompletedTable.vue";
import DynamicSelect from "@/components/dynamics/Dropdown/Select.vue";
import DynamicsShadcnTabs from "@/components/dynamics/shadcn/Tabs.vue";
import {toast} from "vue-sonner";
import {useRouter} from "vue-router";

const router = useRouter()
const props = defineProps({
  batch: {
    type: Object,
    required: true
  }
})

const activeTab = ref('product')
const users = ref<any[]>([])
const isLoading = ref(false)

// Инициализация формы с данными из props
const form = ref(JSON.parse(JSON.stringify(props.batch)))

// Преобразование дат для DatePicker
if (form.value.planned_start_datetime) {
  form.value.planned_start_datetime = new Date(form.value.planned_start_datetime)
}
if (form.value.planned_end_datetime) {
  form.value.planned_end_datetime = new Date(form.value.planned_end_datetime)
}

// Загрузка пользователей
const fetchUsers = async () => {
  try {
    const {data} = await axios.get('/users?only_admin_users=true')
    users.value = data.users?.data || []
  } catch (err) {
    console.error(err)
    toast.error('Не удалось загрузить список пользователей')
  }
}

// Отправка формы
const onSubmit = async () => {
  isLoading.value = true

  try {
    // Подготовка данных для отправки
    const payload = {
      base_batch_number: form.value.base_batch_number,
      planned_quantity: form.value.planned_quantity,
      planned_start_datetime: form.value.planned_start_datetime?.toISOString(),
      planned_end_datetime: form.value.planned_end_datetime?.toISOString(),
      notes: form.value.notes,
      batches: form.value.batches.map(batch => ({
        id: batch.id,
        performer_id: batch.performer_id,
        planned_start_date: batch.planned_start_date,
        planned_end_date: batch.planned_end_date,
        notes: batch.notes,
        material_items: batch.material_items.map(item => ({
          material_type: item.material_type,
          material_id: item.material_id,
          quantity: item.quantity
        })),
        output_products: batch.output_products.map(product => ({
          output_type: product.output_type,
          output_id: product.output_id,
          qty: product.qty
        }))
      }))
    }

    const response = await axios.put(`/production/batches/${form.value.batches[0].id}`, payload)

    if (response.data.success) {
      toast.success('Производственное задание успешно обновлено')
      await router.push('/warehouses/production/list')
    } else {
      toast.error(response.data.message || 'Ошибка при обновлении')
    }
  } catch (err) {
    toast.error(err.response?.data?.error || err.response?.data?.message || 'Ошибка при обновлении')
  } finally {
    isLoading.value = false
  }
}

// Watcher для обновления количеств при изменении planned_quantity
watch(() => form.value.planned_quantity, (newQty) => {
  if (!newQty || !form.value.batches[0]) return

  // Обновляем выходные продукты
  form.value.batches[0].output_products = form.value.batches[0].output_products.map(product => {
    const originalQty = product.qty / (form.value.planned_quantity || 1)
    return {
      ...product,
      qty: originalQty * newQty
    }
  })

  // Обновляем материалы
  form.value.batches[0].material_items = form.value.batches[0].material_items.map(item => {
    const originalQty = parseFloat(item.quantity) / (form.value.planned_quantity || 1)
    return {
      ...item,
      quantity: (originalQty * newQty).toFixed(3)
    }
  })
}, {immediate: true})

onMounted(async () => {
  console.log(form.value)
  await fetchUsers()
})

const tabs = [
  {
    value: 'product',
    title: 'Продукция',
    content: 'Выходные продукты'
  },
  {
    value: 'material',
    title: 'Материалы',
    content: 'Необходимые материалы'
  },
  {
    value: 'complete',
    title: 'Выполнение',
    content: 'Статус выполнения'
  }
]
</script>