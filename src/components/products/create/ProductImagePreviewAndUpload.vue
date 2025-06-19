<template>
  <Loader v-if="isLoading"/>
  <ImageManager
      v-else
      v-model="images"
      :image-size="{
        value: 'md'
      }"
      @saveImage="saveImage"
  />
  <ShadcnProgress
      class="mt-2"
      v-if="isUploading"
      :target-progress="uploadProgress"
      :auto-start="true"
  />
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {ImageModel} from '@/models/ImageModel'
import {Product} from "@/models/Product";
import {useImageFunctions} from '@/composables/useImageFunctions';
import ImageManager from "@/components/dynamics/ImageManager.vue";
import ShadcnProgress from "@/components/dynamics/ShadcnProgress.vue";
import {toast} from "vue-sonner";

const {uploadImage, getImages, deleteImage} = useImageFunctions();
const renderListImage = ref(1)

const emits = defineEmits(['uploaded', 'saveImage']);

const isUploading = ref(false);
const uploadProgress = ref(50)

const isLoading = ref(true)

const props = defineProps({
  item: {
    type: Product,
    required: true
  },
})

const images = ref<ImageModel[]>(props.item?.images || []);

const fetchImages = async () => {

  if (!props.item.id) return

  images.value = await getImages('Product', props.item.id);
};


const saveImage = async () => {


  props.item.images = images.value;
  emits("saveImage", images.value);
  toast.success('Фото варианта сохронены')


  console.log(images.value)
  console.log(props.item?.images)


  return
  emits('uploaded');
  // console.log(props.item)
  // console.log(images.value)
  return

  const imagesToUpload = images.value.map(img => ({
    file: img.file,
    name: img.path
  }));

  if (!props.item?.id) return

  isUploading.value = true;

  try {
    await uploadImage(
        'Product',
        props.item?.id,
        imagesToUpload,
        (progress) => {
          uploadProgress.value = progress;
        }
    );
  } finally {
    isUploading.value = false;
    emits('uploaded')
  }
};

onMounted(async () => {
  // await fetchImages();
  isLoading.value = false
});
</script>
