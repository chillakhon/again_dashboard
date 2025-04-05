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
          @current-page="currentPage = $event; filterProductItems()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Cart} from "~/services/customer/Cart";

const props = defineProps({
  cart: Cart,
})

const data = ref()
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);


filterProductItems()

function filterProductItems() {

  const productItems = props.cart?.productItems ?? []
  let products = productItems.map((item) => {
    return {
      id: item.product?.id,
      barcode: item.product?.barcode,
      name: item.product?.name,
      price: item.product?.price
    }
  })

  totalItems.value = products.length;

  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  data.value = products.slice(startIndex, endIndex)
}


</script>

<style scoped>

</style>
