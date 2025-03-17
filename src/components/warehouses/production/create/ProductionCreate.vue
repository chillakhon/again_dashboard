<template>
    <PageHeading :title="pageTitle"/>
</template>
 
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import PageHeading from '@/components/common/PageHeading.vue'
 
const store = useStore()
const router = useRouter()

const pageTitle = 'Добавить Производство';
</script>