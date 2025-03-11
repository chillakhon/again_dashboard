<template>
    <Sidebar />
    <main class="py-10 lg:pl-72 ">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RouterView></RouterView>
        </div>
    </main>
</template>
<script setup>
import Sidebar from '@/components/containers/Sidebar.vue';
</script>
