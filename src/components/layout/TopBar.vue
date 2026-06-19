<template>
  <header class="h-14 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
    <div class="flex items-center">
      <button 
        @click="$emit('open-mobile-menu')"
        class="mr-4 p-1 -ml-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface lg:hidden transition-colors"
      >
        <Menu class="w-6 h-6" />
      </button>
      
      <h1 class="text-sm font-medium text-text-primary hidden sm:block">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center space-x-2">
      <ThemeToggle />
      
      <!-- User Menu Dropdown trigger (simplified for now) -->
      <button class="w-8 h-8 rounded-md bg-brand-100 text-brand-600 flex items-center justify-center font-bold ml-2">
        {{ authStore.user?.name?.charAt(0) || 'U' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from 'lucide-vue-next'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

defineEmits(['open-mobile-menu'])

const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  if (route.name) {
    return route.name.toString()
  }
  return 'BankPrep'
})
</script>
