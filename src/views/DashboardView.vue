<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Greeting -->
    <div>
      <h2 class="text-2xl font-bold text-text-primary flex items-center gap-3">
        Welcome back, {{ authStore.user?.name || 'Student' }}! 👋
      </h2>
      <p class="mt-1 text-sm text-text-muted">
        Signed in as <span class="font-medium text-text-primary">{{ authStore.user?.email }}</span>
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Total Quizzes" 
        :value="authStore.user?.stats?.totalQuizzes || 0"
        colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      >
        <template #icon><Library class="w-6 h-6" /></template>
      </StatCard>
      
      <StatCard 
        label="Average Score" 
        :value="(authStore.user?.stats?.averageScore || 0) + '%'"
        colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
      >
        <template #icon><Target class="w-6 h-6" /></template>
      </StatCard>
      
      <StatCard 
        label="Time Spent" 
        :value="formatTime(authStore.user?.stats?.timeSpent || 0)"
        colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
      >
        <template #icon><Clock class="w-6 h-6" /></template>
      </StatCard>
      
      <StatCard 
        label="Current Streak" 
        :value="(authStore.user?.stats?.streak || 0) + ' Days'"
        colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
      >
        <template #icon><Flame class="w-6 h-6" /></template>
      </StatCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-surface border border-border rounded-xl p-5 shadow-soft">
        <h3 class="font-semibold text-text-primary mb-4">Subject Mastery</h3>
        <div class="space-y-5">
          <ProgressBar label="English" :percentage="85" colorClass="bg-green-500" />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-surface border border-border rounded-xl p-5 shadow-soft flex flex-col">
        <h3 class="font-semibold text-text-primary mb-4">Quick Start</h3>
        <div class="space-y-3 flex-1">
          <router-link to="/quizzes?subject=English" class="flex items-center p-3 rounded-lg border border-border hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group">
            <BookOpen class="w-5 h-5 text-text-muted group-hover:text-brand-500 mr-3" />
            <span class="font-medium text-text-primary text-sm group-hover:text-brand-600 transition-colors">English Test</span>
            <ChevronRight class="w-4 h-4 ml-auto text-text-muted group-hover:text-brand-500" />
          </router-link>
        </div>
        
        <router-link to="/quizzes" class="mt-4 block w-full text-center py-2 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-lg text-sm font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
          Browse All Quizzes
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div>
      <RecentActivity :activities="authStore.user?.recentActivity" />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/dashboard/StatCard.vue'
import ProgressBar from '@/components/dashboard/ProgressBar.vue'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'
import { Library, Target, Clock, Flame, ChevronRight, BookOpen } from 'lucide-vue-next'

const authStore = useAuthStore()

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}
</script>
