<template>
  <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group relative" @click="$emit('click')">
    <div v-if="attempt" class="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm border border-green-200 dark:border-green-800">
      <CheckCircle class="w-3.5 h-3.5" />
      <span>{{ attempt.score !== undefined ? `${attempt.percentage?.toFixed(0) || Math.round(attempt.score / attempt.total_marks * 100)}%` : 'Attempted' }}</span>
    </div>

    <div class="p-5 flex-1 flex flex-col">
      <div class="flex justify-between items-start mb-3">
        <Badge variant="brand">{{ quiz.subject }}</Badge>
        <Badge v-if="!attempt" :variant="quiz.difficulty">{{ quiz.difficulty }}</Badge>
      </div>
      
      <h3 class="font-semibold text-lg text-text-primary mb-2 group-hover:text-brand-600 transition-colors line-clamp-2" :class="{ 'pr-16': attempt }">
        {{ quiz.title }}
      </h3>
      
      <p class="text-sm text-text-muted mb-4 mt-auto">
        {{ quiz.topic }}
      </p>
    </div>
    
    <div class="px-5 py-3 border-t border-border bg-black/5 dark:bg-white/5 flex items-center justify-between text-sm text-text-muted">
      <div class="flex items-center">
        <ListOrdered class="w-4 h-4 mr-1.5" />
        {{ quiz.questionCount }} Qs
      </div>
      <div class="flex items-center">
        <Clock class="w-4 h-4 mr-1.5" />
        {{ Math.round(quiz.duration / 60) }} min
      </div>
    </div>
  </div>
</template>

<script setup>
import Badge from '@/components/ui/Badge.vue'
import { Clock, ListOrdered, CheckCircle } from 'lucide-vue-next'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  },
  attempt: {
    type: Object,
    default: null
  }
})

defineEmits(['click'])
</script>
