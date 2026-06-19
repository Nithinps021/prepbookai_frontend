<template>
  <div class="bg-surface rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group" @click="$emit('click')">
    <div class="p-5 flex-1 flex flex-col">
      <div class="flex justify-between items-start mb-3">
        <Badge variant="brand">{{ quiz.subject }}</Badge>
        <Badge :variant="quiz.difficulty">{{ quiz.difficulty }}</Badge>
      </div>
      
      <h3 class="font-semibold text-lg text-text-primary mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
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
import { Clock, ListOrdered } from 'lucide-vue-next'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>
