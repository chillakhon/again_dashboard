<template>
    <div>
        <PageHeading :title="pageTitle"/>
        <form @submit.prevent="handleCreate">
            <div class="mt-10 mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <div class="lg:col-start-3 lg:row-end-1">
                    <div class="p-6 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
                        <div class="flex flex-wrap">
                            <div class="flex-auto">
                                <h2 class="text-sm/6 font-semibold text-gray-900">Состояние товара</h2>
                            </div>
                            <div class="mt-6 flex w-full gap-x-4 border-t border-gray-900/5 pt-6">
                                <SwitchGroup as="div" class="w-full flex items-center justify-between">
                                    <span class="flex grow flex-col">
                                    <SwitchLabel as="span" class="text-sm/6 font-medium text-gray-900" passive>Показывать на сайте</SwitchLabel>
                                    </span>
                                    <Switch v-model="data.is_active" :class="[data.is_active ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
                                        <span aria-hidden="true" :class="[data.is_active ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                                    </Switch>
                                </SwitchGroup>
                            </div>
                            
                            <div class="mt-6 flex w-full gap-x-4 border-t border-gray-900/5 pt-6">
                                <SwitchGroup as="div" class="w-full flex items-center justify-between">
                                        <span class="flex grow flex-col">
                                            <SwitchLabel as="span" class="text-sm/6 font-medium text-gray-900" passive>Предзаказ</SwitchLabel>
                                        </span>
                                        <Switch v-model="data.allow_preorder" :class="[data.allow_preorder ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2']">
                                            <span aria-hidden="true" :class="[data.allow_preorder ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                                        </Switch>
                                        <span class="ml-2">
                                            <SwitchDescription as="span" class="text-sm text-gray-500"></SwitchDescription>
                                        </span>
                                </SwitchGroup>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2">
                    <div class="mt-8">
                        <div class="">
                            <label for="name" class="block text-sm/6 font-medium text-gray-900">Наименование</label>
                            <div class="mt-2">
                                <input v-model="data.name" id="name" name="name" type="text" autocomplete="name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div class="mt-4">
                            <label for="description" class="block text-sm/6 font-medium text-gray-900">Описание</label>
                            <div class="mt-2">
                                <textarea v-model="data.description" name="description" id="description" rows="3" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                            <p class="mt-3 text-sm/6 text-gray-600">Добавьте описание к товару.</p>
                        </div>
                    </div>
                    <div class="mt-4 grid grid-cols-6 gap-x-6">
                        <div class="sm:col-span-2 sm:col-start-1">
                            <label for="Price" class="block text-sm/6 font-medium text-gray-900">Price</label>
                            <div class="mt-2">
                                <input v-model="data.price" type="number" name="Price" id="Price" autocomplete="address-level2" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="cost_price" class="block text-sm/6 font-medium text-gray-900">Cost Price</label>
                            <div class="mt-2">
                                <input v-model="data.cost_price" type="number" name="cost_price" id="cost_price" autocomplete="address-level1" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="discount_price" class="block text-sm/6 font-medium text-gray-900">Discount Price</label>
                            <div class="mt-2">
                                <input v-model="data.discount_price" type="number" name="discount_price" id="discount_price" autocomplete="discount_price" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4 grid grid-cols-6 gap-x-6">
                        <div class="sm:col-span-2 sm:col-start-1">
                            <label for="stock_quantity" class="block text-sm/6 font-medium text-gray-900">Stock Quantity</label>
                            <div class="mt-2">
                                <input v-model="data.stock_quantity" type="number" name="stock_quantity" id="stock_quantity" autocomplete="address-level2" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="min_order_quantity" class="block text-sm/6 font-medium text-gray-900">Min Order Quantity</label>
                            <div class="mt-2">
                                <input v-model="data.min_order_quantity" type="number" name="min_order_quantity" id="min_order_quantity" autocomplete="address-level1" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="max_order_quantity" class="block text-sm/6 font-medium text-gray-900">Max Order Quantity</label>
                            <div class="mt-2">
                                <input v-model="data.max_order_quantity" type="number" name="max_order_quantity" id="max_order_quantity" autocomplete="discount_price" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>
                    </div>
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
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue'

import PageHeading from '@/components/common/PageHeading.vue'

const store = useStore()
const router = useRouter()

const pageTitle = 'Добавить товар';

const data = reactive({
    name: '',
    description: '',
    type: 'simple',
    default_unit_id: '1',
    is_active: ref(false),
    has_variants: ref(false),
    allow_preorder: ref(false),
    after_purchase_processing_time: '3',
    price: '',
    cost_price: '',
    stock_quantity: '',
    min_order_quantity: '',
    max_order_quantity: '',
    is_featured: ref(false),
    is_new: ref(true),
    discount_price: '',
    // sku: SKU12345,
    // barcode: 123456789012,
    weight: '1.5',
    length: '10',
    width: '5',
    height: '2',
    categories: [
        1,
    ]
})

const create = (data) => store.dispatch('productActions/createProduct', data)

const status = computed(() => store.getters['productActions/status'])
const error = computed(() => store.getters['productActions/error'])
const isLoading = computed(() => store.getters['productActions/isLoading'])


const handleCreate = () => {
    create(data)
}

watch(status, (newValue) => {
    if (newValue) {
        router.push('/products/list')
    }
})


</script>