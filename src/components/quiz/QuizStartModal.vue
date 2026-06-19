<template>
  <Modal :modelValue="isOpen" @update:modelValue="$emit('update:isOpen', $event)" :title="quiz?.title">
    <div v-if="quiz" class="space-y-4">
      <div class="flex gap-2">
        <Badge variant="brand">{{ quiz.subject }}</Badge>
        <Badge :variant="quiz.difficulty">{{ quiz.difficulty }}</Badge>
      </div>
      
      <p class="text-sm text-text-primary">{{ quiz.topic }}</p>
      
      <div class="bg-surface rounded-lg p-4 border border-border mt-4">
        <ul class="space-y-3 text-sm text-text-primary">
          <li class="flex items-center justify-between">
            <span class="text-text-muted flex items-center"><ListOrdered class="w-4 h-4 mr-2"/> Questions</span>
            <span class="font-medium">{{ quiz.questionCount }}</span>
          </li>
          <li class="flex items-center justify-between">
            <span class="text-text-muted flex items-center"><Clock class="w-4 h-4 mr-2"/> Time Limit</span>
            <span class="font-medium">{{ Math.round(quiz.duration / 60) }} Minutes</span>
          </li>
          <li class="flex items-center justify-between">
            <span class="text-text-muted flex items-center"><AlertCircle class="w-4 h-4 mr-2"/> Negative Marking</span>
            <span class="font-medium text-red-500">-0.25 per wrong answer</span>
          </li>
        </ul>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg text-xs flex items-start mt-4">
        <Info class="w-4 h-4 mr-2 shrink-0 mt-0.5" />
        <p>Ensure you have a stable internet connection. Once started, the timer cannot be paused.</p>
      </div>
    </div>
    
    <template #footer>
      <Button variant="ghost" @click="$emit('update:isOpen', false)">Cancel</Button>
      <Button variant="primary" @click="$emit('start')">Start Quiz</Button>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/ui/Modal.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { Clock, ListOrdered, AlertCircle, Info } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  quiz: {
    type: Object,
    default: null
  }
})

defineEmits(['update:isOpen', 'start'])
</script>
