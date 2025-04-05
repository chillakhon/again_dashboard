<template>
  <div class="max-w-[300px] mx-auto space-y-4">
    <Alert
        v-if="messages.notFondSupplier"
        :description="messages.notFondSupplier"
        variant="destructive"
        class="mb-4"
    />

    <!-- Search and controls section -->
    <div class="bg-background border-b ">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <Input
              v-model="searchQuery"
              placeholder="Поиск клиента..."
              class="flex-1"
          />
          <Button @click="fetchDataByName(searchQuery)" class="shrink-0">
            Найти
          </Button>
        </div>

        <Button
            v-if="selectedCustomer"
            @click="selectCustomer(null)"
            variant="outline"
            class="w-full"
        >
          <X class="h-4 w-4 mr-2"/>
          Сбросить выбор
        </Button>
      </div>
    </div>

    <!-- Customers list -->
    <div class="space-y-2">
      <div v-if="customers.length === 0" class="text-center py-8 text-muted-foreground bg-background rounded-lg border">
        <PackageSearch class="h-8 w-8 mx-auto mb-2 text-muted-foreground"/>
        <p>Клиенты не найдены</p>
        <!--        <p class="text-sm mt-1">Попробуйте изменить параметры поиска</p>-->
      </div>

      <Card
          v-for="customer in customers"
          :key="customer.id ?? 0"
          class="hover:bg-accent cursor-pointer transition-colors group"
          :class="{
          'border-primary border': selectedCustomer?.id === customer?.id,
          'bg-accent/50': selectedCustomer?.id === customer?.id
        }"
          @click="selectCustomer(customer)"
      >
        <div class="flex items-center gap-4">
          <div class="flex-1 text-center">
            <span class="font-medium text-sm text-gray-700">{{ customer.name }}</span>
            <p v-if="customer.phone" class="text-[10px] text-muted-foreground">
              <!--              <Phone class="h-3 w-3 inline mr-1 text-[10px]" />-->
              {{ customer.phone }}
            </p>
          </div>
          <!--          <CheckCircle-->
          <!--              v-if="selectedCustomer?.id === customer?.id"-->
          <!--              class="h-5 w-5 text-primary"-->
          <!--          />-->
        </div>
      </Card>
    </div>

  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick} from "vue";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {Button} from "~/components/ui/button";
import {Cart} from "~/services/customer/Cart";
import axios from "axios";
import {toast} from "vue-sonner";
import {X, Phone, PackageSearch} from 'lucide-vue-next';
import {useCustomerStore} from "~/stores/useCustomerStore";
import {Customer} from "~/services/customer/Customer";
import {Card} from "@/components/ui/card";

const config = useRuntimeConfig()

const props = defineProps({
  cart: Cart
})

const customerStore = useCustomerStore()
const selectedCustomer = computed(() => props.cart?.customer)
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const messages = ref({
  notFondSupplier: ''
})

const customers = ref<Customer[]>([]) as Ref<Customer[]>;
const searchQuery = ref<string>("");

onMounted(async () => {
  await nextTick()
  await fetchData(currentPage.value)
})

async function fetchData(curPage: any) {
  const result = await useAuthFetch(`${config.public.apiUrl}/api/customer?page=${curPage}&per_page=${10}`,
      {
        method: "GET",
      })
  if (result.error.value) {
    console.error(result.error.value)
    return
  }
  const resData = result.data.value

  customers.value = resData.data.map((item: any) => {
    return Customer.fromJson(item);
  })
  totalItems.value = resData.meta.count
}

const selectCustomer = (customer: Customer | null) => {
  if (!customer) {
    customerStore.deleteCustomer()
    props.cart?.updateCustomer(null)
    return
  }
  props.cart?.updateCustomer(customer)
  customerStore.setCustomer(customer)
};

async function fetchDataByName(searchQuery: string) {
  if (!searchQuery) return
  await axios.get(`${config.public.apiUrl}/api/customer/name/${searchQuery}`)
      .then(res => {
        customers.value = res.data.data.map((item: any) => {
          return Customer.fromJson(item);
        })
        totalItems.value = res.data.meta.count
        if (!totalItems.value) {
          toast('Клиент не найден.')
        }
      })
      .catch(() => {
        toast('Клиент не найден.')
      })
}

watch(() => searchQuery.value, (newValue) => {
  if (!newValue) {
    fetchData(currentPage.value)
  }
})
</script>
