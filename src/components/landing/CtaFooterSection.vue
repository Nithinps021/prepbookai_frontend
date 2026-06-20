<template>
  <section class="relative py-24 px-6">
    <div v-reveal class="max-w-4xl mx-auto relative">
      <!-- glow -->
      <div class="absolute inset-0 bg-brand-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div class="relative bg-white/[0.05] border border-white/10 rounded-3xl p-10 sm:p-14 text-center backdrop-blur-xl overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>

        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Your best score starts <span class="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-blue-400">with today's quiz</span>
        </h2>
        <p class="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          Join the students turning daily practice into real results. It's free to start.
        </p>

        <button
          @click="getStarted"
          :disabled="signingIn"
          class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-lg transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <svg v-if="!signingIn" class="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <svg v-else class="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ signingIn ? 'Signing in…' : 'Continue with Google' }}
        </button>

        <!-- exam goal chips -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span class="text-sm text-gray-500">Built for</span>
          <span v-for="goal in goals" :key="goal" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
            {{ goal }}
          </span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white">
            <BookOpenCheck class="w-5 h-5" />
          </div>
          <span class="font-bold text-white">PrepBookAI</span>
        </div>
        <p class="text-xs text-gray-500">
          By continuing you agree to our
          <a href="#" class="text-brand-400 hover:text-brand-300 transition-colors">Terms</a> and
          <a href="#" class="text-brand-400 hover:text-brand-300 transition-colors">Privacy Policy</a>.
        </p>
        <p class="text-xs text-gray-600">© 2026 PrepBookAI</p>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref, inject } from 'vue'
import { BookOpenCheck } from 'lucide-vue-next'

const getStarted = inject('getStarted', () => {})
const signingIn = inject('signingIn', ref(false))

const goals = ['SBI PO', 'IBPS PO', 'RBI Grade B']
</script>
