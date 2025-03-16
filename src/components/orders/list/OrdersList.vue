<template>
    <section>
        <PageHeading :title="pageTitle" :create="createLink"/>
        
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import PageHeading from '@/components/common/PageHeading.vue'

const store = useStore()

const pageTitle = 'Заказы';
const createLink = {
    title: 'Добавить Заказ',
    url: '/orders/create'
}

const getOrders = () => store.dispatch('orders/getOrders')

const orders = computed(() => store.getters['orders/orders'])
const meta = computed(() => store.getters['orders/meta'])
const hasError = computed(() => store.getters['orders/hasError'])
const isLoading = computed(() => store.getters['orders/isLoading'])

onMounted(() => {
    getOrders();
});


</script>