<template>
    <div>
        <h2 class="text-base font-semibold text-gray-900">Медиа</h2>
        <div class="mt-6 mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
            <div @dragover.prevent @drop="handleDrop" class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-3 py-5">
                <div class="text-center">
                    <PhImage class="mx-auto size-10 text-gray-300" aria-hidden="true" />
                    <div class="mt-2 text-sm/6 text-gray-600">
                        <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input @change="handleFileUpload" id="file-upload" name="file-upload" type="file" accept="image/*" class="sr-only" />
                        </label>
                    </div>
                    <p class="text-xs text-gray-600">PNG, JPG, GIF</p>
                </div>
            </div>
            <div v-if="imagePreviews.length" v-for="(src, index) in imagePreviews" :key="index" class="relative">
                <img class="aspect-[14/13] w-full rounded-2xl object-contain" :src="src" />
                <button @click="removeImage(index)" type="button" class="absolute top-1 right-1 rounded-full bg-red-600 p-0.5 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                    <PhX class="size-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup> 
import { ref } from "vue";
import { PhImage, PhX } from "@phosphor-icons/vue";

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