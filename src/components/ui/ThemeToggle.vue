<template>
  <button 
    @click="toggleTheme" 
    class="p-2 rounded-md hover:bg-surface text-text-muted hover:text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Moon v-if="!isDark" class="w-5 h-5" />
    <Sun v-else class="w-5 h-5" />
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'

const { isDark, toggleTheme } = useTheme()
</script>
