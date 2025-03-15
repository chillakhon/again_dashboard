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

const pageTitle = 'Клиенты';
const createLink = {
    title: 'Добавить Клиента',
    url: '/clients/create'
}

const getClients = () => store.dispatch('clients/getClients')

const clients = computed(() => store.getters['clients/clients'])
const meta = computed(() => store.getters['clients/meta'])
const hasError = computed(() => store.getters['clients/hasError'])
const isLoading = computed(() => store.getters['clients/isLoading'])

onMounted(() => {
    getClients();
});

</script>
