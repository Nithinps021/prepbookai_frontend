<template>
  <div class="h-screen bg-background overflow-y-auto w-full">
    <div class="w-full mx-auto px-4 md:px-8 lg:px-12 py-4 sm:py-6 lg:py-8">
      <div v-if="isLoading" class="flex justify-center items-center h-[50vh]">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
      <div class="space-y-6 animate-fade-in pb-10" v-else-if="quizStore.isFinished && score">
        <!-- Header Summary -->
        <div class="bg-surface rounded-2xl p-6 md:p-10 border border-border shadow-soft relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <!-- Confetti Canvas -->
          <canvas id="confetti-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>
          
          <div class="relative z-10 text-center md:text-left">
            <Badge :variant="score.percentage >= 50 ? 'success' : 'danger'" class="mb-4">
              {{ score.percentage >= 80 ? 'Excellent' : score.percentage >= 50 ? 'Good' : 'Needs Practice' }}
            </Badge>
            
            <h2 class="text-4xl md:text-5xl font-extrabold text-text-primary mb-2">
              {{ score.score.toFixed(2) }} <span class="text-xl md:text-2xl text-text-muted font-medium">/ {{ score.total }}</span>
            </h2>
            
            <p class="text-text-muted">
              You scored {{ score.percentage.toFixed(0) }}% in <span class="font-medium text-text-primary">{{ quizStore.currentQuiz.title }}</span>
            </p>
          </div>

          <!-- Donut Chart -->
          <div class="relative z-10 w-32 h-32 md:w-40 md:h-40 shrink-0">
            <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
              <path class="text-border fill-none stroke-current" stroke-width="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-green-500 fill-none stroke-current transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${(score.correct / score.total) * 100}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-red-500 fill-none stroke-current transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${(score.wrong / score.total) * 100}, 100`" :stroke-dashoffset="`-${(score.correct / score.total) * 100}`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-xl md:text-2xl font-bold text-text-primary">{{ ((score.correct / score.total) * 100).toFixed(0) }}%</span>
              <span class="text-[10px] md:text-xs text-text-muted uppercase tracking-wider">Accuracy</span>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-surface border border-border p-4 rounded-xl text-center shadow-soft hover:shadow-hover transition-shadow">
            <div class="text-sm text-text-muted mb-1 font-medium">Correct</div>
            <div class="text-2xl font-bold text-green-500">{{ score.correct }}</div>
          </div>
          <div class="bg-surface border border-border p-4 rounded-xl text-center shadow-soft hover:shadow-hover transition-shadow">
            <div class="text-sm text-text-muted mb-1 font-medium">Incorrect</div>
            <div class="text-2xl font-bold text-red-500">{{ score.wrong }}</div>
            <div class="text-xs text-red-400 mt-0.5">(-{{ (score.wrong * 0.25).toFixed(2) }} marks)</div>
          </div>
          <div class="bg-surface border border-border p-4 rounded-xl text-center shadow-soft hover:shadow-hover transition-shadow">
            <div class="text-sm text-text-muted mb-1 font-medium">Unanswered</div>
            <div class="text-2xl font-bold text-text-primary">{{ score.unanswered }}</div>
          </div>
          <div class="bg-surface border border-border p-4 rounded-xl text-center shadow-soft hover:shadow-hover transition-shadow">
            <div class="text-sm text-text-muted mb-1 font-medium">Time Taken</div>
            <div class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ formatDuration(quizStore.timeTaken) }}</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center py-4">
          <Button variant="secondary" @click="$router.push('/quizzes')">
            <Library class="w-4 h-4 mr-2" />
            Back to Quizzes
          </Button>
          <Button variant="primary" @click="$router.push(`/quiz/${quizStore.currentQuiz.id}`)">
            <RotateCcw class="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>

        <!-- Detailed Review -->
        <div class="mt-10">
          <h3 class="text-xl font-bold text-text-primary mb-6">Detailed Review</h3>
          
          <div class="space-y-4">
            <div 
              v-for="(q, index) in quizStore.questions" 
              :key="q.id"
              class="bg-surface border rounded-xl overflow-hidden shadow-sm transition-all duration-200"
              :class="getReviewCardClass(q, index)"
            >
              <!-- Accordion Header -->
              <button 
                @click="toggleExpand(q.id)"
                class="w-full p-4 sm:p-5 flex items-start gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                :class="{ 'border-b border-border/50 bg-black/5 dark:bg-white/5': expandedQuestions.has(q.id) }"
              >
                <div class="mt-0.5 shrink-0">
                  <CheckCircle v-if="isCorrect(q, index)" class="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  <XCircle v-else-if="isWrong(q, index)" class="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  <MinusCircle v-else class="w-5 h-5 sm:w-6 sm:h-6 text-text-muted" />
                </div>
                <div class="flex-1 pr-4">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-xs sm:text-sm font-semibold text-text-muted">Q{{ index + 1 }}</span>
                    <Badge v-if="q.difficulty" :variant="q.difficulty" class="hidden sm:inline-flex">{{ q.difficulty }}</Badge>
                  </div>
                  <p class="text-sm sm:text-[15px] text-text-primary font-medium line-clamp-2" :class="{ 'line-clamp-none': expandedQuestions.has(q.id) }" v-html="formatQuestion(q.question)">
                  </p>
                </div>
                <div class="shrink-0 text-text-muted transition-transform duration-200" :class="{ 'rotate-180': expandedQuestions.has(q.id) }">
                  <ChevronDown class="w-5 h-5" />
                </div>
              </button>
              
              <!-- Accordion Content -->
              <div v-if="expandedQuestions.has(q.id)" class="p-4 sm:p-5 space-y-3 animate-fade-in">
                <div 
                  v-for="(option, optIndex) in q.options" 
                  :key="optIndex"
                  class="p-3 rounded-lg text-sm border flex items-center justify-between"
                  :class="getOptionClass(q, index, optIndex)"
                >
                  <span>{{ String.fromCharCode(65 + optIndex) }}. {{ option.replace(/^[A-E][).]\s*/, '') }}</span>
                  <span v-if="isOptionCorrect(option, q.answer)" class="text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded">Correct</span>
                  <span v-else-if="quizStore.answers[q.id] === optIndex" class="text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded">Your Answer</span>
                </div>
                
                <!-- Explanation -->
                <div class="mt-4 p-4 bg-brand-50/50 dark:bg-brand-900/10 rounded-lg border border-brand-100 dark:border-brand-900/30 text-sm">
                  <div class="flex items-center gap-2 mb-1.5 text-brand-700 dark:text-brand-400 font-semibold">
                    <Lightbulb class="w-4 h-4" />
                    Explanation
                  </div>
                  <p class="text-text-primary leading-relaxed whitespace-pre-wrap">{{ q.explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="h-[50vh] flex flex-col items-center justify-center text-center">
        <div class="p-4 bg-surface rounded-full mb-4">
          <AlertCircle class="w-8 h-8 text-amber-500" />
        </div>
        <h3 class="text-lg font-medium text-text-primary">No Results Found</h3>
        <p class="text-text-muted mt-2 max-w-sm">It looks like you haven't completed a quiz yet or the session expired.</p>
        <Button variant="primary" class="mt-6" @click="$router.push('/quizzes')">Go to Quizzes</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { api } from '@/mock/api'
import confetti from 'canvas-confetti'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { CheckCircle, XCircle, MinusCircle, Library, RotateCcw, Lightbulb, AlertCircle, ChevronDown } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()

const score = computed(() => quizStore.calculateScore)
const expandedQuestions = ref(new Set())
const isLoading = ref(true)

const toggleExpand = (id) => {
  if (expandedQuestions.value.has(id)) {
    expandedQuestions.value.delete(id)
  } else {
    expandedQuestions.value.add(id)
  }
}

onMounted(async () => {
  const attemptId = route.query.attemptId
  const quizId = route.params.id
  
  if (attemptId && quizId) {
    try {
      const [quizData, questionsData, attemptData] = await Promise.all([
        api.getQuiz(quizId),
        api.getQuestions(quizId),
        api.getExamAttemptDetail(attemptId)
      ])
      quizStore.loadAttempt(quizData, questionsData, attemptData)
    } catch (error) {
      console.error('Failed to load past attempt', error)
    }
  }
  
  isLoading.value = false

  if (quizStore.isFinished && score.value && score.value.percentage >= 70) {
    // Delay slightly to ensure canvas is in DOM
    setTimeout(triggerConfetti, 100)
  }
})

const triggerConfetti = () => {
  const canvas = document.getElementById('confetti-canvas')
  if (!canvas) return
  
  const myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true
  })
  
  myConfetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6']
  })
}

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

