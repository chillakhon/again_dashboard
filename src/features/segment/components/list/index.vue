<template>
  <div class="space-y-2">

    <div class="md:flex justify-between items-center max-md:space-y-2">
      <SegmentSearch
          :filter="searchParams"
      />
      <SegmentAdd/>
    </div>

    <SegmentTable
        :loading="sending"
        :segments="segments"
        :pagination="searchParams"
    />
  </div>
</template>

<script setup lang="ts">
import {useSegments} from "@/features/segment/composables/useSegments";
import {Segment, SegmentSearchType} from "@/features/segment/types";
import {onMounted, ref} from "vue";
import SegmentTable from "@/features/segment/components/list/SegmentTable.vue";
import SegmentAdd from "@/features/segment/components/add/SegmentAdd.vue";
import SegmentSearch from "@/features/segment/components/list/SegmentSearch.vue";

const segments = ref<Segment[]>();

const searchParams = ref<SegmentSearchType>({
  page: 1,
  per_page: 15,
  total: 0,
  search: undefined,
  is_active: undefined,
});

const {getSegments, sending} = useSegments()

onMounted(async () => {
  await getSegments(searchParams.value)
})


</script>

<style scoped>

</style>