<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white font-sans relative overflow-x-hidden">
    <!-- Global grid texture -->
    <div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMNDAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-60 pointer-events-none"></div>

    <!-- Top nav -->
    <header
      class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'"
    >
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white">
            <BookOpenCheck class="w-5 h-5" />
          </div>
          <span class="font-bold text-lg tracking-tight">PrepBookAI</span>
        </div>

        <nav class="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#how-it-works" class="hover:text-white transition-colors">How it works</a>
        </nav>

        <button
          @click="handleGetStarted"
          :disabled="signingIn"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <svg v-if="signingIn" class="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          {{ signingIn ? 'Signing in…' : 'Sign in' }}
        </button>
      </div>
    </header>

    <!-- Error toast -->
    <div
      v-if="authStore.error"
      class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-sm backdrop-blur-md shadow-lg"
    >
      {{ authStore.error }}
    </div>

    <!-- Sections -->
    <main class="relative z-10">
      <HeroSection />
      <FeatureGrid />
      <DailyCompanionSection />
      <ProgressGlimpseSection />
      <WeakTopicNudgeSection />
      <HowItWorksSection />
      <CtaFooterSection />
    </main>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import confetti from 'canvas-confetti'
import { BookOpenCheck } from 'lucide-vue-next'

import HeroSection from '@/components/landing/HeroSection.vue'
import FeatureGrid from '@/components/landing/FeatureGrid.vue'
import DailyCompanionSection from '@/components/landing/DailyCompanionSection.vue'
import ProgressGlimpseSection from '@/components/landing/ProgressGlimpseSection.vue'
import WeakTopicNudgeSection from '@/components/landing/WeakTopicNudgeSection.vue'
import HowItWorksSection from '@/components/landing/HowItWorksSection.vue'
import CtaFooterSection from '@/components/landing/CtaFooterSection.vue'

const router = useRouter()
const authStore = useAuthStore()

// Local sign-in state — NOT authStore.isLoading, which also flips true during
// the initial Firebase auth-state check and would disable every CTA on load.
const signingIn = ref(false)

const handleGetStarted = async () => {
  if (signingIn.value) return
  signingIn.value = true
  try {
    await authStore.loginWithGoogle()
    // Small celebratory burst before navigating in.
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, disableForReducedMotion: true })
    router.push('/dashboard')
  } catch (e) {
    console.error('Login failed', e)
  } finally {
    signingIn.value = false
  }
}

// Expose to all section CTAs without prop-drilling.
provide('getStarted', handleGetStarted)
provide('signingIn', signingIn)

// Glassy nav after scrolling past the hero fold.
const scrolled = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 24 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>
