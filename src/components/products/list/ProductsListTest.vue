<template>
    <section>
        <PageHeading :title="pageTitle" :create="createLink"/>
        <Loader v-if="isLoading"/>
        <div v-else class="px-4 sm:px-6 lg:px-8">
            <div class="mt-8 flow-root">
                <div v-if="products && products.length != 0" class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">Name</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="product in products" :key="product.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3  text-sm text-gray-500">{{ product?.id }}</td>
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">{{ product?.name }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ product?.description }}</td>
                                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                        <Dropdown>
                                            <MenuItem v-slot="{ active }">
                                                <a href="#" disabled :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                                                    <PhNotePencil :class="[active ? 'text-gray-500' : '', 'mr-3 size-5 text-gray-400']" aria-hidden="true" />
                                                    Edit
                                                </a>
                                            </MenuItem>
                                            <MenuItem v-slot="{ active }">
                                                <a href="#" @click.prevent="toggleDeleteModal(product)" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                                                    <PhTrash :class="[active ? 'text-gray-500' : '', 'mr-3 size-5 text-gray-400']" aria-hidden="true" />
                                                    Delete
                                                </a>
                                            </MenuItem>
                                        </Dropdown>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- <Pagination :currentPage="meta?.current_page" :perPage="meta?.per_page" :totalItems="meta?.total_count" :totalPages="meta?.total_pages" /> -->
                </div>
                <div v-else class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h3 class="text-3xl font-extrabold text-gray-500 sm:text-4xl">Ничего не найдено</h3>
                </div>
            </div>
        </div>
    </section>
    <Delete :open="isDeleteModalOpen" :productId="selectedProductId" @close="toggleDeleteModal" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import { MenuItem } from '@headlessui/vue'
import { PhNotePencil, PhTrash } from '@phosphor-icons/vue'

import Delete from '../modals/Delete.vue'
import Loader from '@/components/common/Loader.vue'
import PageHeading from '@/components/common/PageHeading.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import Pagination from '@/components/common/Pagination.vue'

const store = useStore()

const pageTitle = 'Товары';
const createLink = {
    title: 'Добавить Товары',
    url: '/products/create'
}

const getProducts = () => store.dispatch('products/getProducts')

const products = computed(() => store.getters['products/products'])
const meta = computed(() => store.getters['products/meta'])
const hasError = computed(() => store.getters['products/hasError'])
const isLoading = computed(() => store.getters['products/isLoading'])

onMounted(() => {
    getProducts();
});

const selectedProductId = ref(null);
const isDeleteModalOpen = ref(false);

const toggleDeleteModal = (customer) => {
    selectedProductId.value = customer?.id;
    isDeleteModalOpen.value = !isDeleteModalOpen.value;
};
</script>
