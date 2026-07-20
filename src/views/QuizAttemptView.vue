<template>
  <div class="h-screen flex flex-col bg-background overflow-hidden animate-fade-in" v-if="!isLoading && quizStore.currentQuiz">
    <!-- Top Bar -->
    <header class="h-16 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center truncate">
        <button @click="confirmExit" class="mr-4 text-text-muted hover:text-text-primary transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-sm sm:text-base font-semibold text-text-primary truncate">
          {{ quizStore.currentQuiz.title }}
        </h1>
      </div>
      
      <div class="flex items-center gap-3 sm:gap-6 shrink-0 ml-4">
        <ThemeToggle class="hidden sm:flex" />
        <div class="flex items-center gap-2" v-if="!isReviewMode">
          <Timer 
            :seconds-left="secondsLeft" 
            :formatted-time="formattedTime" 
          />
          <Button 
            variant="secondary" 
            size="sm" 
            @click="togglePause"
            class="flex items-center gap-1.5"
          >
            <component :is="isRunning ? Pause : Play" class="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span class="hidden sm:inline">{{ isRunning ? 'Pause' : 'Resume' }}</span>
          </Button>
        </div>
        <Button v-if="!isReviewMode" variant="primary" size="sm" @click="showSubmitModal = true">
          Submit
        </Button>
        <Button v-else variant="primary" size="sm" @click="closeReview">
          Close Review
        </Button>
      </div>
    </header>

    <!-- Timer Progress Bar -->
    <div class="h-1 w-full bg-border shrink-0" v-if="!isReviewMode">
      <div 
        class="h-full bg-brand-500 transition-all duration-1000 ease-linear"
        :style="{ width: `${(secondsLeft / quizStore.currentQuiz.duration) * 100}%` }"
        :class="{ 'bg-red-500': secondsLeft <= 60, 'bg-amber-500': secondsLeft > 60 && secondsLeft <= 300 }"
      ></div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      
      <!-- Mobile Grid Toggle -->
      <div class="lg:hidden p-4 border-b border-border bg-surface flex justify-end shrink-0">
        <Button variant="secondary" size="sm" @click="isMobileGridOpen = !isMobileGridOpen">
          <LayoutGrid class="w-4 h-4 mr-2" />
          {{ isMobileGridOpen ? 'Hide Grid' : 'Show Grid' }}
        </Button>
      </div>

      <!-- Question Area -->
      <main class="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8 pb-4 relative z-0 flex flex-col">
        <div class="w-full h-full flex flex-col min-h-0">
          <QuestionView 
            v-if="currentQuestion"
            :question="currentQuestion"
            :question-number="quizStore.currentQuestionIndex + 1"
            :selected-option="quizStore.answers[currentQuestion.id]"
            :is-marked="isMarked"
            :is-review-mode="isReviewMode"
            @select="handleSelectOption"
            @toggle-mark="toggleMarkForReview"
            class="flex-1 min-h-0 mb-6"
          />

          <!-- Navigation Buttons -->
          <div class="flex-none pt-4 flex items-center justify-between border-t border-border">
            <Button 
              variant="secondary" 
              @click="prevQuestion" 
              :disabled="quizStore.currentQuestionIndex === 0"
            >
              <ChevronLeft class="w-4 h-4 mr-1 sm:mr-2" />
              Previous
            </Button>
            
            <Button 
              v-if="quizStore.currentQuestionIndex < quizStore.questions.length - 1"
              variant="primary" 
              @click="nextQuestion"
            >
              Next
              <ChevronRight class="w-4 h-4 ml-1 sm:ml-2" />
            </Button>
            <Button 
              v-else
              variant="primary" 
              @click="isReviewMode ? closeReview() : showSubmitModal = true"
              :class="isReviewMode ? '' : 'bg-green-600 hover:bg-green-700'"
            >
              {{ isReviewMode ? 'Close Review' : 'Submit' }}
            </Button>
          </div>
        </div>
      </main>

      <!-- Side Panel (Question Grid) -->
      <aside 
        :class="[
          'bg-surface border-l border-border w-full lg:w-80 flex flex-col transition-transform duration-300 z-10',
          'fixed inset-x-0 bottom-0 top-[120px] lg:static lg:translate-y-0',
          isMobileGridOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
        ]"
      >
        <div class="p-4 border-b border-border font-medium text-text-primary flex justify-between items-center shrink-0 bg-surface">
          <span>Question Overview</span>
          <button @click="isMobileGridOpen = false" class="lg:hidden text-text-muted">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto flex-1 bg-surface">
          <QuestionGrid 
            :questions="quizStore.questions"
            :current-index="quizStore.currentQuestionIndex"
            :answers="quizStore.answers"
            :marked-for-review="quizStore.markedForReview"
            @jump="jumpToQuestion"
          />
        </div>

        <div class="p-4 border-t border-border bg-black/5 dark:bg-white/5 space-y-2 text-xs text-text-muted shrink-0">
          <div class="flex items-center gap-2"><div class="w-3 h-3 bg-brand-500 rounded-sm"></div> Answered</div>
          <div class="flex items-center gap-2"><div class="w-3 h-3 bg-amber-100 border border-amber-300 rounded-sm"></div> Marked for Review</div>
          <div class="flex items-center gap-2"><div class="w-3 h-3 bg-surface border border-border rounded-sm"></div> Unanswered</div>
        </div>
      </aside>

      <!-- Pause Overlay -->
      <div 
        v-if="!isReviewMode && !isRunning && !showSubmitModal && !showExitModal && !isSubmitting"
        class="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-6"
      >
        <div class="bg-surface max-w-md w-full rounded-2xl border border-border p-6 shadow-xl text-center space-y-6">
          <div class="mx-auto w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 animate-pulse">
            <Pause class="w-8 h-8" />
          </div>
          
          <div class="space-y-2">
            <h2 class="text-xl font-bold text-text-primary">Exam Paused</h2>
            <p class="text-sm text-text-muted">Take a breath. Your progress is saved. The timer will resume when you continue.</p>
          </div>
          
          <div class="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border">
            <div class="grid grid-cols-2 divide-x divide-border">
              <div class="text-center">
                <div class="text-xl font-bold text-brand-600">{{ Object.keys(quizStore.answers).length }} / {{ quizStore.questions.length }}</div>
                <div class="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">Answered</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-text-primary">{{ formattedTime }}</div>
                <div class="text-xs text-text-muted mt-1 uppercase tracking-wider font-semibold">Time Left</div>
              </div>
            </div>
          </div>

          <Button variant="primary" class="w-full py-2.5 flex items-center justify-center gap-2" @click="startTimer">
            <Play class="w-4 h-4" />
            Resume Exam
          </Button>
        </div>
      </div>

    </div>

    <!-- Submit Confirmation Modal -->
    <Modal v-model="showSubmitModal" title="Submit Assessment">
      <div class="space-y-4">
        <p class="text-text-primary">Are you sure you want to submit your assessment?</p>
        
        <div class="bg-surface rounded-lg border border-border overflow-hidden">
          <div class="grid grid-cols-3 divide-x divide-border border-b border-border">
            <div class="p-3 text-center">
              <div class="text-2xl font-bold text-brand-600">{{ Object.keys(quizStore.answers).length }}</div>
              <div class="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">Answered</div>
            </div>
            <div class="p-3 text-center">
              <div class="text-2xl font-bold text-amber-500">{{ quizStore.markedForReview.size }}</div>
              <div class="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">Review</div>
            </div>
            <div class="p-3 text-center">
              <div class="text-2xl font-bold text-text-primary">{{ quizStore.questions.length - Object.keys(quizStore.answers).length }}</div>
              <div class="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">Skipped</div>
            </div>
          </div>
          <div class="p-3 bg-black/5 dark:bg-white/5 text-sm text-center text-text-muted flex justify-center items-center">
            <Clock class="w-4 h-4 mr-2" />
            Time remaining: <span class="font-medium ml-1 text-text-primary">{{ formattedTime }}</span>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button variant="secondary" @click="showSubmitModal = false" :disabled="isSubmitting">Continue Test</Button>
        <Button variant="primary" @click="confirmSubmit" :loading="isSubmitting">Final Submit</Button>
      </template>
    </Modal>

    <!-- Exit Confirmation Modal -->
    <Modal v-model="showExitModal" title="Exit Assessment">
      <p class="text-text-primary">Are you sure you want to exit? Your progress will be lost and the test will not be evaluated.</p>
      <template #footer>
        <Button variant="secondary" @click="showExitModal = false">Cancel</Button>
        <Button variant="danger" @click="doExit">Exit Assessment</Button>
      </template>
    </Modal>
  </div>
  
  <div v-else class="h-screen flex items-center justify-center bg-background">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/mock/api'
