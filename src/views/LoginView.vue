<template>
  <!-- Force dark mode aesthetic on this specific view -->
  <div class="min-h-screen flex bg-[#0A0A0A] text-white font-sans overflow-hidden relative">
    
    <!-- Background Ambient Glows -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen pointer-events-none"></div>

    <!-- Left Panel: Dynamic Illustration -->
    <div class="hidden lg:flex flex-1 relative flex-col justify-center items-center p-12 overflow-hidden z-10 border-r border-white/10">
      
      <!-- Content inside left panel -->
      <div class="relative z-20 text-center max-w-lg">
        <h1 class="text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Master Your Exams
        </h1>
        <p class="text-xl text-gray-400 mb-12">
          Join thousands of students cracking IBPS, SBI, and RBI exams with our premium mock tests and analytics.
        </p>
        
        <!-- Abstract UI Mockup with Glassmorphism -->
        <div class="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 transform hover:scale-105 hover:rotate-1 transition-all duration-500 ease-out text-left relative overflow-hidden group">
          <!-- Inner glow on hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div class="flex items-center gap-4 mb-6 relative z-10">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
            </div>
            <div>
              <div class="h-4 w-32 bg-white/20 rounded mb-2"></div>
              <div class="h-3 w-20 bg-white/10 rounded"></div>
            </div>
          </div>
          <div class="space-y-4 relative z-10">
            <div class="h-12 w-full bg-black/40 rounded-lg border border-white/5"></div>
            <div class="h-12 w-full bg-black/40 rounded-lg border border-white/5"></div>
            <div class="h-12 w-full bg-brand-500/20 border border-brand-500/30 rounded-lg relative overflow-hidden">
              <div class="absolute inset-y-0 left-0 w-3/4 bg-brand-500/40 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4geD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCA0MGw0MC00ME0wIDIwbDIwLTIwTTIwIDQwbDIwLTIwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 mix-blend-overlay pointer-events-none"></div>
    </div>

    <!-- Right Panel: Auth Card -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 relative z-20">
      <div class="mx-auto w-full max-w-md">
        
        <!-- Glassmorphic Card -->
        <div class="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <!-- Card subtle top highlight -->
          <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-6 border border-white/10 relative group">
              <div class="absolute inset-0 rounded-2xl bg-brand-500/20 blur-md group-hover:bg-brand-500/40 transition-all duration-300"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="relative z-10"><path d="M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z"/><path d="m16 12 2 2 4-4"/><path d="M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3"/></svg>
            </div>
            <h2 class="text-3xl font-bold text-white tracking-tight">
              Welcome back
            </h2>
            <p class="mt-3 text-sm text-gray-400">
              Sign in to continue your preparation journey.
            </p>
          </div>

          <div v-if="authStore.error" class="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center backdrop-blur-sm">
            {{ authStore.error }}
          </div>

          <div class="mt-8 space-y-4">
            <button 
              @click="handleGoogleLogin" 
              :disabled="authStore.isLoading"
              class="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <svg v-if="!authStore.isLoading" class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ authStore.isLoading ? 'Signing in...' : 'Continue with Google' }}</span>
            </button>
          </div>
          
          <div class="mt-8 text-center">
            <p class="text-xs text-gray-500">
              By continuing, you agree to our <a href="#" class="text-brand-400 hover:text-brand-300 transition-colors">Terms of Service</a> and <a href="#" class="text-brand-400 hover:text-brand-300 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
    router.push('/dashboard')
  } catch (e) {
    // Error is handled in the store and displayed via authStore.error
    console.error("Login failed", e)
  }
}
</script>
