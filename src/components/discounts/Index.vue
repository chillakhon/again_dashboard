<template>
  <Loader v-if="isLoading"/>
  <div v-else>
    <div class="md:flex justify-between md:mb-2">
      <BackButton title="Скидки по купонам"/>
      <DiscountsAdd
          class="max-md:my-2"
          @submit="fetchData()"
      />
    </div>
    <DiscountsTable
        :discounts="discounts"
        @deleted="deleteDiscount($event)"
        @updated="fetchData"
        :key="discounts.length"
    />
    <div
        class="mt-2 flex justify-end"
    >
      <PaginationTable
          :items-per-page="itemsPerPage"
          :total="totalItems"
          :default-page="currentPage"
          @current-page="
          currentPage = $event;
          fetchData();
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref, onMounted} from "vue"
import PaginationTable from "@/components/PaginationTable.vue";
import DiscountsTable from "@/components/discounts/Table.vue";
import DiscountsAdd from "@/components/discounts/Add/Index.vue";
import Loader from "@/components/common/Loader.vue";
import {Discount} from "@/models/Discount";
import BackButton from "@/components/BackButton.vue";

const discounts = ref<Discount[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const totalItems = ref(0);
const itemsPerPage = ref(1);

const deleteDiscount = (discount: Discount) => {
  discounts.value = discounts.value.filter(
      (item) => item.id !== discount.id
  );
};

async function fetchData() {
  isLoading.value = true;

  try {
    const response = await axios.get(
        `/discounts?page=${currentPage.value}&per_page=${itemsPerPage.value}`
    );

    if (response.data?.discounts) {
      discounts.value = response.data.discounts.data.map((item: any) => Discount.fromJSON(item));
      totalItems.value = response.data.discounts.total;
      console.log(discounts.value)
    }
  } catch (error) {
    console.error("Error fetching discounts:", error);
    discounts.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>