<template>
    <section>
        <PageHeading :title="pageTitle" :create="createLink"/>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import Loader from '@/components/common/Loader.vue'
import PageHeading from '@/components/common/PageHeading.vue'

const store = useStore()

const pageTitle = 'Производство';
const createLink = {
    title: 'Добавить Производство',
    url: '/warehouses/production/create'
}
</script>