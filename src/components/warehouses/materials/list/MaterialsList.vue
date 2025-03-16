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

const pageTitle = 'Материалы';
const createLink = {
    title: 'Добавить Материал',
    url: '/warehouses/materials/create'
}

const getMaterials = () => store.dispatch('materials/getMaterials')

const materials = computed(() => store.getters['materials/materials'])
const hasError = computed(() => store.getters['materials/hasError'])
const isLoading = computed(() => store.getters['materials/isLoading'])

onMounted(() => {
    getMaterials();
});

</script>