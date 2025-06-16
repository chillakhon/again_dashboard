<template>
  <div class="space-y-4">
    <div>
      <div class="grid w-full items-center gap-4">
        <div class="flex flex-col space-y-1.5 p-2 cursor-pointer">
          <Input
              class="cursor-pointer"
              id="image-upload"
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleFileUpload"
          />
        </div>

        <div v-if="sortedImages.length > 0" class="space-y-2 flex-1 flex-col">
          <Label>Список изображений</Label>
          <div class="space-y-2">
            <div
                v-for="(element, index) in sortedImages"
                :key="element.id || new Date().getSeconds()"
                class="group relative hover:bg-muted/50 transition-colors border rounded-md"
                draggable="true"
                @dragstart="handleDragStart($event, index)"
                @dragover.prevent="handleDragOver($event, index)"
                @dragenter.prevent="handleDragEnter($event, index)"
                @dragleave.prevent
                @drop.prevent="handleDrop($event, index)"
                @dragend="handleDragEnd"
                :class="{ 'opacity-50': draggedItemIndex === index }"
            >
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                  <div class="h-20 w-20" v-if="getPreviewUrl(element)">
                    <img
                        :src="getPreviewUrl(element)"
                        :alt="element.path || element.file?.name || 'Uploaded image'"
                        class="object-cover rounded-md border m-1"
                        draggable="false"
                    />
                  </div>
                  <div
                      v-else
                      class="h-16 w-16 bg-muted flex items-center justify-center rounded-md"
                  >
                    <UploadIcon class="h-6 w-6 text-muted-foreground"/>
                  </div>
                </div>

                <div class="flex-grow min-w-0">
                  <p class="text-sm font-medium truncate">
                    {{ element.file?.name || element.path || 'New image' }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Position: {{ element.position + 1 }}
                  </p>
                </div>

                <div class="flex items-center gap-1">
                  <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      :disabled="element.position === 0"
                      @click="moveUp(element.id!)"
                  >
                    <ArrowUpIcon class="h-4 w-4"/>
                  </Button>
                  <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8"
                      :disabled="element.position === sortedImages.length - 1"
                      @click="moveDown(element.id!)"
                  >
                    <ArrowDownIcon class="h-4 w-4"/>
                  </Button>
                  <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 text-destructive hover:text-destructive"
                      @click="removeImage(element.id!)"
                  >
                    <TrashIcon class="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else
             @click="triggerFileInput"
             class="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg cursor-pointer"
        >
          <UploadIcon class="h-10 w-10 text-muted-foreground mb-2"/>
          <p class="text-sm text-muted-foreground">No images uploaded yet</p>
        </div>
      </div>
    </div>

    <div  class="flex justify-between">
      <p class="text-sm text-muted-foreground">
        {{ sortedImages.length }} image{{ sortedImages.length !== 1 ? 's' : '' }} uploaded
      </p>

      <Button variant="outline" @click="emit('upload')">Сохранить</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, computed} from 'vue'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {TrashIcon, ArrowUpIcon, ArrowDownIcon, UploadIcon} from 'lucide-vue-next'
import {ImageModel} from "@/models/ImageModel";
import {ImageManager} from "@/models/ImageManager";

const props = defineProps<{
  modelValue: ImageModel[],
  imageSize?: { value: string }
}>()


const emit = defineEmits(['update:modelValue', 'upload']);

const fileInput = ref<HTMLInputElement | null>(null)
const images = ref<ImageModel[]>(props.modelValue || [])
const imageManager = new ImageManager(images.value)
const draggedItemIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)


const triggerFileInput = () => {
  fileInput.value?.click()
}

// Watch for changes in images and emit updates
watch(images, (newVal) => {
  emit('update:modelValue', newVal)
}, {deep: true})

const handleFileUpload = async (event: Event,) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const files = Array.from(input.files);


    // Локальное добавление для превью
    const newImages = files.map((file, index) => {
      return new ImageModel({
        id: Date.now() + Math.random(),
        file,
        path: '',
        position: index
      });
    });

    newImages.forEach(img => imageManager.addImage(img));
    images.value = imageManager.getAllImages();

    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
}

const removeImage = (id: number) => {
  imageManager.removeImage(id)
  images.value = imageManager.getAllImages()
}

const moveUp = (id: number) => {
  imageManager.moveUp(id)
  images.value = imageManager.getAllImages()
}

const moveDown = (id: number) => {
  imageManager.moveDown(id)
  images.value = imageManager.getAllImages()
}

const getPreviewUrl = (image: ImageModel) => {
  if (image.file) {
    return URL.createObjectURL(image.file);
  }
  if (image.path) {
    return props.imageSize
        ? image.imageURL(props.imageSize)
        : image.path;
  }
  return '';
}

const sortedImages = computed({
  get: () => [...images.value].sort((a, b) => a.position - b.position),
  set: (newVal) => {
    images.value = newVal
    imageManager.normalizePositions()
  }
})

const handleDragStart = (event: DragEvent, index: number) => {
  draggedItemIndex.value = index;
  event.dataTransfer?.setData('text/plain', index.toString());
  event.dataTransfer!.effectAllowed = 'move';

  const element = event.target as HTMLElement;
  element.classList.add('dragging');
}

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  dragOverIndex.value = index;
  event.dataTransfer!.dropEffect = 'move';
}

const handleDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault();
  dragOverIndex.value = index;
}

const handleDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();
  if (draggedItemIndex.value === null) return;

  const dragIndex = draggedItemIndex.value;
  if (dragIndex === dropIndex) return;

  // Create a new array with the moved item
  const newItems = [...sortedImages.value];
  const [movedItem] = newItems.splice(dragIndex, 1);
  newItems.splice(dropIndex, 0, movedItem);

  // Update positions
  newItems.forEach((item, index) => {
    item.position = index;
  });

  // Update the sorted array
  sortedImages.value = newItems;

  // Reset drag states
  draggedItemIndex.value = null;
  dragOverIndex.value = null;

  // Remove visual feedback
  const elements = document.querySelectorAll('.dragging');
  elements.forEach(el => el.classList.remove('dragging'));
}

const handleDragEnd = () => {
  draggedItemIndex.value = null;
  dragOverIndex.value = null;

  // Remove visual feedback
  const elements = document.querySelectorAll('.dragging');
  elements.forEach(el => el.classList.remove('dragging'));
}
</script>

<style>
.dragging {
  opacity: 0.5;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
