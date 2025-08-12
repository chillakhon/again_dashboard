<template>
  <div class="relative  w-full bg-white rounded-xl p-5 shadow-md border border-gray-100">
    <!-- Заголовок и пояснение -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Динамика заказов за последние 6 месяцев</h3>
      <p class="text-sm text-gray-500 mt-1">
        Визуализация показывает изменение количества заказов по статусам
      </p>
    </div>

    <!-- График -->
    <LineChart
        :chartData="chartData"
        :options="options"
        class="mt-2"
    />

    <!-- Подпись и дата -->
    <div class="absolute bottom-4 right-4 text-xs text-gray-400 flex items-center mb-10">
      <Clock class="h-3 w-3 mr-1 text-gray-400" />
      Обновлено: {{ new Date().toLocaleDateString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import {  ref, watch } from 'vue';
import { Clock } from 'lucide-vue-next';


Chart.register(...registerables);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      new: [],
      processing: [],
      approved: []
    })
  }
});

const chartData = ref({
  labels: props.chartData?.labels,
  datasets: [
    {
      label: 'Новые заказы',
      data: props.chartData?.new ?? [],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      borderWidth: 3,
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    },
    {
      label: 'В обработке',
      data: props.chartData?.processing ?? [],
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
      borderWidth: 3,
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#F59E0B',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    },
    {
      label: 'Готовы к отправке',
      data: props.chartData?.approved ?? [],
      borderColor: '#00ba13',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      borderWidth: 3,
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#00ba13',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  ]
});

// Красивые настройки графика
const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#4B5563',
        font: {
          family: 'Inter, sans-serif',
          size: 13,
          weight: '500'
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 8
      }
    },
    tooltip: {
      backgroundColor: '#1F2937',
      titleColor: '#F9FAFB',
      bodyColor: '#F9FAFB',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 12,
      usePointStyle: true,
      callbacks: {
        label: (context) => {
          return ` ${context.dataset?.label}: ${context.parsed.y} заказов`;
        },
        labelColor: (context) => {
          return {
            borderColor: context?.dataset.borderColor,
            backgroundColor: context?.dataset.borderColor,
            borderRadius: 2
          };
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          family: 'Inter, sans-serif'
        }
      }
    },
    y: {
      grid: {
        color: '#F3F4F6',
        drawBorder: false,
        tickLength: 8
      },
      ticks: {
        color: '#6B7280',
        font: {
          family: 'Inter, sans-serif'
        },
        stepSize: 50,
        callback: (value) => value % 100 === 0 ? value : null
      },
      beginAtZero: true,
      min: 0
    }
  },
  elements: {
    line: {
      cubicInterpolationMode: 'monotone'
    }
  }
});

// Обновляем данные при изменении пропсов
watch(() => props.chartData, (newVal) => {
  chartData.value = {
    ...chartData.value,
    labels: newVal.labels,
    datasets: [
      { ...chartData.value.datasets[0], data: newVal.new },
      { ...chartData.value.datasets[1], data: newVal.processing },
      { ...chartData.value.datasets[2], data: newVal.approved }
    ]
  };
}, { deep: true });

// onMounted(() => {
//   console.log('Данные графика:', props.chartData);
// });
</script>