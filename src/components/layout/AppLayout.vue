<template>
  <div class="flex h-screen bg-background overflow-hidden">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black/20 z-20 lg:hidden"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <Sidebar 
      :is-open="isSidebarOpen" 
      :is-mobile-open="isMobileMenuOpen"
      @toggle-collapse="isSidebarOpen = !isSidebarOpen"
      @close-mobile="isMobileMenuOpen = false"
      class="z-30"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- TopBar -->
      <TopBar 
        @open-mobile-menu="isMobileMenuOpen = true" 
      />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative">
        <div class="max-w-7xl mx-auto w-full h-full">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
</script>

<style>
/* Page Transition Animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
