<template>
  PromoCode
  {{ client }}
</template>
<script setup lang="ts">
import {Client} from "@/models/Client";

const props = defineProps({
  client: Client
})
</script>

<style scoped>

</style>