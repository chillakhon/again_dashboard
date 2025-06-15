<template>
  <slot v-if="hasAccess" />
  <div
      v-else
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-700 bg-rose-100/80 rounded-lg border border-rose-200/60"
  >
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-rose-500"
        viewBox="0 0 20 20"
        fill="currentColor"
    >
      <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
      />
    </svg>
    <span>У вас нет доступа</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import usePermission from '@/composables/usePermission'

const props = defineProps({
  permission: {
    type: [String, Number],
    required: false,
    default: null
  },
  // Проверка хотя бы одного из прав (OR)
  anyOf: {
    type: Array as () => (string | number)[],
    default: () => []
  },
  // Проверка всех указанных прав (AND)
  allOf: {
    type: Array as () => (string | number)[],
    default: () => []
  }
})

const { hasPermission } = usePermission()

const hasAccess = computed(() => {
  // Приоритеты проверок: permission > anyOf > allOf
  if (props.permission !== null) {
    return hasPermission(props.permission)
  }

  if (props.anyOf.length > 0) {
    return props.anyOf.some(perm => hasPermission(perm))
  }

  if (props.allOf.length > 0) {
    return props.allOf.every(perm => hasPermission(perm))
  }

  return false
})
</script>