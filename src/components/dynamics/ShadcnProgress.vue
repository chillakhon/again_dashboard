<template>
  <div class="w-full space-y-2">
    <Progress :model-value="progress"/>
    <div class="flex justify-between text-sm text-muted-foreground">
      <span>Progress: {{ progress }}%</span>
      <button
          v-if="!isAnimating && progress < targetProgress"
          @click="startProgress"
          class="text-primary hover:underline"
      >
        Resume
      </button>
      <button
          v-if="progress > 0 && progress < targetProgress"
          @click="resetProgress"
          class="text-destructive hover:underline"
      >
        Reset
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import {Progress} from '@/components/ui/progress'
import {ref, onMounted, watch, onBeforeUnmount} from 'vue'

const props = defineProps({
  duration: { // Длительность анимации в секундах
    type: Number,
    default: 3
  },
  targetProgress: { // Целевое значение прогресса (0-100)
    type: Number,
    default: 100
  },
  autoStart: { // Автоматически запускать анимацию
    type: Boolean,
    default: true
  }
})

const progress = ref(0)
const isAnimating = ref(false)
let animationFrame: number
let startTime: number

const startProgress = () => {
  if (isAnimating.value) return

  isAnimating.value = true
  progress.value = 0
  startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = (currentTime - startTime) / 1000 // в секундах
    const progressPercent = Math.min(elapsed / props.duration, 1) * props.targetProgress

    progress.value = Math.round(progressPercent)

    if (elapsed < props.duration && progress.value < props.targetProgress) {
      animationFrame = requestAnimationFrame(animate)
    } else {
      isAnimating.value = false
      progress.value = props.targetProgress
    }
  }

  animationFrame = requestAnimationFrame(animate)
}

const resetProgress = () => {
  cancelAnimationFrame(animationFrame)
  progress.value = 0
  isAnimating.value = false
}

// Автоматический старт при монтировании
onMounted(() => {
  if (props.autoStart) {
    startProgress()
  }
})

// Следим за изменениями targetProgress
watch(() => props.targetProgress, (newVal) => {
  if (newVal > progress.value) {
    startProgress()
  }
})

// Очистка анимации при размонтировании
onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
})
</script>
