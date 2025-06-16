<template>
  <div class="flex justify-start ">

    <div @click="dialogOpen = true" class="w-10 cursor-pointer">
      <Image class="text-gray-400 hover:text-gray-500 transition cursor-pointer"/>

      <!--      <img :src="useImageFunctions().getImageByName(item.image_name, 'sm')" alt="img">-->
    </div>

    <DynamicsModal
        :dialog-open="dialogOpen"
        @close="dialogOpen = false"
        title="Фото товара"
        dynamic-style="md:min-w-[700px]"
    >

      <template v-slot:content>
        <ProductImagePreviewAndUpload
            :item="item"
            @uploaded="emit('uploaded'); dialogOpen = false"
        />
      </template>
    </DynamicsModal>
  </div>
</template>

<script setup lang="ts">
import {Image} from "lucide-vue-next";
import {Product} from "@/models/Product";
import DynamicsModal from '@/components/dynamics/Modal.vue';
import {useImageFunctions} from "@/composables/useImageFunctions";
import {ref} from "vue";
import ProductImagePreviewAndUpload from "@/components/products/create/ProductImagePreviewAndUpload.vue";

const dialogOpen = ref(false);

const emit = defineEmits(['uploaded'])

const props = defineProps({
  item: {
    type: Product,
    default: {}
  },
});


</script>

<style scoped></style>
