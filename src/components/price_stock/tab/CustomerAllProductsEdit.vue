<template>
  <div class="rounded-md border">
    <customer-products-table
        :cart="cart"
        :data="data"
    />
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="space-x-2">
      <PaginationTable
          :total="totalItems"
          :default-page="currentPage"
          :items-per-page="itemsPerPage"
          :sibling-count="1"
          :show-edges="true"
          @current-page="currentPage = $event; fetchData($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {nextTick, ref} from "vue";
import axios from "axios";
import {Product} from "~/services/Product";
import {ProductItem} from "~/services/customer/ProductItem";
import {Cart} from "~/services/customer/Cart";

const props = defineProps({
  cart: Cart,
})

const config = useRuntimeConfig()
const data = ref()

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);


onMounted(async () => {
  await fetchDataCustomerInvoice(currentPage.value)
  await fetchData(currentPage.value)
})


async function fetchData(curPage: any) {
  await nextTick()
  await axios.get(`${config.public.apiUrl}/api/product?customer_invoice_id=${props.cart?.customerInvoice?.id}&page=${curPage}&per_page=${itemsPerPage.value}`)
      .then(res => {
        data.value = res.data.data
        totalItems.value = res.data.meta.count
      })
      .catch(err => {
        console.log(err)
      })
}

async function fetchDataCustomerInvoice(curPage: any) {
  await nextTick()
  await axios.get(`${config.public.apiUrl}/api/customer-invoice/details/${props.cart?.customerInvoice?.id}?page=${curPage}&per_page=500`)
      .then(res => {
        setProductItemsToCart(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
}

function setProductItemsToCart(customerInvoiceDetails: any) {
  const cart = props.cart

  cart?.clearCart()
  if (customerInvoiceDetails.length) {
    customerInvoiceDetails.map((item: any) => {
      const product = new Product({
        id: item.product_id,
        price: item.retail_price,
        name: '',
        barcode: ''
      })
      const productItem = new ProductItem(product)
      productItem.qty = item.qty
      productItem.price = item.retail_price ?? item.price
      cart?.addProductItem(productItem)
    })
  }
}

</script>

<style scoped>

</style>
