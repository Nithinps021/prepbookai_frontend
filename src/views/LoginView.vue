<template>
  <div class="min-h-screen flex bg-background">
    <!-- Left Panel: Form -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] bg-surface relative z-10 lg:border-r border-border shadow-2xl lg:shadow-none">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <div class="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-check"><path d="M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z"/><path d="m16 12 2 2 4-4"/><path d="M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3"/></svg>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-text-primary tracking-tight">
            Welcome back
          </h2>
          <p class="mt-2 text-sm text-text-muted">
            Don't have an account?
            <router-link to="/signup" class="font-medium text-brand-600 hover:text-brand-500 transition-colors">
              Create a free account
            </router-link>
          </p>
        </div>

        <div class="mt-8">
          <form class="space-y-5" @submit.prevent="handleLogin">
            <Input 
              id="email" 
              type="email" 
              label="Email address" 
              v-model="email" 
              placeholder="you@example.com"
              :error="errors.email"
              required
            />

            <Input 
              id="password" 
              type="password" 
              label="Password" 
              v-model="password" 
              placeholder="••••••••"
              :error="errors.password"
              required
            />

            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-border rounded bg-surface">
                <label for="remember-me" class="ml-2 block text-sm text-text-muted">
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-medium text-brand-600 hover:text-brand-500 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div v-if="authStore.error" class="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 mt-4">
              {{ authStore.error }}
            </div>

            <div class="pt-2">
              <Button type="submit" class="w-full" :loading="authStore.isLoading">
                Sign in
              </Button>
            </div>
          </form>
          
          <div class="mt-8">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-border"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-surface text-text-muted">Or continue with</span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <button class="w-full inline-flex justify-center py-2.5 px-4 border border-border rounded-lg shadow-sm bg-surface text-sm font-medium text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c6.873 0 11.4-4.827 11.4-11.533 0-.787-.08-1.547-.227-2.253H12.48z" />
                </svg>
              </button>
              <button class="w-full inline-flex justify-center py-2.5 px-4 border border-border rounded-lg shadow-sm bg-surface text-sm font-medium text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Panel: Graphic/Branding -->
    <div class="hidden lg:block relative w-0 flex-1 bg-brand-50 dark:bg-brand-950/30 overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-200/50 via-brand-50/10 to-transparent dark:from-brand-900/40 dark:via-brand-950/10 z-0"></div>
      
      <div class="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
        <h1 class="text-4xl lg:text-5xl font-extrabold text-brand-900 dark:text-brand-100 mb-6 tracking-tight">
          Master Your Exams
        </h1>
        <p class="text-lg text-brand-700/80 dark:text-brand-300/80 max-w-md mx-auto mb-12">
          Join thousands of students cracking IBPS, SBI, and RBI exams with our premium mock tests and analytics.
        </p>
        
        <!-- Abstract UI Mockup -->
        <div class="w-full max-w-md bg-surface/60 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500 ease-out text-left">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
            </div>
            <div>
              <div class="h-4 w-24 bg-brand-900/10 dark:bg-white/10 rounded mb-1.5"></div>
              <div class="h-3 w-16 bg-brand-900/5 dark:bg-white/5 rounded"></div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="h-10 w-full bg-white/50 dark:bg-black/20 rounded-lg border border-white/40 dark:border-white/5"></div>
            <div class="h-10 w-full bg-white/50 dark:bg-black/20 rounded-lg border border-white/40 dark:border-white/5"></div>
            <div class="h-10 w-full bg-brand-500/10 border border-brand-500/20 rounded-lg relative overflow-hidden">
              <div class="absolute inset-y-0 left-0 w-3/4 bg-brand-500/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref({})

const handleLogin = async () => {
  errors.value = {}
  
  if (!email.value) errors.value.email = 'Email is required'
  if (!password.value) errors.value.password = 'Password is required'
  
  if (Object.keys(errors.value).length > 0) return

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    // Error handled in store
  }
}
</script>
