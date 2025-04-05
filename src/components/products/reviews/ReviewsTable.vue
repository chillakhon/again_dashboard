<template>
  <div class="border rounded">
    <Table>
      <TableHeader class="bg-gray-50">
        <TableRow>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Товар
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Статус
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Автор
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Рейтинг
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Отзыв
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Дата создания
          </TableHead>
          <TableHead class="px-3 py-2 font-medium text-gray-600 text-xs whitespace-nowrap">
            Дата публикации<br>
            <span class="text-xs font-normal">(только для импортированных)</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="reviews.length">
          <TableRow
              v-for="review in reviews"
              :key="review.id"
              class="hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <!-- Товар -->
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm font-medium">
              {{ review.product }}
            </TableCell>

            <!-- Статус -->
            <TableCell class="px-3 py-3 whitespace-nowrap">
              <Badge :variant="getStatusVariant(review.status)">
                {{ getStatusText(review.status) }}
              </Badge>
            </TableCell>

            <!-- Автор -->
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm">
              <div class="font-medium">{{ review.author.name }}</div>
              <div class="text-gray-500 text-xs">{{ review.author.email }}</div>
            </TableCell>

            <!-- Рейтинг -->
            <TableCell class="px-3 py-3 whitespace-nowrap">
              <div class="flex items-center">
                <StarIcon class="h-4 w-4 text-yellow-400 fill-yellow-400"/>
                <span class="ml-1 text-sm">{{ review.rating }}/5</span>
              </div>
            </TableCell>

            <!-- Отзыв -->
            <TableCell class="px-3 py-3 text-sm">
              <div class="min-w-[200px]">{{ review.comment }}</div>
            </TableCell>

            <!-- Дата создания -->
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(review.createdAt) }}
            </TableCell>

            <!-- Дата публикации -->
            <TableCell class="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ review.publishedAt ? formatDate(review.publishedAt) : '-' }}
            </TableCell>
          </TableRow>
        </template>

        <TableRow v-else>
          <TableCell
              :colspan="7"
              class="h-20 text-center text-gray-500 py-3"
          >
            Нет отзывов
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import {StarIcon} from 'lucide-vue-next'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'

interface Author {
  name: string
  email: string
}

interface Review {
  id: string
  product: string
  status: 'published' | 'pending' | 'draft' | 'imported'
  author: Author
  rating: number
  comment: string
  createdAt: string
  publishedAt?: string
}

const props = defineProps<{
  reviews: Review[]
}>()

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
  return new Date(dateString).toLocaleString('ru-RU', options)
}

const getStatusText = (status: ReviewStatus): string => {
  const statusMap: Record<ReviewStatus, string> = {
    'published': 'Опубликован',
    'pending': 'На рассмотрении',
    'draft': 'Черновик',
    'imported': 'Импортирован'
  }
  return statusMap[status]
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'published':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'draft':
      return 'outline'
    case 'imported':
      return 'success'
    default:
      return 'outline'
  }
}
</script>