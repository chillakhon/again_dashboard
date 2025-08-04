<template>
  <div class="inline-block">
    <span class="text-xl p-1 font-medium text-gray-900 dark:text-gray-100 transition-colors">
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  /**
   * Цветовая тема
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'muted'
  /**
   * Размер текста
   * @default 'xl'
   */
  size?: 'sm' | 'base' | 'xl' | '2xl'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'xl'
})

const textClasses = {
  default: 'text-gray-900 dark:text-gray-100',
  primary: 'text-primary-600 dark:text-primary-400',
  muted: 'text-gray-500 dark:text-gray-400'
}

const sizeClasses = {
  sm: 'text-sm',
  base: 'text-base',
  xl: 'text-xl',
  '2xl': 'text-2xl'
}
</script>

<style scoped>
/* Плавное изменение цвета при переключении темы */
span {
  transition: color 0.2s ease;
}
</style>