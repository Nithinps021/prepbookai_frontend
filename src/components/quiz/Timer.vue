<template>
  <div 
    :class="[
      'inline-flex items-center px-3 py-1.5 rounded-lg font-mono font-medium border transition-colors duration-300',
      timerClass
    ]"
  >
    <Clock class="w-4 h-4 mr-2" :class="isWarning ? 'animate-pulse' : ''" />
    {{ formattedTime }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'

const props = defineProps({
  secondsLeft: {
    type: Number,
    required: true
  },
  formattedTime: {
    type: String,
    required: true
  }
})

const isWarning = computed(() => props.secondsLeft <= 60 && props.secondsLeft > 0)

const timerClass = computed(() => {
  if (props.secondsLeft <= 60) {
    return 'bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
  }
  if (props.secondsLeft <= 300) {
    return 'bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400'
  }
  return 'bg-surface border-border text-text-primary'
})
</script>
