<template>
  <Loader v-if="isLoading"/>
  <Form v-else
        :batch="batch"
  />
</template>

<script setup>
import Form from "@/components/warehouses/production/edit/Form.vue"
import axios from "axios";
import {useRoute} from "vue-router";
import {ref, onMounted} from "vue";
import {toast} from "vue-sonner";

const route = useRoute()
const isLoading = ref(true)
const batch = ref()

onMounted(async () => {
  await fetchProduction()
})

async function fetchProduction(batchNumber) {
  await axios.get(`/production?batch_number=${route.params.id}&with_batches=true`)
      .then(res => {
        console.log(res.data)
        batch.value = res.data?.data
      })
      .catch(err => {
        toast.error(err.response.data.message || err.response.data.error || 'Что то пащло не так!')
      })
      .finally(() => {
        isLoading.value = false
      })
}
</script>

<style scoped></style>
