<template>
  <div class="w-full">
    <DynamicTabs :tabs="tabs" v-model="tab" class="w-full">

      <template #discount class="w-full">
        <DiscountList/>
      </template>

      <template #promo>
        <PromoList/>
      </template>
    </DynamicTabs>
  </div>
</template>

<script setup lang="ts">
import DynamicTabs from "@/components/dynamics/shadcn/DynamicTabs.vue";
import {ref} from "vue";
import DiscountList from "@/components/discount/DiscountList.vue";
import PromoList from "@/components/discount/Promo/PromoList.vue";

const tab = ref('discount');

const tabs = ref([
  {title: 'Скидки', tab: 'discount'},
  {title: 'Промокоды', tab: 'promo'},
  {title: 'Рефералка', tab: 'referalka', disabled: true},
  {title: 'Сертификаты', tab: 'sertifik', disabled: true},
])


</script>

<style scoped>

</style>