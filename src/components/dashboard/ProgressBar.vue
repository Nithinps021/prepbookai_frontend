<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-1">
      <span class="text-sm font-medium text-text-primary">{{ label }}</span>
      <span class="text-xs font-semibold text-text-muted">{{ animatedPercentage }}%</span>
    </div>
    <div class="w-full bg-border rounded-full h-2.5 overflow-hidden">
      <div 
        class="h-2.5 rounded-full transition-all duration-1000 ease-out"
        :class="colorClass"
        :style="{ width: `${animatedPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  percentage: { type: Number, required: true },
  colorClass: { type: String, default: 'bg-brand-500' }
})

const animatedPercentage = ref(0)

onMounted(() => {
  // Small delay to ensure transition triggers on mount
  setTimeout(() => {
    animatedPercentage.value = props.percentage
  }, 100)
})
</script>
