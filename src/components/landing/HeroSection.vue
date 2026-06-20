<template>
  <section class="relative min-h-screen flex items-center pt-28 pb-20 px-6 overflow-hidden">
    <!-- Animated ambient glows -->
    <div class="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-brand-500/20 blur-[140px] animate-glow pointer-events-none"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[55%] h-[55%] rounded-full bg-blue-600/20 blur-[140px] animate-glow pointer-events-none" style="animation-delay: 2s"></div>

    <div class="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
      <!-- Copy -->
      <div>
        <div v-reveal class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-brand-300 mb-6 backdrop-blur-sm">
          <Sparkles class="w-4 h-4" />
          Your AI study partner — not a drill sergeant
        </div>

        <h1 v-reveal="80" class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Crack
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-blue-400 to-brand-500 animate-gradient-pan drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
            SBI, IBPS &amp; RBI
          </span>
          with a daily companion that knows you.
        </h1>

        <p v-reveal="160" class="text-lg text-gray-400 mb-9 max-w-xl leading-relaxed">
          Practice curated, exam-realistic quizzes, get an explanation on every
          question, watch your progress climb, and get nudged exactly where
          you're weak. PrepBookAI turns scattered studying into a calm daily habit.
        </p>

        <div v-reveal="240" class="flex flex-col sm:flex-row gap-4">
          <button
            @click="getStarted"
            :disabled="signingIn"
            class="inline-flex items-center justify-center gap-3 px-7 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-lg transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
            {{ signingIn ? 'Signing in…' : "Get started — it's free" }}
          </button>

          <a
            href="#how-it-works"
            class="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-lg text-white border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            See how it works
            <ArrowDown class="w-5 h-5" />
          </a>
        </div>

        <div v-reveal="320" class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <span class="flex items-center gap-1.5"><Check class="w-4 h-4 text-green-400" /> No credit card</span>
          <span class="flex items-center gap-1.5"><Check class="w-4 h-4 text-green-400" /> Explanation on every question</span>
          <span class="flex items-center gap-1.5"><Check class="w-4 h-4 text-green-400" /> Tracks your streak</span>
        </div>
      </div>

      <!-- Floating live-feel demo card -->
      <div
        v-reveal="200"
        ref="cardWrap"
        class="relative"
        @pointermove="onMove"
        @pointerleave="onLeave"
      >
        <div
          class="animate-float"
          :style="parallaxStyle"
        >
          <div class="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>

            <!-- Rotating subject example -->
            <Transition name="card-fade" mode="out-in">
              <div :key="active" class="min-h-[316px]">
                <!-- Mock question header -->
                <div class="flex items-center justify-between mb-5">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-brand-500/20 text-brand-300 border border-brand-500/30">{{ ex.subject }}</span>
                    <span
                      class="px-2.5 py-1 rounded-md text-xs font-medium border"
                      :class="ex.difficulty === 'Easy'
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : ex.difficulty === 'Hard'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'"
                    >{{ ex.difficulty }}</span>
                  </div>
                  <span class="text-xs text-gray-400 font-mono">{{ ex.timer }}</span>
                </div>

                <p class="text-white font-medium mb-4 leading-relaxed" v-html="ex.question"></p>

                <div class="space-y-2.5 mb-4">
                  <div
                    v-for="(opt, i) in ex.options"
                    :key="i"
                    class="px-4 py-3 rounded-lg text-sm flex items-center justify-between"
                    :class="opt.correct
                      ? 'bg-green-500/15 border border-green-500/40 text-green-200'
                      : 'bg-black/30 border border-white/5 text-gray-300'"
                  >
                    {{ opt.text }}
                    <Check v-if="opt.correct" class="w-4 h-4 text-green-400" />
                  </div>
                </div>

                <!-- Instant explanation -->
                <div class="rounded-xl bg-brand-500/10 border border-brand-500/25 p-4">
                  <div class="flex items-center gap-2 text-brand-300 text-xs font-semibold mb-1.5">
                    <Lightbulb class="w-4 h-4" /> Instant explanation
                  </div>
                  <p class="text-sm text-gray-300 leading-relaxed" v-html="ex.explanation"></p>
                </div>
              </div>
            </Transition>

            <!-- Subject progress dots -->
            <div class="flex items-center gap-1.5 mt-5">
              <button
                v-for="(e, i) in examples"
                :key="i"
                @click="goTo(i)"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="i === active ? 'w-6 bg-brand-400' : 'w-1.5 bg-white/20 hover:bg-white/40'"
                :aria-label="`Show ${e.subject} example`"
              ></button>
            </div>
          </div>
        </div>

        <!-- floating mini streak badge -->
        <div class="absolute -bottom-5 -left-5 bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-float" style="animation-delay: 1.5s">
          <div class="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Flame class="w-5 h-5" />
          </div>
          <div>
            <div class="text-white font-bold text-lg leading-none">5</div>
            <div class="text-[11px] text-gray-400">day streak</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { Sparkles, ArrowDown, Check, Lightbulb, Flame } from 'lucide-vue-next'

