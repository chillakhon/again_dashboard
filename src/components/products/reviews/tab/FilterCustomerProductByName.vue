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
          @current-page="currentPage = $event;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import axios from "axios";
import {toast} from "vue-sonner";
import {Cart} from "~/services/customer/Cart";

defineProps({
  cart: Cart,
})

const config = useRuntimeConfig()
const data = ref()

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);


async function fetchDataByName(FilterByName: string) {

  if (!FilterByName) return

  await axios.get(`${config.public.apiUrl}/api/product/name/${encodeURIComponent(FilterByName)}`, {
    params: {
      page: currentPage.value,
      per_page: itemsPerPage.value
    }
  })
      .then(res => {
        data.value = res.data.data
        totalItems.value = res.data.meta.count
      })
      .catch(() => {
        toast('Ошибка', {
          description: 'По вашему запросу ничего не найдено.',
        });
      });
}

defineExpose({
  fetchDataByName,
});

</script>

<style scoped>

</style>
