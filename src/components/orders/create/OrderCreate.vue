<template>
     <PageHeading :title="pageTitle"/>
</template>

<script setup>
import { ref } from 'vue';
import PageHeading from '@/components/common/PageHeading.vue'

const pageTitle = 'Добавить заказ';

</script>