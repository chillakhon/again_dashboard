<template>
  <div class="flex space-x-2 justify-end">


    <CityZoneDetailsShow :city_zone="item"/>

    <DynamicsDataTableEdit
        :item="item"
        :edit="edit"
        @save_changes="$emit('save_changes', $event)"
    />
    <dynamics-alert-dialog
        title=""
        description="Вы уверены что хотите удалить?"
        button-name="Удалить"
        button-style="bg-red-500 hover:bg-red-600"
        :icon="Trash2"
        @continue="$emit('deleted', item)"
    />

    <ArrowRight
        class="text-gray-400 hover:text-gray-500 transition cursor-pointer"
        :size="17" @click="changeTab(item)"
    />

  </div>
</template>

<script setup lang="ts">
import {Trash2, ArrowRight, Pencil, Eye} from "lucide-vue-next";
import {useTabsStore} from "~/stores/useTabsStore";

const tabStore = useTabsStore()

defineProps({
  item: {
    type: Object,
    required: true
  },
  edit: {
    type: Object,
    required: true
  }
});

defineEmits([
  'save_changes', 'deleted', 'arrow_right'
]);


const changeTab = (value: any) => {
  tabStore.setItem(value)
  if (value) {
    tabStore.setCurrentTab('customer_zones');
  }
};

</script>
