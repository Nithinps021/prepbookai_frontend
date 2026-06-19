<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

// Initialize theme on app mount
const { isDark } = useTheme()
</script>

<style>
/* Global transitions can be added here if needed */
</style>
