<template>
  <section class="relative py-24 px-6">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <!-- Copy -->
      <div>
        <div v-reveal class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-sm text-purple-300 mb-6">
          <Sparkles class="w-4 h-4" /> Personalized for you
        </div>
        <h2 v-reveal="80" class="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
          We nudge you <span class="text-brand-400">exactly where it matters</span>
        </h2>
        <p v-reveal="160" class="text-lg text-gray-400 leading-relaxed mb-6">
          PrepBookAI quietly watches which topics trip you up and points you back
          to them — before they cost you marks on test day. No guilt, just a
          friendly hand on the next right step.
        </p>
        <p v-reveal="220" class="text-gray-400">
          See a weak topic climb from <span class="text-amber-400 font-semibold">54%</span>
          to <span class="text-green-400 font-semibold">82%</span> over a couple of focused sessions —
          improvement you can actually watch happen.
        </p>
      </div>

      <!-- Visual: weak topics + improvement arc -->
      <div v-reveal="120" class="space-y-5">
        <!-- Nudge card -->
        <div class="bg-gradient-to-br from-brand-500/15 to-purple-500/10 border border-brand-400/25 rounded-2xl p-6 backdrop-blur-xl">
          <div class="flex items-center gap-2 text-brand-300 text-sm font-semibold mb-3">
            <Lightbulb class="w-5 h-5" /> Today's smart nudge
          </div>
          <p class="text-white font-medium mb-4">
            Your weakest topic this week is <span class="text-amber-300">Data Interpretation</span>.
            A 10-minute set could lift your average noticeably.
          </p>
          <button
            @click="getStarted"
            :disabled="signingIn"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            Practice Data Interpretation
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Weak topics list -->
        <div class="bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h3 class="font-semibold text-white mb-4 text-sm">Focus areas</h3>
          <div class="space-y-4">
            <div v-for="t in weak" :key="t.label">
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-gray-300">{{ t.label }}</span>
                <span class="text-amber-300">{{ t.value }}%</span>
              </div>
              <div class="h-2 rounded-full bg-white/10 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" :style="{ width: t.value + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject } from 'vue'
import { Sparkles, Lightbulb, ArrowRight } from 'lucide-vue-next'

const getStarted = inject('getStarted', () => {})
const signingIn = inject('signingIn', ref(false))

const weak = [
  { label: 'Data Interpretation', value: 54 },
  { label: 'Puzzles & Seating', value: 61 },
  { label: 'Error Spotting', value: 67 },
]
</script>
