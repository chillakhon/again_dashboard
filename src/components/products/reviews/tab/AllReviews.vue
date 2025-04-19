<template>
  <div class="flex items-center mb-4">
    <div class="flex justify-between space-x-2 w-full">
      <div class="flex space-x-2 w-full">
        <Input
            class="max-w-sm"
            placeholder="Поиск по содержимому отзыва..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
        />
        <Button @click="handleSearch">Найти</Button>
        <Button
            variant="outline"
            @click="clearSearch"
            :disabled="!searchQuery"
        >
          Сбросить
        </Button>
      </div>

      <div class="flex space-x-2">
        <Button variant="outline" @click="handleExport">
          Экспорт
        </Button>
        <Button variant="outline" @click="handleImport">
          Импорт
        </Button>
      </div>
    </div>
  </div>

  <Loader v-if="isLoading" />
  <div v-else>
    <div class="w-full">
      <ReviewsTable :reviews="reviewsData"/>
    </div>
    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="space-x-2">
        <PaginationTable
            :total="totalItems"
            :default-page="currentPage"
            :items-per-page="itemsPerPage"
            :sibling-count="1"
            :show-edges="true"
            @current-page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue-sonner";

import Loader from "@/components/common/Loader.vue";
import ReviewsTable from "@/components/products/reviews/ReviewsTable.vue";
import PaginationTable from "@/components/PaginationTable.vue";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const searchQuery = ref('');
const reviewsData = ref([]);
const isLoading = ref(true);

const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Fetch on mount
onMounted(async () => {
  await fetchData();
});

// Fetch reviews with pagination and search
async function fetchData() {
  isLoading.value = true;
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
      search: searchQuery.value || undefined // Only include search if there's a query
    };

    const res = await axios.get('/reviews', { params });
    reviewsData.value = res.data.data || [];
    totalItems.value = res.data.total || 0;
  } catch (e: unknown) {
    if (axios.isAxiosError(e) && e.response) {
      toast.error(e.response.data?.message || "Ошибка при получении отзывов");
    } else {
      toast.error("Неизвестная ошибка");
    }
  } finally {
    isLoading.value = false;
  }
}

// Page change handler
const handlePageChange = async (page: number) => {
  currentPage.value = page;
  await fetchData();
};

// Search handler
const handleSearch = async () => {
  currentPage.value = 1; // Reset to first page when searching
  await fetchData();
};

// Clear search
const clearSearch = async () => {
  searchQuery.value = '';
  currentPage.value = 1;
  await fetchData();
};

const handleExport = () => {
  // Логика экспорта данных
  console.log('Экспорт данных')
}

const handleImport = () => {
  // Логика импорта данных
  console.log('Импорт данных')
}
</script>

<style scoped>
/* Добавь стили при необходимости */
</style>