const formatQuestion = (text) => {
  if (!text) return ''
  return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
}

const isOptionCorrect = (option, answer) => {
  if (!option || !answer) return false;
  return option.startsWith(answer + ')') || option.startsWith(answer + '.') || option === answer;
}

const isCorrect = (q, index) => {
  const ansIndex = quizStore.answers[q.id]
  return ansIndex !== undefined && isOptionCorrect(q.options[ansIndex], q.answer)
}

const isWrong = (q, index) => {
  const ansIndex = quizStore.answers[q.id]
  return ansIndex !== undefined && !isOptionCorrect(q.options[ansIndex], q.answer)
}

const getReviewCardClass = (q, index) => {
  if (isCorrect(q, index)) return 'border-green-200 dark:border-green-900/50'
  if (isWrong(q, index)) return 'border-red-200 dark:border-red-900/50'
  return 'border-border'
}

const getOptionClass = (q, index, optIndex) => {
  const isSelected = quizStore.answers[q.id] === optIndex
  const isActuallyCorrect = isOptionCorrect(q.options[optIndex], q.answer)
  
  if (isActuallyCorrect) {
    return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
  }
  
  if (isSelected && !isActuallyCorrect) {
    return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
  }
  
  return 'bg-background border-border text-text-secondary'
}
</script>
