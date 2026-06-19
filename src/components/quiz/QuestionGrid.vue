<template>
  <div class="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-2">
    <button
      v-for="(question, index) in questions"
      :key="question.id"
      @click="$emit('jump', index)"
      :class="[
        'w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center border',
        getButtonClass(index)
      ]"
      :aria-label="`Jump to question ${index + 1}`"
    >
      {{ index + 1 }}
      <div v-if="markedForReview.has(question.id)" class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  answers: {
    type: Object,
    required: true
  },
  markedForReview: {
    type: Set,
    required: true
  }
})

defineEmits(['jump'])

const getButtonClass = (index) => {
  const questionId = props.questions[index].id
  const isCurrent = index === props.currentIndex
  const isAnswered = props.answers[questionId] !== undefined
  const isMarked = props.markedForReview.has(questionId)

  let baseClass = ''

  if (isCurrent) {
    baseClass = 'ring-2 ring-brand-500 ring-offset-2 ring-offset-background border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 relative'
  } else if (isAnswered) {
    baseClass = 'bg-brand-500 border-brand-500 text-white relative'
  } else if (isMarked) {
    baseClass = 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-400 relative'
  } else {
    baseClass = 'bg-surface border-border text-text-primary hover:border-text-muted hover:bg-black/5 dark:hover:bg-white/5 relative'
  }

  return baseClass
}
</script>
