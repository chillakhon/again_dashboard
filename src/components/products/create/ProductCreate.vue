<template>
    <div>
        <PageHeading :title="pageTitle"/>
        <ImageUpload />
    </div>
</template>

<script setup>
import PageHeading from '@/components/common/PageHeading.vue'
import ImageUpload from './partials/ImageUpload.vue'

const pageTitle = 'Добавить товар';
</script>