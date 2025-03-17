<template>
     <div>
        <PageHeading :title="pageTitle"/>
        <div class="mt-10 mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div class="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2">
                <form @submit.prevent="handleCreate">
                    
                    <div class="">
                        <label for="client" class="block text-sm/6 font-medium text-gray-900">Способ доставки</label>
                        <div class="mt-2 grid grid-cols-1">
                            <select v-model="data.client_id" id="client" name="client" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                <option value="1">Test-1</option>
                                <option value="2">Test-2</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- <div class="">
                        <label for="product" class="block text-sm/6 font-medium text-gray-900">Способ доставки</label>
                        <div class="mt-2 grid grid-cols-1">
                            <select v-model="data.product" id="product" name="product" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                <option value="1">Test-1</option>
                                <option value="2">Test-2</option>
                            </select>
                        </div>
                    </div> -->

                    <div class="mt-4 grid grid-cols-4 gap-x-6">
                        <div class="sm:col-span-2 sm:col-start-1">
                            <label for="status" class="block text-sm/6 font-medium text-gray-900">Способ доставки</label>
                            <div class="mt-2 grid grid-cols-1">
                                <select v-model="data.status" id="status" name="status" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                    <option value="new">Новый</option>
                                </select>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="payment_status" class="block text-sm/6 font-medium text-gray-900">Способ доставки</label>
                            <div class="mt-2 grid grid-cols-1">
                                <select v-model="data.payment_status" id="payment_status" name="payment_status" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                    <option value="pending">Ожидание</option>
                                    <option value="paid">Оплачено</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 grid grid-cols-4 gap-x-6">
                        <div class="sm:col-span-2 sm:col-start-1">
                            <label for="delivery_date" class="block text-sm/6 font-medium text-gray-900">Дата и время доставка</label>
                            <div class="mt-2">
                                <input v-model="data.delivery_date" :disabled="isLoading" id="delivery_date" name="delivery_date" type="datetime-local" autocomplete="datetime" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="delivery_method" class="block text-sm/6 font-medium text-gray-900">Способ доставки</label>
                            <div class="mt-2 grid grid-cols-1">
                                <select v-model="data.delivery_method.name" id="delivery_method" name="delivery_method" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                    <option>Курьерская доставка</option>
                                    <option>Сдэк</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <label for="notes" class="block text-sm/6 font-medium text-gray-900">Комментарий</label>
                        <div class="mt-2">
                            <textarea v-model="data.notes" name="notes" id="notes" rows="2" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    
                    <div class="mt-6 flex items-center justify-end gap-x-6">
                        <button type="submit" :disabled="isLoading" class="rounded-md bg-red-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                            <span v-if="!isLoading">Создать</span>
                            <span v-else>Создание...</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
     </div>
</template>
 
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { PhCaretDown } from '@phosphor-icons/vue';

import PageHeading from '@/components/common/PageHeading.vue'
 
const store = useStore()
const router = useRouter()

const pageTitle = 'Добавить заказ';
 
const data = reactive({
    client_id: 1,
    items: [
        {
            product_id: '1',
            variant_id: '1',
            quantity: '1',
            price: '10',
        }
    ],
    notes: '',
    status: 'new',
    payment_status: '',
    delivery_date: '',
    delivery_method: {
        name: '',
    }
})

const getProducts = () => store.dispatch('products/getProducts')
const products = computed(() => store.getters['products/products'])

const getClients = () => store.dispatch('clients/getClients')
const clients = computed(() => store.getters['clients/clients'])

onMounted(() => {
    getProducts();
    getClients();
});

const create = (data) => store.dispatch('orderActions/createOrder', data)

const status = computed(() => store.getters['orderActions/status'])
const error = computed(() => store.getters['orderActions/error'])
const isLoading = computed(() => store.getters['orderActions/isLoading'])
 

const handleCreate = () => {
    create(data)
}
 
watch(status, (newValue) => {
    if (newValue) {
        router.push('/orders/list')
    }
})
 
</script>