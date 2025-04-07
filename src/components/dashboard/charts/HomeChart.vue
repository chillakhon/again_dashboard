<template>
  <div class="relative h-[400px] w-full bg-white rounded-lg p-4 shadow-sm border">
    <LineChart
        :chartData="chartData"
        :options="options"
    />
    <div class="absolute bottom-4 right-4 text-xs text-gray-400">
      Обновлено: {{ new Date().toLocaleDateString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { ref } from 'vue';

Chart.register(...registerables);

// Данные за последние 7 дней
const chartData = ref({
  labels: ['12 апр', '13 апр', '14 апр', '15 апр', '16 апр', '17 апр', '18 апр'],
  datasets: [
    {
      label: 'Новые заказы',
      data: [24, 18, 30, 27, 15, 22, 19],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.05)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    },
    {
      label: 'В обработке',
      data: [15, 12, 18, 14, 10, 16, 12],
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#F59E0B',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    },
    {
      label: 'Готовы к отправке',
      data: [8, 6, 12, 9, 5, 10, 7],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    }
  ]
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        padding: 20,
        usePointStyle: true,
        font: {
          family: 'Inter, sans-serif',
          size: 13
        }
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
          return ` ${context.dataset.label}: ${context.parsed.y} заказов`;
        },
        labelColor: (context) => {
          return {
            borderColor: context.dataset.borderColor,
            backgroundColor: context.dataset.borderColor,
            borderRadius: 2
          };
        }
      }
    },
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 15,
          yMax: 15,
          borderColor: '#E5E7EB',
          borderWidth: 1,
          borderDash: [5, 5]
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
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: '#F3F4F6',
        drawBorder: false
      },
      ticks: {
        color: '#6B7280',
        callback: (value) => {
          if (value % 5 === 0) return value;
        }
      },
      min: 0,
      max: 35
    }
  },
  elements: {
    line: {
      cubicInterpolationMode: 'monotone'
    }
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
</style>