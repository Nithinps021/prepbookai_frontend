<template>
  <section class="relative py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 v-reveal class="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Everything you need to <span class="text-brand-400">prepare smarter</span>
        </h2>
        <p v-reveal="80" class="text-lg text-gray-400">
          Not just another question bank. PrepBookAI is built around how you
          actually improve — practice, feedback, and focus.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(f, i) in features"
          :key="f.title"
          v-reveal="i * 100"
          class="group bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
            :class="f.iconBg"
          >
            <component :is="f.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">{{ f.title }}</h3>
          <p class="text-sm text-gray-400 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { BookOpenCheck, Timer, BarChart3, Target } from 'lucide-vue-next'

const features = [
  {
    title: 'Curated quizzes',
    desc: 'Hand-picked, quality-scored questions across Quantitative Aptitude, Reasoning, English and General Awareness — each with a clear explanation.',
    icon: BookOpenCheck,
    iconBg: 'bg-brand-500/15 text-brand-400',
  },
  {
    title: 'Exam-realistic mocks',
    desc: 'Timed attempts with negative marking, mark-for-review and a real question palette, so test day never surprises you.',
    icon: Timer,
    iconBg: 'bg-purple-500/15 text-purple-400',
  },
  {
    title: 'Detailed analytics',
    desc: 'Accuracy, time spent and score trends visualized — understand exactly where your marks come from and where they leak.',
    icon: BarChart3,
    iconBg: 'bg-green-500/15 text-green-400',
  },
  {
    title: 'Personalized focus',
    desc: 'Set your target — SBI PO, IBPS PO or RBI Grade B — and get recommendations tuned to your goal and weak spots.',
    icon: Target,
    iconBg: 'bg-orange-500/15 text-orange-400',
  },
]
</script>
