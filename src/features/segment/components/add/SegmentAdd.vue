<template>
  <SegmentFormModal
      :form-data="formData"
      @submit-form="handleCreate"
  />
</template>

<script setup lang="ts">
import SegmentFormModal from "@/features/segment/components/form/SegmentFormModal.vue";
import {
  createSegmentFormData,
  CreateSegmentRequest,
  formDataToCreateRequest,
  SegmentFormData
} from "@/features/segment/types";
import {ref} from "vue";
import {useSegments} from "@/features/segment/composables/useSegments";

const formData = ref<SegmentFormData>(createSegmentFormData());

const {createSegment} = useSegments()

const handleCreate = async (): Promise<void> => {
  const prepareFData: CreateSegmentRequest = formDataToCreateRequest(formData.value)
  await createSegment(prepareFData)
}

</script>

<style scoped>

</style>