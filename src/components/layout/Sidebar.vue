<template>
  <aside 
    :class="[
      'bg-surface border-r border-border transition-transform duration-300 ease-in-out flex flex-col',
      // Desktop state
      isOpen ? 'lg:w-64' : 'lg:w-16',
      // Mobile state overrides
      'fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0',
      isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-64 shadow-none lg:shadow-none'
    ]"
  >
    <!-- Profile Header -->
    <div class="h-14 flex items-center px-3 border-b border-border shrink-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
      <!-- Profile Picture or Initial -->
      <img 
        v-if="authStore.user?.photoURL" 
        :src="authStore.user.photoURL" 
        alt="Profile" 
        class="w-8 h-8 rounded-md object-cover border border-border shrink-0 shadow-sm" 
      />
      <div v-else class="w-8 h-8 rounded-md bg-brand-100 text-brand-600 flex items-center justify-center font-bold shrink-0">
        {{ authStore.user?.name?.charAt(0) || 'U' }}
      </div>
      <div v-show="isOpen || isMobileOpen" class="ml-3 truncate flex-1">
        <div class="text-sm font-medium text-text-primary truncate">{{ authStore.user?.name || 'User' }}</div>
        <div class="text-xs text-text-muted truncate">Free Plan</div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-1 no-scrollbar">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center px-2 py-2 rounded-md transition-colors group"
        :class="[
          $route.path === item.path 
            ? 'bg-black/5 dark:bg-white/10 text-text-primary font-medium' 
            : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary'
        ]"
        @click="$emit('close-mobile')"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" :class="{ 'text-brand-500': $route.path === item.path }" />
        <span v-show="isOpen || isMobileOpen" class="ml-3 truncate">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Collapse Toggle (Desktop only) -->
    <button 
      @click="$emit('toggle-collapse')"
      class="hidden lg:flex h-12 items-center px-3 text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary transition-colors border-t border-border"
    >
      <ChevronLeft v-if="isOpen" class="w-5 h-5 shrink-0" />
      <ChevronRight v-else class="w-5 h-5 shrink-0 mx-auto" />
      <span v-show="isOpen" class="ml-3 text-sm">Collapse</span>
    </button>
  </aside>

</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LayoutDashboard, Library, User, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  },
  isMobileOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-collapse', 'close-mobile'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Quizzes', path: '/quizzes', icon: Library },
  { name: 'Profile', path: '/profile', icon: User }
]
</script>
