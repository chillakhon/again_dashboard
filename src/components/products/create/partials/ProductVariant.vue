<template>
  <div class="space-y-5 font-medium text-sm">

    <div class="border-b py-3 pl-1 text-sm text-gray-800">Варианты товара</div>

    <div class="text-gray-300 p-2">
      Варианты товара - это отдельные товарные позиции, которые отличаются по одной или нескольким значениям свойств
      вариантов. Например, футболка размера S может быть вариантом товара футболка
    </div>


    <Drawer>
      <DrawerTrigger class="text-blue-300">Посмотреть</DrawerTrigger>
      <DrawerContent>
        <div class="h-[80vh] overflow-y-auto p-2">

          <!--          <div>-->

          <div class="flex w-full justify-between items-center mb-2">

            <span class="font-medium text-gray-600">Варианты товара</span>

            <Button variant="outline" @click="product.variants?.push(Product.fromJSONForVariantCreate({})); renderTable++">
              <Plus />
              Добавить
            </Button>
          </div>

          <ProductVariantTable
              class="w-full"
              :key="renderTable"
              :product="product"
          />

          {{product.variants}}
          <!--          </div>-->

        </div>
      </DrawerContent>

    </Drawer>

  </div>
</template>

<script setup lang="ts">
import {Plus} from 'lucide-vue-next'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {ref} from "vue";
import {Product} from "@/models/Product";
import ProductVariantTable from "@/components/products/create/ProductVariantTable.vue";

const props = defineProps({
  product: {
    type: Product,
    required: true,
  }
})


const renderTable = ref()

const units = ref()

const fetchUnits = async () => {
  axios.get('units').then(res => {
    units.value = res.data
  })
}

fetchUnits()

</script>
