<template>
  <section class="relative py-24 px-6">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <!-- Visual: streak calendar -->
      <div v-reveal class="order-2 lg:order-1">
        <div class="bg-white/[0.05] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Flame class="w-6 h-6" />
              </div>
              <div>
                <div class="text-2xl font-bold text-white leading-none">5-day streak</div>
                <div class="text-xs text-gray-400 mt-1">Keep it alive — practice today</div>
              </div>
            </div>
          </div>

          <!-- Week chips -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(day, i) in week"
              :key="i"
              v-reveal="i * 70"
              class="flex flex-col items-center gap-2"
            >
              <span class="text-[11px] text-gray-500">{{ day.label }}</span>
              <div
                class="w-full aspect-square rounded-lg flex items-center justify-center transition-colors"
                :class="day.done
                  ? 'bg-gradient-to-br from-orange-500/30 to-brand-500/30 border border-orange-400/40 text-orange-300'
                  : day.today
                    ? 'border-2 border-dashed border-brand-400/50 text-brand-300'
                    : 'bg-white/5 border border-white/10 text-gray-600'"
              >
                <Flame v-if="day.done" class="w-4 h-4" />
                <span v-else-if="day.today" class="text-[10px] font-semibold">Today</span>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-xl bg-brand-500/10 border border-brand-500/25 p-4 text-sm text-gray-300">
            <span class="text-brand-300 font-semibold">Just 15 minutes a day.</span>
            One short quiz keeps your streak — and your momentum — going.
          </div>
        </div>
      </div>

      <!-- Copy -->
      <div class="order-1 lg:order-2">
        <h2 v-reveal class="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
          Your <span class="text-brand-400">daily companion</span>, not a one-time crammer
        </h2>
        <p v-reveal="80" class="text-lg text-gray-400 leading-relaxed mb-6">
          Big preparation goals are won in small, consistent sessions. PrepBookAI
          shows up every day with a bite-sized quiz, celebrates your streak, and
          gently keeps you on track — like a study buddy who never lets you drift.
        </p>
        <ul class="space-y-4">
          <li v-reveal="160" class="flex items-start gap-3">
            <CalendarCheck class="w-5 h-5 text-brand-400 mt-0.5 shrink-0" />
            <span class="text-gray-300">A fresh, goal-matched quiz waiting for you each day.</span>
          </li>
          <li v-reveal="220" class="flex items-start gap-3">
            <Flame class="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
            <span class="text-gray-300">Streaks and milestones that make showing up feel rewarding.</span>
          </li>
          <li v-reveal="280" class="flex items-start gap-3">
            <Bell class="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
            <span class="text-gray-300">Friendly reminders — encouraging, never nagging.</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Flame, CalendarCheck, Bell } from 'lucide-vue-next'

const week = [
  { label: 'M', done: true },
  { label: 'T', done: true },
  { label: 'W', done: true },
  { label: 'T', done: true },
  { label: 'F', done: true },
  { label: 'S', today: true },
  { label: 'S', done: false },
]
</script>
