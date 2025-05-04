<template>
<!--  <div class="flex h-full">-->
<!--    &lt;!&ndash; Боковое меню &ndash;&gt;-->
<!--    <div class="w-64 border-r p-4">-->
<!--      <h1 class="text-xl font-bold mb-6">Настройки</h1>-->

<!--      <div>-->
<!--        <h2 class="text-sm font-semibold text-gray-500 uppercase mb-2">Настройки магазина</h2>-->
<!--        <nav class="space-y-1">-->
<!--          <router-link-->
<!--              v-for="item in menuItems"-->
<!--              :key="item.path"-->
<!--              :to="item.path"-->
<!--              class="block px-2 py-1 text-sm rounded hover:bg-gray-100"-->
<!--              active-class="bg-gray-100 font-medium"-->
<!--          >-->
<!--            <span v-if="item.checked" class="inline-block w-4 h-4 mr-2">✓</span>-->
<!--            {{ item.title }}-->
<!--          </router-link>-->
<!--        </nav>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; Основное содержимое &ndash;&gt;-->
<!--  </div>-->

  <div class="flex-1 p-6">
    <router-view/>
  </div>

</template>

<script lang="ts" setup>
import {ref} from "vue";

const menuItems = ref([
  {path: '/settings/store', title: 'Настройки сайта', checked: true},
  {path: '/settings/product-params', title: 'Параметры товаров', checked: false},
  {path: '/settings/variant-props', title: 'Свойства вариантов', checked: false},
  {path: '/settings/delivery-methods', title: 'Доставка', checked: false},
  {path: '/settings/custom-statuses', title: 'Пользовательские статусы', checked: false},
  {path: '/settings/one-click-order', title: 'Заказ в один клик', checked: false},
])
</script>