const getStarted = inject('getStarted', () => {})
const signingIn = inject('signingIn', ref(false))

// Rotating sample questions — shows the platform covers every section,
// starting with Quantitative Aptitude.
const examples = [
  {
    subject: 'Quantitative Aptitude',
    difficulty: 'Medium',
    timer: '01:48',
    question: 'A shopkeeper marks an item <strong class="text-white">40% above cost</strong>, then offers a <strong class="text-white">25% discount</strong>. What is his profit %?',
    options: [
      { text: '5%', correct: true },
      { text: '10%', correct: false },
      { text: '15%', correct: false },
      { text: '8%', correct: false },
    ],
    explanation: 'Take cost = 100 → MP = 140 → SP = 140 × 0.75 = <strong class="text-white">105</strong>, so profit is 5%.',
  },
  {
    subject: 'Reasoning Ability',
    difficulty: 'Easy',
    timer: '00:42',
    question: 'In a certain code <strong class="text-white">CAT = 3-1-20</strong>. What does <strong class="text-white">DOG</strong> stand for?',
    options: [
      { text: '4-15-7', correct: true },
      { text: '4-14-7', correct: false },
      { text: '3-15-7', correct: false },
      { text: '4-15-8', correct: false },
    ],
    explanation: 'Each letter maps to its alphabet position: D=4, O=15, G=7 → <strong class="text-white">4-15-7</strong>.',
  },
  {
    subject: 'English — Error Spotting',
    difficulty: 'Medium',
    timer: '01:10',
    question: 'Spot the error: "Neither of the boys <u class="decoration-dotted">have</u> finished their homework yet."',
    options: [
      { text: 'Neither of the boys', correct: false },
      { text: 'have finished', correct: true },
      { text: 'their homework yet', correct: false },
    ],
    explanation: '"Neither" is singular, so it takes <strong class="text-white">"has finished"</strong>. PrepBookAI explains the rule on every question.',
  },
]

const active = ref(0)
const ex = computed(() => examples[active.value])

let timer = null
const ROTATE_MS = 4500
const startRotation = () => {
  timer = window.setInterval(() => {
    active.value = (active.value + 1) % examples.length
  }, ROTATE_MS)
}
const goTo = (i) => {
  active.value = i
  // Restart the timer so the user gets a full interval on the chosen card.
  if (timer) { clearInterval(timer); startRotation() }
}

onMounted(startRotation)
onBeforeUnmount(() => timer && clearInterval(timer))

// Subtle mouse parallax on the demo card
const tilt = ref({ x: 0, y: 0 })
const cardWrap = ref(null)

const onMove = (e) => {
  const el = cardWrap.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  tilt.value = { x: px, y: py }
}
const onLeave = () => { tilt.value = { x: 0, y: 0 } }

const parallaxStyle = computed(() => ({
  transform: `perspective(1000px) rotateY(${tilt.value.x * 6}deg) rotateX(${-tilt.value.y * 6}deg)`,
  transition: 'transform 0.2s ease-out',
}))
</script>

<style scoped>
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.card-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
@media (prefers-reduced-motion: reduce) {
  .card-fade-enter-active,
  .card-fade-leave-active {
    transition: none;
  }
}
</style>