import { useQuizStore } from '@/stores/quiz'
import { useTimer } from '@/composables/useTimer'
import Timer from '@/components/quiz/Timer.vue'
import QuestionView from '@/components/quiz/QuestionView.vue'
import QuestionGrid from '@/components/quiz/QuestionGrid.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, LayoutGrid, X, Clock, Play, Pause } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const queryClient = useQueryClient()

const isLoading = ref(true)
const showSubmitModal = ref(false)
const showExitModal = ref(false)
const isSubmitting = ref(false)
const isMobileGridOpen = ref(false)

const isReviewMode = computed(() => route.query.review === 'true')

const currentQuestion = computed(() => {
  return quizStore.questions[quizStore.currentQuestionIndex] || null
})

const isMarked = computed(() => {
  if (!currentQuestion.value) return false
  return quizStore.markedForReview.has(currentQuestion.value.id)
})

const { secondsLeft, formattedTime, isRunning, timeTaken, start: startTimer, pause: pauseTimer, reset: resetTimer } = useTimer(0, () => {
  // Auto submit when time is up
  if (!isReviewMode.value) {
    showSubmitModal.value = false
    confirmSubmit()
  }
})

watch(secondsLeft, (newVal, oldVal) => {
  if (isRunning.value && !isReviewMode.value && oldVal > newVal && currentQuestion.value) {
    quizStore.incrementTimeSpent(currentQuestion.value.id)
  }
})

