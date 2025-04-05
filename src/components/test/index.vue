<template>
  <div class="flex m-5">

    <div class="border rounded-lg mr-2 p-2 ">
      <div class="pl-1">Клиенты</div>
      <customer-list
          key="customer-list"
          :cart="cart"
      />
    </div>

    <div class="flex-1 space-x-2">
      <Tabs v-model="currentTabValue">
        <TabsList>
          <TabsTrigger @click="changeTab('customer-invoice')" value="customer-invoice">
            Продажы
          </TabsTrigger>
          <TabsTrigger @click="changeTab('customer-sale')" value="customer-sale">
            Новый продаж
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Платежи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer-invoice" class="h-full">

<!--          <div class="w-full my-2">-->
<!--            <carts-analitic />-->
<!--          </div>-->


          <div class="w-full border rounded-lg p-2 space-y-2 ">
            <customer-invoices-list
                :cart="cart"
            />
          </div>
        </TabsContent>

        <TabsContent value="customer-sale" class="">
          <div class="w-full border rounded-lg p-2 space-y-2 h-full">
            <div class="pl-1 ">Товары</div>
            <customer-products-list
                key="ProductsList"
                :cart="cart"
            />
          </div>
        </TabsContent>
      </Tabs>

    </div>
  </div>
</template>

<script setup lang="ts">
import {Tabs, TabsContent, TabsList, TabsTrigger} from "~/components/ui/tabs";
import {useTabsStore} from "~/stores/useTabsStore";
import {storeToRefs} from "pinia";
import type {Reactive} from "vue";
import {Cart} from "~/services/customer/Cart";
import {reactive} from "vue";
import CartsAnalitic from "~/components/customer/CartsAnalitic.vue";

const cart = reactive<Cart>(new Cart()) as Reactive<Cart>;
const tabStore = useTabsStore()
const {currentTabValue} = storeToRefs(tabStore);

const changeTab = (value: string | number) => {
  tabStore.setCurrentTab(value);
};

onMounted(() => {
  tabStore.setCurrentTab('customer-invoice')
})

</script>

<style scoped>


</style>
