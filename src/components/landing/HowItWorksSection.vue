<template>
  <section id="how-it-works" class="relative py-24 px-6 scroll-mt-20">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 v-reveal class="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Up and running in <span class="text-brand-400">three steps</span>
        </h2>
        <p v-reveal="80" class="text-lg text-gray-400">
          No setup, no clutter. Sign in and start improving today.
        </p>
      </div>

      <div class="relative grid md:grid-cols-3 gap-8">
        <!-- connecting line (desktop) -->
        <div class="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-brand-500/40 via-brand-400/40 to-brand-500/40"></div>

        <div
          v-for="(step, i) in steps"
          :key="step.title"
          v-reveal="i * 140"
          class="relative text-center"
        >
          <div class="relative z-10 mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_25px_rgba(59,130,246,0.4)] mb-5">
            {{ i + 1 }}
          </div>
          <div class="mb-3 flex justify-center text-brand-300">
            <component :is="step.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">{{ step.title }}</h3>
          <p class="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { LogIn, BookOpen, TrendingUp } from 'lucide-vue-next'

const steps = [
  { title: 'Sign in with Google', desc: 'One click — no forms, no passwords. Pick your exam goal and you\'re in.', icon: LogIn },
  { title: 'Practice daily', desc: 'Take a curated quiz, learn from explanations, and build your streak.', icon: BookOpen },
  { title: 'Watch your score climb', desc: 'Track progress, conquer weak topics, and walk into the exam ready.', icon: TrendingUp },
]
</script>
