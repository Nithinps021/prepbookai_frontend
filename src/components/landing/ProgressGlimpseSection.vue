<template>
  <section ref="root" class="relative py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <h2 v-reveal class="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          A glimpse of <span class="text-brand-400">your dashboard</span>
        </h2>
        <p v-reveal="80" class="text-lg text-gray-400">
          Every quiz feeds a living picture of your progress. Here's what you'll
          wake up to each morning.
        </p>
      </div>

      <!-- Dashboard mockup -->
      <div v-reveal="120" class="bg-white/[0.04] border border-white/10 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-3 h-3 rounded-full bg-red-400/70"></span>
          <span class="w-3 h-3 rounded-full bg-amber-400/70"></span>
          <span class="w-3 h-3 rounded-full bg-green-400/70"></span>
          <span class="ml-3 text-sm text-gray-400">Welcome back, Abhija 👋</span>
        </div>

        <!-- Stat cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-2xl bg-black/30 border border-white/10 p-5"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="w-10 h-10 rounded-lg flex items-center justify-center" :class="stat.iconBg">
                <component :is="stat.icon" class="w-5 h-5" />
              </span>
            </div>
            <div class="text-2xl sm:text-3xl font-bold text-white">
              {{ stat.prefix }}{{ stat.display }}{{ stat.suffix }}
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ stat.label }}</div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Subject mastery -->
          <div class="lg:col-span-2 rounded-2xl bg-black/30 border border-white/10 p-6">
            <h3 class="font-semibold text-white mb-5">Subject Mastery</h3>
            <div class="space-y-5">
              <div v-for="bar in mastery" :key="bar.label">
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="text-gray-300">{{ bar.label }}</span>
                  <span class="text-gray-400">{{ bar.value }}%</span>
                </div>
                <div class="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-[width] duration-1000 ease-out"
                    :class="bar.color"
                    :style="{ width: visible ? bar.value + '%' : '0%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent activity -->
          <div class="rounded-2xl bg-black/30 border border-white/10 p-6">
            <h3 class="font-semibold text-white mb-5">Recent Activity</h3>
            <ul class="space-y-3">
              <li v-for="a in activity" :key="a.title" class="flex items-center justify-between">
                <div class="min-w-0">
                  <div class="text-sm text-gray-200 truncate">{{ a.title }}</div>
                  <div class="text-[11px] text-gray-500">{{ a.date }}</div>
                </div>
                <span
                  class="ml-3 shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md"
                  :class="a.badge"
                >{{ a.score }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { Library, Target, Clock, Flame } from 'lucide-vue-next'
import { useCountUp } from '@/composables/useCountUp'

const root = ref(null)
const visible = ref(false)

const q = useCountUp(42)
const avg = useCountUp(78.5, { decimals: 1 })
const hrs = useCountUp(208)
const streak = useCountUp(5)

const stats = reactive([
  { label: 'Total Quizzes', display: q.display, prefix: '', suffix: '', icon: Library, iconBg: 'bg-brand-500/15 text-brand-400' },
  { label: 'Average Score', display: avg.display, prefix: '', suffix: '%', icon: Target, iconBg: 'bg-green-500/15 text-green-400' },
  { label: 'Time Spent', display: hrs.display, prefix: '', suffix: 'h', icon: Clock, iconBg: 'bg-purple-500/15 text-purple-400' },
  { label: 'Current Streak', display: streak.display, prefix: '', suffix: 'd', icon: Flame, iconBg: 'bg-orange-500/15 text-orange-400' },
])

const mastery = [
  { label: 'Quantitative Aptitude', value: 82, color: 'bg-green-500' },
  { label: 'Reasoning Ability', value: 74, color: 'bg-brand-500' },
  { label: 'English Language', value: 68, color: 'bg-amber-500' },
]

const activity = [
  { title: 'Data Interpretation Set 2', date: 'Today', score: '9/10', badge: 'bg-green-500/15 text-green-300' },
  { title: 'Seating Arrangement', date: 'Yesterday', score: '6/10', badge: 'bg-amber-500/15 text-amber-300' },
  { title: 'Reading Comprehension', date: '2 days ago', score: '8/10', badge: 'bg-green-500/15 text-green-300' },
]

let observer
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        visible.value = true
        q.start(); avg.start(); hrs.start(); streak.start()
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer && observer.disconnect())
</script>
