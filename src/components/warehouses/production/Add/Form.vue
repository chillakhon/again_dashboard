<template>
  <div class="mx-auto p-6 bg-white rounded-lg shadow text-sm">

    <BackButton title="Создать производственное задание"/>

    <!--    <h1 class="text-2xl font-bold mb-6">Производственное задание №</h1>-->

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-5 items-end">
      <div>
        <Label>Организация</Label>
        <div class="flex items-center gap-2 mt-1">
          <Input v-model="form.organization" disabled/>
          <Button variant="outline">Выбрать</Button>
        </div>
      </div>

      <div>
        <Label>Планируемая дата производства</Label>
        <DatePicker placeholder="Выберите дату" v-model="form.planned_start_date"/>
      </div>
    </div>

    <div class="md:flex md:space-x-2 max-md:space-y-2">
      <DynamicSelect
          v-model="form.batches.recipe_id"
          :options="techCarts"
          placeholder="Выберите техкарту"
          option-label="name"
          option-value="id"
      />

      <div>
        <Input type="number"
               v-model="form.quantity"
               min="1" placeholder="Кол-во производства"
        />
      </div>

      <div class="md:min-w-[250]">
        <DynamicSelect
            v-model="form.batches.performer_id"
            :options="users"
            placeholder="Выберите исполнитель"
            option-label="fullName"
            option-value="id"
        />
      </div>

    </div>

    <div class="my-4" v-if="selectedTechCart">

      <DynamicsShadcnTabs
          v-model="activeTab"
          :tabs="tabs"
          class="w-full"
      >
        <template #tab-product>
          <WarehousesRecipesShowComponentsTable
              :key="renderComp"
              :components="form.batches.output_products"
          />
        </template>

        <template #tab-material>
          <WarehousesRecipesShowComponentsTable
              :key="selectedTechCart?.id"
              :components="form.batches?.material_items"
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

    <!--    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">-->
    <!--      <div>-->
    <!--        <Label>Начало производства</Label>-->
    <!--        <Input type="time" v-model="form.start_time" class="mt-1"/>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <Label>Завершение производства</Label>-->
    <!--        <Input type="time" v-model="form.end_time" class="mt-1"/>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <Label>Время производства</Label>-->
    <!--        <Input :value="productionDuration" disabled class="mt-1"/>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="flex justify-end gap-4">
      <!--      <Button variant="outline">Отмена</Button>-->
      <Button @click="onSubmit" :disabled="isLoading">
        <span v-if="isLoading">Создание...</span>
        <span v-else>Создать задание</span>
      </Button>
    </div>

  </div>
</template>


<script setup lang="ts">
import {ref, onMounted, computed, watch} from 'vue'
import axios from 'axios'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import DatePicker from "@/components/common/DatePicker.vue";
import BackButton from "@/components/BackButton.vue";
import WarehousesRecipesShowComponentsTable from "@/components/warehouses/recipes/show/ComponentsTable.vue";
import DynamicSelect from "@/components/dynamics/Dropdown/Select.vue";
import DynamicsShadcnTabs from "@/components/dynamics/shadcn/Tabs.vue";
import {User} from "@/models/user/User";


const renderComp = ref(1)
const activeTab = ref('')
const selectedTechCart = ref<any>(null)
// Данные для формы
const techCarts = ref<any[]>([])
const users = ref<any[]>([])
const isLoading = ref(false)




// Состояния формы
const form = ref({
  techCartId: '',
  quantity: 1,
  planned_start_date: new Date().toISOString().split('T')[0],
  notes: '',
  organization: 'Элект-03',
  start_time: '08:00',
  end_time: '17:00',
  batches: {
    id: '',
    recipe_id: null,
    planned_qty: null,
    performer_id: null,
    output_products: [],
    material_items: [],
  },
})

watch(() => selectedTechCart.value?.output_products, (newProducts) => {
  form.value.batches.output_products = newProducts ? [...newProducts] : []
}, {deep: true})
watch(() => selectedTechCart.value?.material_items, (newProducts) => {
  form.value.batches.material_items = newProducts ? [...newProducts] : []
}, {deep: true})

watch(() => form.value.quantity, (newQty) => {
  if (!newQty) return
  form.value.batches.output_products = form.value.batches.output_products.map(product => ({
    ...product,
    qtyInit: product.qty * newQty
  }))
  renderComp.value++
}, {immediate: true})


// Загрузка техкарт
const fetchTechCarts = async () => {
  try {
    const {data} = await axios.get('/recipes')
    techCarts.value = data?.recipes
  } catch (err) {
    console.error(err)
  }
}
const fetchUsers = async () => {
  try {
    const {data} = await axios.get('/users')
    users.value = data.users?.data.map(i => User.fromJSON(i)).filter(i => i.getRoleNames !== 'Клиент')
    console.log(users.value)
  } catch (err) {
    console.error(err)
  }
}

const onSubmit = async () => {
  console.log(form.value)
  return
  try {
    isLoading.value = true
    await axios.post('/batches', {
      quantity: form.value.quantity,
      planned_start_date: form.value.planned_start_date,
      notes: form.value.notes,
      tech_cart_id: form.value.techCartId,
      start_time: form.value.start_time,
      end_time: form.value.end_time
    })
    // Редирект или уведомление об успехе
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchTechCarts()
  await fetchUsers()
})


watch(() => form.value.batches.recipe_id, (techCartId) => {
  if (!techCartId) return
  selectedTechCart.value = techCarts.value.find(i => (i.id == techCartId))
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
    content: 'Password content here'
  }
]


</script>