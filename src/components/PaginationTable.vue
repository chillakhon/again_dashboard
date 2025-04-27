<template>
  <Pagination
      v-if="total > 10"
      v-slot="{ page }"
      :items-per-page="itemsPerPage"
      :total="total"
      :sibling-count="siblingCount"
      :default-page="defaultPage"
      :show-edges="showEdges"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
<!--      <PaginationFirst @click="$emit('currentPage', 1)"/>-->
      <PaginationPrev @click="$emit('currentPage', page - 1)"/>

      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
          <Button @click="$emit('currentPage', item.value);" class="w-10 h-10 p-0"
                  :variant="item.value === page ? 'default' : 'outline'">
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index"/>
      </template>

      <PaginationNext @click="$emit('currentPage', page + 1)"/>
<!--      <PaginationLast @click="$emit('currentPage', Math.ceil(total / itemsPerPage))"/>-->
    </PaginationList>
  </Pagination>
</template>

<script setup lang="ts">
import {
  Button,
} from '@/components/ui/button'

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

const emit = defineEmits(['currentPage'])

const props = defineProps({
  itemsPerPage: {
    type: Number,
    default: 10, // Количество элементов на странице
  },
  total: {
    type: Number,
    required: true, // Общее количество элементов (обязательно)
  },
  siblingCount: {
    type: Number,
    default: 1, // Количество соседних страниц
  },
  showEdges: {
    type: Boolean,
    default: true, // Показывать ли первую/последнюю страницы
  },
  defaultPage: {
    type: Number,
    default: 1, // Начальная страница
  },
});

</script>
