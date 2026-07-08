<template>
  <div class="flex flex-col h-full animate-fade-in min-h-0">
    <div class="flex-none mb-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-medium text-text-primary">Question {{ questionNumber }}</h3>
        <div class="flex items-center gap-2 sm:gap-3">
          <Badge v-if="question.difficulty" :variant="question.difficulty" class="hidden sm:inline-flex">{{ question.difficulty }}</Badge>
          
          <button 
            v-if="selectedOption !== null"
            @click="$emit('select', null)"
            class="inline-flex items-center text-sm font-medium transition-colors p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Clear Selection"
          >
            <Eraser class="w-4 h-4 sm:mr-1.5" />
            <span class="hidden sm:inline">Clear</span>
          </button>

          <button 
            @click="$emit('toggle-mark')"
            :class="[
              'inline-flex items-center text-sm font-medium transition-colors p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5',
              isMarked ? 'text-amber-600 dark:text-amber-400' : 'text-text-muted hover:text-text-primary'
            ]"
            title="Mark for Review"
          >
            <Bookmark class="w-4 h-4 sm:mr-1.5" :class="isMarked ? 'fill-current' : ''" />
            <span class="hidden sm:inline">{{ isMarked ? 'Unmark' : 'Mark Review' }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-0">
      <!-- Left Side: Passage and Direction -->
      <div class="flex-1 overflow-y-auto pr-2 lg:pr-8 min-h-0 lg:border-r border-border">
        <div v-if="question.direction" class="text-sm sm:text-base text-text-primary leading-relaxed whitespace-pre-wrap italic mb-4 p-3 bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 rounded-r-md">
          <strong>Directions: </strong>{{ question.direction }}
        </div>
        
        <!-- If it has a passage, display it here -->
        <div v-if="formattedPassage" class="text-sm sm:text-base text-text-primary leading-relaxed whitespace-pre-wrap" v-html="formattedPassage">
        </div>
      </div>

      <!-- Right Side: Question & Options -->
      <div class="flex-1 overflow-y-auto pr-2 lg:pl-4 min-h-0 flex flex-col">
        <!-- Always display the specific question text above the options here -->
        <div class="text-base sm:text-lg text-text-primary font-semibold mb-8 leading-relaxed whitespace-pre-wrap" v-html="formattedQuestion">
        </div>

        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="(option, index) in question.options"
            :key="index"
            @click="selectOption(index)"
            :class="[
              'w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-start group relative overflow-hidden',
              selectedOption === index 
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 shadow-sm' 
                : 'border-border bg-surface text-text-primary hover:border-text-muted hover:bg-black/5 dark:hover:bg-white/5'
            ]"
          >
            <!-- Selection indicator -->
            <div 
              :class="[
                'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 mr-3 mt-0.5 transition-colors',
                selectedOption === index 
                  ? 'border-brand-500 bg-brand-500 text-white' 
                  : 'border-border group-hover:border-text-muted'
              ]"
            >
              <Check v-if="selectedOption === index" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span v-else class="text-[10px] sm:text-xs font-medium text-text-muted">{{ String.fromCharCode(65 + index) }}</span>
            </div>
            <div class="flex-1 text-sm sm:text-[15px] leading-snug">
              {{ option.replace(/^[A-E][).]\s*/, '') }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Bookmark, Eraser } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  selectedOption: {
    type: Number,
    default: null
  },
  isMarked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'toggle-mark'])

const selectOption = (index) => {
  if (props.selectedOption === index) {
    emit('select', null) // Deselect
  } else {
    emit('select', index)
  }
}

const formattedPassage = computed(() => {
  if (!props.question.passage) return ''
  return props.question.passage.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
})

const formattedQuestion = computed(() => {
  const qText = props.question.displayQuestion || props.question.question
  if (!qText) return ''
  // Convert markdown bold (**text**) to HTML <b>text</b>
  return qText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
})
</script>
