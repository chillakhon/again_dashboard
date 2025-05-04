<template>
  <DiscountsEditForm
      :discount="item"
  />

</template>

<script setup lang="ts">
import DiscountsEditForm from "@/components/discounts/Edit/Form.vue";
import {Discount} from "@/models/Discount";

const props = defineProps({
  item: {
    type: Object as () => Discount,
    required: true
  }
})


</script>

<style scoped></style>