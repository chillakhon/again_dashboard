<template>
  <!--  <slot v-if="hasAccess || showContentAndBlock"/>-->

  <div v-if="hasAccess || showContentAndBlock" @click="onClickSlot">
    <slot/>
  </div>


  <div v-else
       class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-700 bg-rose-100/80 rounded-lg border border-rose-200/60"
  >
    <span>У вас нет доступа</span>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import usePermission from '@/composables/usePermission'
import {toast} from "vue-sonner";

const props = defineProps({
  permission: {
    type: [String, Number, Boolean],
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
  },

  showContentAndBlock: {
    type: Boolean,
    default: false
  }

})

const {hasPermission} = usePermission()

const hasAccess = computed(() => {
  // Приоритеты проверок: permission > anyOf > allOf
  if (props.permission !== null) {
    return hasPermission(props.permission, false)
  }

  if (props.anyOf.length > 0) {
    return props.anyOf.some(perm => hasPermission(perm))
  }

  if (props.allOf.length > 0) {
    return props.allOf.every(perm => hasPermission(perm))
  }

  return false
})


function onClickSlot(event: any) {
  if (!hasAccess.value) {
    event.stopImmediatePropagation()
    event.preventDefault()
    toast.error('У вас нет доступа')
  }
}

</script>