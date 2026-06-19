<template>
  <span :class="[
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
    variantClasses[variant] || variantClasses.default
  ]">
    <slot></slot>
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})

const variantClasses = {
  default: 'bg-surface text-text-secondary border-border',
  success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  warning: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  danger: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  brand: 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:border-brand-800',
  // Difficulty levels
  Easy: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  Medium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  Hard: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
}
</script>
