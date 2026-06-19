<template>
  <div class="bg-surface border border-border rounded-xl overflow-hidden">
    <div class="px-5 py-4 border-b border-border bg-black/5 dark:bg-white/5">
      <h3 class="font-semibold text-text-primary">Recent Activity</h3>
    </div>
    
    <div class="divide-y divide-border">
      <div v-if="!activities || activities.length === 0" class="p-8 text-center text-text-muted">
        No recent activity found. Take a quiz to get started!
      </div>
      
      <router-link 
        v-for="activity in activities" 
        :key="activity.id"
        :to="`/results/${activity.id}`"
        class="block px-5 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-brand-50 text-brand-500 dark:bg-brand-900/30 dark:text-brand-400 flex items-center justify-center shrink-0">
              <CheckCircle class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-medium text-text-primary group-hover:text-brand-600 transition-colors">
                {{ activity.quizTitle }}
              </p>
              <p class="text-xs text-text-muted mt-0.5">
                {{ formatDate(activity.date) }} • {{ formatDuration(activity.timeTaken) }}
              </p>
            </div>
          </div>
          
          <div class="text-right">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="getScoreClass((activity.score / activity.totalQuestions) * 100)">
              {{ activity.score }} / {{ activity.totalQuestions }}
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CheckCircle } from 'lucide-vue-next'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

const getScoreClass = (percentage) => {
  if (percentage >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (percentage >= 50) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}
</script>