const togglePause = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const subject = computed(() => route.query.subject || 'English Language')
const quizId = computed(() => route.params.id)
const attemptId = computed(() => route.query.attemptId)

const { data: quizData, isError: isQuizError } = useQuery({
  queryKey: ['quiz', quizId],
  queryFn: () => api.getQuiz(quizId.value, subject.value),
  enabled: computed(() => !!quizId.value),
  staleTime: Infinity
})

const { data: questionsData, isError: isQuestionsError } = useQuery({
  queryKey: ['questions', quizId],
  queryFn: () => api.getQuestions(quizId.value, subject.value),
  enabled: computed(() => !!quizId.value),
  staleTime: Infinity
})

const { data: attemptData, isError: isAttemptError } = useQuery({
  queryKey: ['examAttemptDetail', computed(() => String(attemptId.value))],
  queryFn: () => api.getExamAttemptDetail(attemptId.value),
  enabled: computed(() => isReviewMode.value && !!attemptId.value),
  staleTime: Infinity
})

const isQuizInitialized = ref(false)

watch([quizData, questionsData, attemptData], ([quiz, questions, attempt]) => {
  if (isQuizInitialized.value) return;
  
  if (quiz && questions) {
    if (isReviewMode.value && attemptId.value) {
      if (attempt) {
        quizStore.loadAttempt(quiz, questions, attempt)
        isQuizInitialized.value = true
        isLoading.value = false
      }
    } else {
      quizStore.startQuiz(quiz, questions)
      resetTimer(quiz.duration)
      startTimer()
      isQuizInitialized.value = true
      isLoading.value = false
    }
  }
}, { immediate: true })

watch([isQuizError, isQuestionsError, isAttemptError], ([e1, e2, e3]) => {
  if (e1 || e2 || e3) {
    console.error('Failed to load quiz')
    router.push('/quizzes')
  }
})

onUnmounted(() => {
  pauseTimer()
})

const handleSelectOption = (index) => {
  if (currentQuestion.value) {
    quizStore.setAnswer(currentQuestion.value.id, index)
  }
}

const toggleMarkForReview = () => {
  if (currentQuestion.value) {
    quizStore.toggleMarkForReview(currentQuestion.value.id)
  }
}

const nextQuestion = () => {
  if (quizStore.currentQuestionIndex < quizStore.questions.length - 1) {
    quizStore.currentQuestionIndex++
  }
}

const prevQuestion = () => {
  if (quizStore.currentQuestionIndex > 0) {
    quizStore.currentQuestionIndex--
  }
}

const jumpToQuestion = (index) => {
  quizStore.currentQuestionIndex = index
  isMobileGridOpen.value = false
}

const confirmSubmit = async () => {
  isSubmitting.value = true
  pauseTimer()
  
  try {
    const response = await api.submitQuiz(
      quizStore.currentQuiz, 
      quizStore.questions, 
      quizStore.answers, 
      timeTaken.value,
      quizStore.timeSpent
    )
    quizStore.submitQuiz(timeTaken.value)
    
    // Invalidate the cache so the Results and Quizzes pages know to refresh
    queryClient.invalidateQueries({ queryKey: ['examAttempts'] })
    queryClient.invalidateQueries({ queryKey: ['allExamAttempts'] })
    
    // PRE-FETCH the new attempt details and history BEFORE routing
    // This keeps the loading spinner on the Submit button and ensures the 
    // Results page renders instantly without any popping or loading states.
    await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['examAttemptDetail', String(response.id)],
        queryFn: () => api.getExamAttemptDetail(response.id)
      }),
      queryClient.fetchQuery({
        queryKey: ['examAttempts', String(route.params.id)],
        queryFn: () => api.getExamAttempts(null, route.params.id)
      })
    ])
    
    router.push({ path: `/results/${route.params.id}`, query: { attemptId: response.id } })
  } catch (error) {
    console.error('Failed to submit quiz:', error)
    // Fallback in case of error (local score only)
    quizStore.submitQuiz(timeTaken.value)
    router.push(`/results/${route.params.id}`)
  }
}

const confirmExit = () => {
  if (isReviewMode.value) {
    closeReview()
  } else {
    showExitModal.value = true
  }
}

const doExit = () => {
  router.push('/quizzes')
}

const closeReview = () => {
  const attemptId = route.query.attemptId
  if (attemptId) {
    router.push({ path: `/results/${route.params.id}`, query: { attemptId } })
  } else {
    router.push(`/results/${route.params.id}`)
  }
}
</script>
