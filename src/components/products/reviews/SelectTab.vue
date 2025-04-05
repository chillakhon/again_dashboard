<template>
  <div class="flex items-center mb-4">
    <div class="flex justify-between space-x-2 w-full">
      <div class="flex space-x-2 w-full">
        <Input
            class="max-w-sm"
            placeholder="Поиск..."
            v-model="searchProduct"
        />
        <Button @click="handleSearch">Найти</Button>
      </div>

      <div class="flex space-x-2">
        <Button variant="outline" @click="handleExport">
<!--          <DownloadIcon class="h-4 w-4 mr-2" />-->
          Экспорт
        </Button>
        <Button variant="outline" @click="handleImport">
<!--          <UploadIcon class="h-4 w-4 mr-2" />-->
          Импорт
        </Button>
      </div>
    </div>
  </div>

  <all-reviews/>
</template>

<script setup lang="ts">
import { DownloadIcon, UploadIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {ref} from "vue";
import AllReviews from "@/components/products/reviews/tab/AllReviews.vue";

const searchProduct = ref('')

const handleSearch = () => {
  // Логика поиска
  console.log('Поиск:', searchProduct.value)
}

const handleExport = () => {
  // Логика экспорта данных
  console.log('Экспорт данных')
}

const handleImport = () => {
  // Логика импорта данных
  console.log('Импорт данных')
}
</script>