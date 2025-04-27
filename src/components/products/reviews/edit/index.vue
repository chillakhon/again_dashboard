<template>
  <Drawer v-model:open="isOpen">
    <DrawerTrigger>
      <Pencil class="text-gray-400 hover:text-gray-500 transition" :size="17"/>
    </DrawerTrigger>

    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Редактировать</DrawerTitle>
      </DrawerHeader>
      <div class="m-4">
        <customer-products-list
            :cart="cart"
            ref="editProductComponent"
            @updated="emit('updated', true); isOpen = false"
        />
      </div>
      <DrawerFooter>
        <DrawerClose>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import {ref, watch, nextTick, type Reactive} from 'vue'
import {Pencil} from 'lucide-vue-next';
import {CustomerInvoice} from "~/services/customer/CustomerInvoice";
import axios from "axios";
import {Cart} from "~/services/customer/Cart";
import {User} from "~/services/User";
import {CustomerProductsList} from "#components";
import {Customer} from "~/services/customer/Customer";


const emit = defineEmits(['updated'])
const config = useRuntimeConfig()

const cart = reactive<Cart>(new Cart()) as Reactive<Cart>;


const props = defineProps({
  invoice: CustomerInvoice
})

const isOpen = ref(false)
const editProductComponent = ref<InstanceType<typeof CustomerProductsList> | null>(null);

watch(() => isOpen.value, async (newValue) => {
  if (newValue && props.invoice) {
    // Сбрасываем корзину перед обновлением
    Object.assign(cart, new Cart());

    cart.updateCustomerInvoice(props.invoice)
    await getCustomerById(props.invoice?.customer_id ?? null)
    await getApplicantById(props.invoice?.applicant_id ?? null)
    cart.invoiceDatetime = props.invoice?.invoice_datetime ? new Date(props.invoice.invoice_datetime) : null;

    // Увеличиваем ключ для принудительного ререндера
    await nextTick()
    if (editProductComponent.value) {
      editProductComponent.value.changePaginationType('edit')
    }
  }
})

async function getCustomerById(id: any) {
  if (!id) return
  await axios.get(`${config.public.apiUrl}/api/customer/id/${id}`)
      .then(res => {
        cart.updateCustomer(Customer.fromJSON(res.data.data))
      })
}

async function getApplicantById(id: any) {
  if (!id) return
  await axios.get(`${config.public.apiUrl}/api/user/id/${id}`)
      .then(res => {
        cart.updateApplicant(User.fromJSON(res.data.data))
      })
}

</script>
