<template>
  <div class="bg-surface rounded-xl p-5 border border-border shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-text-muted mb-1">{{ label }}</p>
        <h4 class="text-2xl font-bold text-text-primary">{{ value }}</h4>
      </div>
      <div :class="['w-12 h-12 rounded-lg flex items-center justify-center shrink-0', colorClass]">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  colorClass: { type: String, default: 'bg-brand-50 text-brand-500 dark:bg-brand-900/30 dark:text-brand-400' }
})
</script>
