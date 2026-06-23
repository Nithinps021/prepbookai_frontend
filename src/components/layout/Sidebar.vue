<template>
  <aside 
    :class="[
      'bg-surface border-r border-border transition-all duration-300 ease-in-out flex flex-col',
      // Desktop state
      'hidden lg:flex',
      isOpen ? 'w-64' : 'w-16',
      // Mobile state overrides
      'lg:relative fixed inset-y-0 left-0 z-40 lg:z-auto lg:translate-x-0',
      isMobileOpen ? 'translate-x-0 w-64 flex' : '-translate-x-full lg:translate-x-0'
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

    <!-- Logout Button -->
    <div class="px-2 pb-4">
      <button 
        @click="showLogoutModal = true"
        class="w-full flex items-center px-2 py-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
      >
        <LogOut class="w-5 h-5 shrink-0" />
        <span v-show="isOpen || isMobileOpen" class="ml-3 truncate font-medium">Log out</span>
      </button>
    </div>

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

  <!-- Custom Logout Modal -->
  <Teleport to="body">
    <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div class="bg-surface border border-border rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-auto transform transition-all text-left">
        <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <LogOut class="w-6 h-6 text-red-600 dark:text-red-500" />
        </div>
        <h3 class="text-xl font-bold text-text-primary mb-2">Sign Out</h3>
        <p class="text-sm text-text-muted mb-6">Are you sure you want to sign out of your account?</p>
        <div class="flex justify-end gap-3">
          <button 
            @click="showLogoutModal = false"
            class="px-4 py-2 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmLogout"
            class="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LayoutDashboard, Library, User, ChevronLeft, ChevronRight, LogOut } from 'lucide-vue-next'

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

const showLogoutModal = ref(false)

const confirmLogout = async () => {
  await authStore.logout()
  showLogoutModal.value = false
  router.push('/')
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Quizzes', path: '/quizzes', icon: Library },
  { name: 'Profile', path: '/profile', icon: User }
]
</script>
