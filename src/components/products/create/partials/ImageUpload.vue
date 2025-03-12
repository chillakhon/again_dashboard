<template>
    <form @submit.prevent="uploadImages">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-1">
                        <div @dragover.prevent @drop="handleDrop" class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-3 py-6">
                            <div class="text-center">
                                <PhotoIcon class="mx-auto size-10 text-gray-300" aria-hidden="true" />
                                <div class="mt-4 text-sm/6 text-gray-600">
                                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input @change="handleFileUpload" id="file-upload" name="file-upload" type="file" class="sr-only" />
                                    </label>
                                </div>
                                <p class="text-xs text-gray-600">PNG, JPG</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="imagePreviews.length" v-for="(src, index) in imagePreviews" :key="index" class="relative sm:col-span-1">
                        <img :src="src" alt="Preview" class="w-36 h-36 object-cover rounded-md" />
                        <button @click="removeImage(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">
                            X
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
  
<script setup>
import { ref } from "vue";
import { PhotoIcon } from '@heroicons/vue/24/solid'

const selectedFiles = ref([]);
const imagePreviews = ref([]);

const handleFileUpload = (event) => {
    processFiles(Array.from(event.target.files));
};

const handleDrop = (event) => {
    event.preventDefault();
    processFiles(Array.from(event.dataTransfer.files));
};

const processFiles = (files) => {
    files.forEach((file) => {
        if (file.size <= 10 * 1024 * 1024) {
            selectedFiles.value.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
            imagePreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
        }
    });
};

const removeImage = (index) => {
    selectedFiles.value.splice(index, 1);
    imagePreviews.value.splice(index, 1);
};

</script>