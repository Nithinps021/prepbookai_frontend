<template>
  <div class="flex flex-col h-full animate-fade-in min-h-0">
    <div class="flex-none mb-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-medium text-text-primary">Question {{ questionNumber }}</h3>
        <div class="flex items-center gap-2 sm:gap-3">
          <Badge v-if="question.difficulty" :variant="question.difficulty" class="hidden sm:inline-flex">{{ question.difficulty }}</Badge>
          
          <template v-if="!isReviewMode">
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
          </template>
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
        <div class="text-sm sm:text-base text-text-primary mb-8 leading-relaxed whitespace-pre-wrap" v-html="formattedQuestion">
        </div>

        <div class="grid grid-cols-1 gap-3">
          <button
            v-for="(option, index) in question.options"
            :key="index"
            @click="!isReviewMode && selectOption(index)"
            :disabled="isReviewMode"
            :class="[
              'w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-start group relative overflow-hidden',
              getOptionClass(option, index)
            ]"
          >
            <!-- Selection indicator -->
            <div 
              :class="[
                'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 mr-3 mt-0.5 transition-colors',
                getIndicatorClass(option, index)
              ]"
            >
              <Check v-if="selectedOption === index || (isReviewMode && isActuallyCorrect(option))" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span v-else class="text-[10px] sm:text-xs font-medium text-text-muted">{{ String.fromCharCode(65 + index) }}</span>
            </div>
            <div class="flex-1 text-sm sm:text-[15px] leading-snug">
              {{ option.replace(/^[A-E][).]\s*/, '') }}
            </div>
            <div v-if="isReviewMode" class="shrink-0 ml-2">
              <span v-if="isActuallyCorrect(option)" class="text-[10px] sm:text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded">Correct</span>
              <span v-else-if="selectedOption === index" class="text-[10px] sm:text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded">Your Answer</span>
            </div>
          </button>
        </div>
        
        <!-- Explanation Box -->
        <div v-if="isReviewMode && question.explanation" class="mt-6 p-4 sm:p-5 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-900/30">
          <div class="flex items-center gap-2 mb-2 text-brand-700 dark:text-brand-400 font-semibold text-sm">
            <Lightbulb class="w-4 h-4" />
            Explanation
          </div>
          <p class="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{{ question.explanation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Bookmark, Eraser, Lightbulb } from 'lucide-vue-next'
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
  },
  isReviewMode: {
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

const isActuallyCorrect = (option) => {
  const answer = props.question.answer;
  if (!option || !answer) return false;
  return option.startsWith(answer + ')') || option.startsWith(answer + '.') || option === answer;
}

const getOptionClass = (option, index) => {
  if (!props.isReviewMode) {
    return props.selectedOption === index 
      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 shadow-sm cursor-pointer' 
      : 'border-border bg-surface text-text-primary hover:border-text-muted hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'
  }
  
  const correct = isActuallyCorrect(option)
  if (correct) {
    return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
  }
  
  if (props.selectedOption === index && !correct) {
    return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
  }
  
  return 'bg-background border-border text-text-secondary opacity-70'
}

const getIndicatorClass = (option, index) => {
  if (!props.isReviewMode) {
    return props.selectedOption === index 
      ? 'border-brand-500 bg-brand-500 text-white' 
      : 'border-border group-hover:border-text-muted'
  }
  
  const correct = isActuallyCorrect(option)
  if (correct) {
    return 'border-green-500 bg-green-500 text-white'
  }
  
  if (props.selectedOption === index && !correct) {
    return 'border-red-500 bg-red-500 text-white'
  }
  
  return 'border-border bg-transparent'
}

const formattedPassage = computed(() => {
  if (!props.question.passage) return ''
  let html = props.question.passage.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  return html.replace(/\n/g, '<br/>')
})

const formattedQuestion = computed(() => {
  let qText = props.question.displayQuestion || props.question.question
  if (!qText) return ''
  
  // Parse for column matching question format
  let colMatching = false
  let parts = []
  
  if (qText.includes('||') && qText.includes('Column')) {
    parts = qText.split('||').map(p => p.trim());
    if (parts.length === 2) {
      colMatching = true
    }
  } else if (qText.includes('Column I') && qText.includes('Column II')) {
    const col2Idx = qText.indexOf('Column II');
    if (col2Idx !== -1) {
      parts = [
        qText.substring(0, col2Idx).trim(),
        qText.substring(col2Idx).trim()
      ]
      colMatching = true
    }
  }

  if (colMatching && parts.length === 2) {
    const parseColumn = (text) => {
      let header = '';
      const headerMatch = text.match(/(Column\s+[I12Vv]+:?)/i);
      if (headerMatch) {
         header = headerMatch[1].replace(':', '').trim();
      }
      
      const items = [];
      const regex = /(\([A-Z]\)|\([ivxIVX]+\)|[A-Z]\.|[ivxIVX]+\.)\s*(.*?)(?=\s*(?:\([A-Z]\)|\([ivxIVX]+\)|[A-Z]\.|[ivxIVX]+\.)\s*|$)/gs;
      let match;
      while ((match = regex.exec(text)) !== null) {
         items.push(match[1] + ' ' + match[2].trim());
      }
      
      if (items.length === 0) {
         // Fallback if no bullets found, split by newline
         const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
         items.push(...lines.filter(line => !line.toLowerCase().startsWith('column')));
      }

      return { header, items };
    };

    const formatItem = (item) => {
      if (!item) return '';
      let match = item.match(/^\(?([A-Zivx]+)\)?\s*(.*)/i);
      let text = item;
      if (match) {
        let letter = match[1];
        let rest = match[2];
        let prefix = item.startsWith('(') ? `(${letter})` : `${letter})`;
        text = `<span class="font-medium mr-1">${prefix}</span><span>${rest}</span>`;
      }
      return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    };

    const col1 = parseColumn(parts[0]);
    const col2 = parseColumn(parts[1]);

    let html = `<div class="overflow-x-auto w-full mb-4 mt-2 max-w-3xl">`;
    html += `<table class="w-full border-collapse border border-border text-xs sm:text-sm lg:text-base">`;
    if (col1.header || col2.header) {
      html += `<thead><tr class="bg-surface-50 dark:bg-surface-900">`;
      html += `<th class="border border-border px-3 py-2 font-semibold text-left">${col1.header}</th>`;
      html += `<th class="border border-border px-3 py-2 font-semibold text-left">${col2.header}</th>`;
      html += `</tr></thead>`;
    }

    html += `<tbody>`;
    const maxLen = Math.max(col1.items.length, col2.items.length);
    for (let i = 0; i < maxLen; i++) {
      const item1 = formatItem(col1.items[i]);
      const item2 = formatItem(col2.items[i]);
      html += `<tr class="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">`;
      html += `<td class="border border-border px-2 sm:px-3 py-1 leading-tight align-top text-text-primary">${item1}</td>`;
      html += `<td class="border border-border px-2 sm:px-3 py-1 leading-tight align-top text-text-primary">${item2}</td>`;
      html += `</tr>`;
    }
    html += `</tbody></table></div>`;
    
    return html;
  }

  // Default behavior: Convert markdown bold (**text**) to HTML <b>text</b>
  let html = qText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
  return html.replace(/\n/g, '<br/>')
})
</script>
