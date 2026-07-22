import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/index.css'
import App from './App.vue'
import { vReveal } from './composables/useScrollReveal'
import { useAuthStore } from './stores/auth'
import { watch } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)
app.use(createPinia())
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  },
})

const authStore = useAuthStore()

// Wait for Firebase to initialize auth state before mounting and routing
// This prevents redirecting authenticated users to login on page refresh
let appMounted = false
watch(() => authStore.isLoading, (isLoading) => {
  if (!isLoading && !appMounted) {
    app.use(router)
    app.directive('reveal', vReveal)
    app.mount('#app')
    appMounted = true
  }
}, { immediate: true })
