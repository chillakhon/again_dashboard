<template>
  <ModalDialog
      title="Промокоды клиента"
      dynamic-style="2xl:min-w-[70vw] xl:min-w-[75vw] max-md:min-w-full md:min-w-[95vw]"
  >
    <template #trigger>
      <Tickets :size="17" class="text-gray-400 hover:text-gray-700"/>
    </template>


    <template #content>
      <PromoCodeClient
          :client="client"
      />
    </template>

  </ModalDialog>

</template>


<script setup lang="ts">
import ModalDialog from "@/components/dynamics/shadcn/ModalDialog.vue";
import {Tickets} from "lucide-vue-next"
import {Client} from "@/models/Client";
import PromoCodeClient from "@/components/clients/Promo/PromoCodeClient.vue";

const props = defineProps({
  client: Client
})

</script>


<style scoped>

</style>