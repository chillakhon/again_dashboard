<script setup lang="ts">
import { ref } from 'vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Пример данных (замените на реальные данные из API)
const productions = ref<Production[]>([
  {
    id: '1-1',
    time: '06:25',
    organization: 'Организация 1',
    startTime: '2025-04-07 06:00',
    endTime: '2025-04-07 07:00',
    planned: 100,
    produced: 95,
    shipped: 90,
    printed: 85,
    comment: 'Без комментариев',
  },
]);

const columns = [
  { key: 'id', label: '№' },
  { key: 'time', label: 'Время' },
  { key: 'organization', label: 'Организация' },
  { key: 'startTime', label: 'Начало производства' },
  { key: 'endTime', label: 'Завершение производства' },
  { key: 'planned', label: 'Запланировано' },
  { key: 'produced', label: 'Произведено' },
  { key: 'shipped', label: 'Отправлено' },
  { key: 'printed', label: 'Напечатано' },
  { key: 'comment', label: 'Комментарий' },
];
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="column in columns" :key="column.key">
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in productions" :key="item.id">
          <TableCell>{{ item.id }}</TableCell>
          <TableCell>{{ item.time }}</TableCell>
          <TableCell>{{ item.organization }}</TableCell>
          <TableCell>{{ item.startTime }}</TableCell>
          <TableCell>{{ item.endTime }}</TableCell>
          <TableCell>{{ item.planned }}</TableCell>
          <TableCell>{{ item.produced }}</TableCell>
          <TableCell>{{ item.shipped }}</TableCell>
          <TableCell>{{ item.printed }}</TableCell>
          <TableCell>{{ item.comment }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>