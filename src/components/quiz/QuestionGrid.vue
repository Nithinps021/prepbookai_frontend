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
  },
  isReviewMode: {
    type: Boolean,
    default: false
  }
})

defineEmits(['jump'])

const isOptionCorrect = (option, answer) => {
  if (!option || !answer) return false;
  return option.startsWith(answer + ')') || option.startsWith(answer + '.') || option === answer;
}

const getButtonClass = (index) => {
  const question = props.questions[index]
  const questionId = question.id
  const isCurrent = index === props.currentIndex
  const isAnswered = props.answers[questionId] !== undefined
  const isMarked = props.markedForReview.has(questionId)

  let baseClass = 'relative '

  if (props.isReviewMode) {
    if (isAnswered) {
      const selectedOptionIndex = props.answers[questionId]
      const selectedOption = question.options[selectedOptionIndex]
      const correct = isOptionCorrect(selectedOption, question.answer)
      
      baseClass += correct 
        ? 'bg-green-500 text-white border-green-600 ' 
        : 'bg-red-500 text-white border-red-600 '
    } else {
      baseClass += 'bg-surface text-text-secondary opacity-70 border-border '
    }
    
    if (isCurrent) {
      baseClass += 'ring-2 ring-brand-500 ring-offset-2 ring-offset-background '
    }
    
    return baseClass
  }

  if (isCurrent) {
    baseClass += 'ring-2 ring-brand-500 ring-offset-2 ring-offset-background bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 '
  } else if (isAnswered) {
    baseClass += 'bg-brand-500 text-white '
  } else if (isMarked) {
    baseClass += 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 '
  } else {
    baseClass += 'bg-surface text-text-primary hover:bg-black/5 dark:hover:bg-white/5 '
  }

  if (isMarked) {
    baseClass += 'border-2 border-amber-500 dark:border-amber-400 '
  } else if (isCurrent || isAnswered) {
    baseClass += 'border border-brand-500 '
  } else {
    baseClass += 'border border-border hover:border-text-muted '
  }

  return baseClass
}
</script>
