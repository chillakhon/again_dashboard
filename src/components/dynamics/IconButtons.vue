<template>
  <div class="flex items-center space-x-2">
    <template v-for="button in buttons" :key="button.type">
      <component
          :is="iconsMap[button.type]"
          :size="button.size || size"
          :class="[
          'cursor-pointer',
          button.class || 'text-gray-400 hover:text-gray-500',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
          @click="!disabled && handleClick(button.type, context)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Trash2, Eye, Plus, Minus, Copy } from 'lucide-vue-next';
import type { Component } from 'vue';

// Типы для кнопок
type IconType = 'edit' | 'delete' | 'view' | 'add' | 'remove' | 'copy' | string;
type ButtonAction<T = any> = (context: T) => void;

interface IconButton {
  type: IconType;
  onClick: ButtonAction;
  size?: number | string;
  class?: string;
}

// Пропсы компонента
interface Props<T = any> {
  buttons: IconButton[];
  context?: T;
  size?: number | string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 17,
  disabled: false
});

// Тип для эмитов
interface Emits {
  (event: 'action', payload: { type: IconType; context?: any }): void;
}

const emit = defineEmits<Emits>();

// Маппинг иконок
const iconsMap: Record<IconType, Component> = {
  edit: Pencil,
  delete: Trash2,
  view: Eye,
  add: Plus,
  remove: Minus,
  copy: Copy
  // расширяйте по необходимости
};

const handleClick = (type: IconType, context?: any) => {
  const button = props.buttons.find(b => b.type === type);
  if (button?.onClick) {
    button.onClick(context);
  }
  emit('action', { type, context });
};
</script>