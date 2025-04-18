<template>
  <div class="border rounded">
    <Table>
      <TableHeader class="bg-gray-50">
        <TableRow>
          <TableHead class="w-[40px] px-2 py-2">
            <Checkbox/>
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Наименование
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Оплата труда
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Затраты на производство
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Время производства
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Статус
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="recipes.length">
          <TableRow
              v-for="recipe in recipes"
              :key="recipe.id"
              class="hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <TableCell class="w-[40px] px-2 py-2">
              <Checkbox/>
            </TableCell>
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm font-medium">
              {{ recipe.name }}
              <span v-if="isNewRecipe(recipe.createdAt)"
                    class="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                new
              </span>
            </TableCell>
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm">
              {{ formatCurrency(recipe.laborCost || 0) }}
            </TableCell>
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm">
              {{ formatCurrency(recipe.productionCost || 0) }}
            </TableCell>
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm">
              {{ recipe.productionTime }} мин
            </TableCell>
            <TableCell class="px-3 py-3 whitespace-nowrap">
              <Badge :variant="recipe.isActive ? 'default' : 'outline'">
                {{ recipe.isActive ? 'Активен' : 'Неактивен' }}
              </Badge>
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else-if="!isLoading">
          <TableCell :colspan="6" class="h-20 text-center text-gray-500 py-3">
            Нет техкарт
          </TableCell>
        </TableRow>

        <TableRow v-else>
          <TableCell :colspan="6" class="h-20 text-center text-gray-500 py-3">
            <div class="flex justify-center">
              <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import {Checkbox} from '@/components/ui/checkbox'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {ref, onMounted} from 'vue'
import {Recipe} from '@/models/Recipe'
import axios from "axios";
import {toast} from "vue-sonner";

const recipes = ref<Recipe[]>([])
const isLoading = ref(true)

const formatCurrency = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const isNewRecipe = (createdAt: Date) => {
  const now = new Date()
  const createdDate = new Date(createdAt)
  const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays < 7 // Новые в течение 7 дней
}

const fetchRecipes = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('/recipes')
    recipes.value = response.data.map((item: any) => Recipe.fromAPI(item))
  } catch (error) {
    toast.error('Ошибка при получении рецептов')
    console.error('Ошибка загрузки рецептов:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRecipes()
})
</script>