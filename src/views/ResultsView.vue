<template>
  <div class="h-screen bg-background overflow-hidden w-full flex">
    
    <!-- LEFT: History Sidebar -->
    <div class="w-64 md:w-80 border-r border-border bg-black/5 dark:bg-white/5 flex flex-col shrink-0">
      <div class="p-4 border-b border-border bg-surface shrink-0">
        <h3 class="font-bold flex items-center text-text-primary"><History class="w-4 h-4 mr-2" /> Attempt History</h3>
      </div>
      
      <!-- History Skeleton -->
      <template v-if="isInitialLoad">
        <div class="flex-1 p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 rounded-xl bg-surface border border-border animate-pulse"></div>
        </div>
      </template>
      
      <!-- History List -->
      <template v-else>
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div 
            v-for="attempt in attemptsList" 
            :key="attempt.id"
            @click="loadAttemptData(attempt.id)"
            class="p-4 rounded-xl border cursor-pointer transition-all duration-200 shadow-sm"
            :class="String(attempt.id) === String(currentAttemptId) ? 'bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800' : 'bg-surface border-border hover:border-brand-300 hover:shadow-md'"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs font-semibold text-text-muted">Attempt {{ attempt.attempt_number }}</span>
              <span class="text-[10px] text-text-muted">{{ formatDate(attempt.created_at) }}</span>
            </div>
            <div class="flex justify-between items-end">
              <span class="font-bold text-lg text-text-primary">{{ attempt.score }} <span class="text-xs font-normal text-text-muted">/ {{ attempt.total_marks }}</span></span>
              <span class="text-xs font-medium" :class="attempt.percentage >= 70 ? 'text-green-600' : 'text-amber-600'">{{ attempt.percentage.toFixed(0) }}%</span>
            </div>
          </div>
          <div v-if="attemptsList.length === 0" class="text-sm text-text-muted text-center mt-4">
            No previous attempts found.
          </div>
        </div>
      </template>
    </div>

    <!-- RIGHT: Analytics Dashboard -->
    <div class="flex-1 flex flex-col bg-background relative overflow-hidden">
      
      <template v-if="isInitialLoad || isAttemptLoading">
        <div class="p-6 md:p-8 space-y-8 animate-pulse w-full max-w-5xl mx-auto overflow-y-auto">
          <div class="h-10 w-3/4 bg-black/5 dark:bg-white/5 rounded-lg"></div>
          
          <div class="flex gap-4">
            <div class="w-64 h-32 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
            <div class="w-64 h-32 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="w-full h-48 bg-black/5 dark:bg-white/5 rounded-2xl border border-border"></div>
          </div>
        </div>
      </template>
      
      <template v-else-if="quizStore.isFinished && score">
        <canvas id="confetti-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0" style="height: 300px;"></canvas>
        
        <div class="flex-1 overflow-y-auto w-full p-6 md:p-8 relative z-10 custom-scrollbar">
          <div class="max-w-6xl mx-auto space-y-8">
            
            <!-- Header & Actions -->
            <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-surface p-6 rounded-2xl border border-border shadow-sm">
              <div>
                <Badge variant="brand" class="mb-3">{{ quizStore.currentQuiz.subject }}</Badge>
                <h2 class="text-3xl font-extrabold text-text-primary mb-2">{{ quizStore.currentQuiz.title }}</h2>
                <p class="text-sm text-text-muted flex items-center gap-2">
                  <Clock class="w-4 h-4" /> {{ formatDuration(quizStore.timeTaken) }} time taken for this attempt
                </p>
              </div>
              
              <div class="flex flex-wrap gap-3 shrink-0">
                <Button variant="secondary" @click="$router.push('/quizzes')">
                  <Library class="w-4 h-4 mr-2" /> All Quizzes
                </Button>
                <Button variant="secondary" @click="$router.push(`/quiz/${quizStore.currentQuiz.id}`)">
                  <RotateCcw class="w-4 h-4 mr-2" /> Retake
                </Button>
                <Button variant="primary" @click="enterReviewMode" class="shadow-md hover:-translate-y-0.5 transition-transform text-base px-6 py-2">
                  <Eye class="w-5 h-5 mr-2" /> Detailed Review
                </Button>
              </div>
            </div>
            
            <!-- High Level Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <!-- Score Donut -->
              <div class="col-span-1 md:col-span-2 flex items-center gap-6 bg-brand-50/50 dark:bg-brand-900/10 p-6 rounded-2xl border border-brand-100 dark:border-brand-900/30 shadow-sm">
                <div class="relative w-28 h-28 shrink-0">
                  <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                    <path class="text-brand-200 dark:text-brand-900/30 fill-none stroke-current" stroke-width="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="text-brand-500 fill-none stroke-current transition-all duration-1000 ease-out" stroke-width="3" :stroke-dasharray="`${(score.correct / score.total) * 100}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-2xl font-black text-text-primary">{{ ((score.correct / score.total) * 100).toFixed(0) }}%</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-4xl font-extrabold text-text-primary leading-none mb-2">{{ score.score.toFixed(2) }} <span class="text-xl text-text-muted font-bold">/ {{ score.total }}</span></h3>
                  <p class="text-sm font-semibold text-brand-600 dark:text-brand-400">Total Attempt Score</p>
                  <p v-if="score.wrong > 0" class="text-xs font-medium text-red-500 mt-1">
                    (-{{ (score.wrong * 0.25).toFixed(2) }} Negative Marks)
                  </p>
                </div>
              </div>
              
              <!-- Correct/Wrong Breakdown -->
              <div class="col-span-1 md:col-span-2 grid grid-cols-3 gap-3">
                <div class="bg-surface p-4 rounded-2xl border border-border flex flex-col items-center justify-center shadow-sm">
                  <CheckCircle class="w-6 h-6 text-green-500 mb-2"/>
                  <span class="text-2xl font-bold text-text-primary">{{ score.correct }}</span>
                  <span class="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">Correct</span>
                </div>
                <div class="bg-surface p-4 rounded-2xl border border-border flex flex-col items-center justify-center shadow-sm">
                  <XCircle class="w-6 h-6 text-red-500 mb-2"/>
                  <span class="text-2xl font-bold text-text-primary">{{ score.wrong }}</span>
                  <span class="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">Wrong</span>
                </div>
                <div class="bg-surface p-4 rounded-2xl border border-border flex flex-col items-center justify-center shadow-sm">
                  <MinusCircle class="w-6 h-6 text-text-muted mb-2"/>
                  <span class="text-2xl font-bold text-text-primary">{{ score.unanswered }}</span>
                  <span class="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">Skipped</span>
                </div>
              </div>
            </div>

            <!-- Topic Blocks Grid -->
            <div>
              <h3 class="font-bold text-xl text-text-primary mb-5 flex items-center"><ListOrdered class="w-5 h-5 mr-2 text-brand-500" /> Topic Performance</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div 
                  v-for="topic in groupedQuestions" 
                  :key="topic.name" 
                  class="bg-surface border border-border rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                  :class="/reading comprehension|grammar|grammer/.test(topic.name.toLowerCase()) ? 'lg:col-span-2' : ''"
                >
                  <h4 class="font-bold text-lg text-text-primary mb-2 line-clamp-1" :title="topic.name">{{ topic.name }}</h4>
                  <div class="flex justify-between items-center mb-5 border-b border-border/50 pb-4">
                    <span class="text-3xl font-black" :class="(topic.correct/topic.total) >= 0.7 ? 'text-green-600 dark:text-green-400' : (topic.correct/topic.total) >= 0.4 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'">
                      {{ Math.round((topic.correct / topic.total) * 100) || 0 }}%
                    </span>
                    <div class="flex items-center gap-2">
                      <span v-if="topic.timeSpent > 0" class="text-sm font-semibold bg-black/5 dark:bg-white/5 border border-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-text-secondary">
                        <Clock class="w-3.5 h-3.5" /> {{ formatTime(topic.timeSpent) }}
                      </span>
                      <span class="text-sm font-semibold bg-black/5 dark:bg-white/5 border border-border px-3 py-1.5 rounded-lg">
                        {{ topic.correct }} / {{ topic.total }} Correct
                      </span>
                    </div>
                  </div>
                  
                  <!-- Subtopics -->
                  <div 
                    class="mt-auto overflow-y-auto pr-2 custom-scrollbar"
                    :class="/reading comprehension|grammar|grammer/.test(topic.name.toLowerCase()) ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3 max-h-[300px]' : 'space-y-3 max-h-[140px]'"
                  >
                    <div v-for="sub in topic.subTopics" :key="sub.name" class="flex justify-between items-center text-sm">
                      <span class="text-text-secondary truncate pr-3 font-medium" :title="sub.name">{{ sub.name }}</span>
                      <span class="font-bold whitespace-nowrap bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded" :class="(sub.correct/sub.total) >= 0.7 ? 'text-green-600 dark:text-green-400' : (sub.correct/sub.total) >= 0.4 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'">
                        {{ sub.correct }}/{{ sub.total }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </template>

      <!-- NO RESULTS / ERROR -->
      <template v-else>
        <div class="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div class="p-4 bg-surface rounded-full mb-4">
            <AlertCircle class="w-8 h-8 text-amber-500" />
          </div>
          <h3 class="text-lg font-medium text-text-primary">No Results Found</h3>
          <p class="text-text-muted mt-2 max-w-sm">It looks like you haven't completed a quiz yet or the session expired.</p>
          <Button variant="primary" class="mt-6" @click="$router.push('/quizzes')">Go to Quizzes</Button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useQuizStore } from '@/stores/quiz'
import { api } from '@/mock/api'
import confetti from 'canvas-confetti'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { CheckCircle, XCircle, MinusCircle, Library, RotateCcw, Clock, History, Eye, ListOrdered, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const quizStore = useQuizStore()

const score = computed(() => quizStore.calculateScore)
const isInitialLoad = ref(true)
const currentAttemptId = ref(route.query.attemptId || null)

const { data: attemptsList, isPending: isAttemptsLoading } = useQuery({
  queryKey: ['examAttempts', computed(() => route.params.id)],
  queryFn: () => api.getExamAttempts(null, route.params.id),
  enabled: computed(() => !!route.params.id)
})

watch(attemptsList, (newAttempts) => {
  const attemptId = route.query.attemptId
  if (!attemptId && newAttempts && newAttempts.length > 0 && !currentAttemptId.value) {
    loadAttemptData(newAttempts[0].id)
  }
}, { immediate: true })

const formatTime = (seconds) => {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

const groupedQuestions = computed(() => {
  if (!quizStore.questions) return []
  
  const groups = {}
  
  quizStore.questions.forEach((q, index) => {
    const topic = q.topic_block || 'General'
    const subTopic = topic.toLowerCase().includes('reading comprehension') ? (q.sub_topic || 'Misc') : (q.topic || 'Misc')
    
    if (!groups[topic]) {
      groups[topic] = {
        name: topic,
        correct: 0,
        total: 0,
        timeSpent: 0,
        subTopics: {}
      }
    }
    
    if (!groups[topic].subTopics[subTopic]) {
      groups[topic].subTopics[subTopic] = {
        name: subTopic,
        correct: 0,
        total: 0,
        questions: []
      }
    }
    
    const isQCorrect = isCorrect(q, index)
    
    groups[topic].total++
    groups[topic].timeSpent += (quizStore.timeSpent[q.id] || 0)
    groups[topic].subTopics[subTopic].total++
    
    if (isQCorrect) {
      groups[topic].correct++
      groups[topic].subTopics[subTopic].correct++
    }
    
    groups[topic].subTopics[subTopic].questions.push({
      ...q,
      originalIndex: index
    })
  })
  
  return Object.values(groups).map(topic => {
    topic.subTopics = Object.values(topic.subTopics)
    return topic
  })
})

const { data: quizData, isFetching: isQuizLoading } = useQuery({
  queryKey: ['quiz', computed(() => route.params.id)],
  queryFn: () => api.getQuiz(route.params.id),
  enabled: computed(() => !!route.params.id),
  staleTime: Infinity
})

const { data: questionsData, isFetching: isQuestionsLoading } = useQuery({
  queryKey: ['questions', computed(() => route.params.id)],
  queryFn: () => api.getQuestions(route.params.id),
  enabled: computed(() => !!route.params.id),
  staleTime: Infinity
})

const { data: attemptData, isFetching: isAttemptFetching } = useQuery({
  queryKey: ['examAttemptDetail', computed(() => currentAttemptId.value ? String(currentAttemptId.value) : null)],
  queryFn: () => api.getExamAttemptDetail(currentAttemptId.value),
  enabled: computed(() => !!currentAttemptId.value),
  staleTime: Infinity
})

const isAttemptLoading = computed(() => isQuizLoading.value || isQuestionsLoading.value || isAttemptFetching.value)

watch([quizData, questionsData, attemptData], ([quiz, questions, attempt]) => {
  if (quiz && questions && attempt && String(attempt.id) === String(currentAttemptId.value)) {
    quizStore.loadAttempt(quiz, questions, attempt)
    if (score.value && score.value.percentage >= 70 && !isInitialLoad.value) {
      setTimeout(triggerConfetti, 100)
    }
  }
})

const loadAttemptData = (attemptId) => {
  if (String(currentAttemptId.value) === String(attemptId)) return;
  currentAttemptId.value = String(attemptId);
  router.replace({ query: { ...route.query, attemptId: String(attemptId) } });
}

onMounted(() => {
  isInitialLoad.value = false;
})

const enterReviewMode = () => {
  // Push to the quiz view, but append a review flag
  router.push({ path: `/quiz/${route.params.id}`, query: { review: 'true', attemptId: currentAttemptId.value } });
}

// Formatting helpers
const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const getOptionLetter = (index) => {
  if (index === undefined || index === null) return '-';
  return String.fromCharCode(65 + index);
}

// Confetti logic...
const triggerConfetti = () => {
  const canvas = document.getElementById('confetti-canvas')
  if (!canvas) return
  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true })
  myConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'] })
}

// Logic helpers
const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
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
  if (isCorrect(q, index)) return 'border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10'
  if (isWrong(q, index)) return 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10'
  return 'border-border opacity-70'
}
</script>
