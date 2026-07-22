<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-text-primary">Practice Quizzes</h2>
        <p class="mt-1 text-sm text-text-muted">Select a quiz to start practicing.</p>
      </div>
      
      <!-- Search and Filter (Simplified for prototype) -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-text-muted" />
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            class="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors" 
            placeholder="Search quizzes..." 
          />
        </div>
      </div>
    </div>

    <!-- Subject Tabs -->
    <div class="border-b border-border overflow-x-auto no-scrollbar">
      <nav class="-mb-px flex space-x-6" aria-label="Tabs">
        <button 
          v-for="subject in subjects" 
          :key="subject"
          @click="activeSubject = subject"
          :class="[
            activeSubject === subject
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-text-muted hover:text-text-primary hover:border-border',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ subject }}
        </button>
      </nav>
    </div>

    <!-- Quiz Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-surface rounded-xl border border-border overflow-hidden shadow-soft flex flex-col h-[180px] animate-pulse">
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-3">
            <div class="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-full"></div>
            <div class="h-6 w-16 bg-black/5 dark:bg-white/5 rounded-full"></div>
          </div>
          <div class="h-5 w-3/4 bg-black/5 dark:bg-white/5 rounded mb-2"></div>
          <div class="h-5 w-1/2 bg-black/5 dark:bg-white/5 rounded"></div>
          <div class="mt-auto h-4 w-1/3 bg-black/5 dark:bg-white/5 rounded"></div>
        </div>
        <div class="px-5 py-3 border-t border-border bg-black/5 dark:bg-white/5 flex items-center justify-between">
          <div class="h-4 w-16 bg-black/5 dark:bg-white/5 rounded"></div>
          <div class="h-4 w-16 bg-black/5 dark:bg-white/5 rounded"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="filteredQuizzes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <QuizCard 
        v-for="quiz in filteredQuizzes" 
        :key="quiz.id" 
        :quiz="quiz"
        :attempt="attemptsMap[quiz.id]"
        @click="openQuizModal(quiz)"
      />
    </div>
    
    <div v-else class="text-center py-12 bg-surface rounded-xl border border-border">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-500 mb-4">
        <Search class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-medium text-text-primary">No quizzes found</h3>
      <p class="mt-1 text-sm text-text-muted">Try adjusting your search or filter criteria.</p>
      <Button variant="secondary" class="mt-4" @click="resetFilters">Clear Filters</Button>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && pagination.totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
      <Button variant="secondary" class="w-10 h-10 p-0 flex items-center justify-center" @click="prevPage" :disabled="pagination.page === 1">
        <ChevronLeft class="w-5 h-5" />
      </Button>
      
      <div class="flex items-center gap-1 mx-2">
        <Button 
          v-for="page in visiblePages" 
          :key="page"
          :variant="pagination.page === page ? 'primary' : 'secondary'"
          class="w-10 h-10 p-0 flex items-center justify-center font-medium"
          @click="goToPage(page)"
        >
          {{ page }}
        </Button>
      </div>

      <Button variant="secondary" class="w-10 h-10 p-0 flex items-center justify-center" @click="nextPage" :disabled="pagination.page === pagination.totalPages">
        <ChevronRight class="w-5 h-5" />
      </Button>
    </div>

    <!-- Start Modal -->
    <QuizStartModal 
      :is-open="isModalOpen"
      :quiz="selectedQuiz"
      :attempt="selectedAttempt"
      @update:is-open="isModalOpen = $event"
      @start="startQuiz"
      @view-results="viewResults"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { api } from '@/mock/api'
import { useQuizStore } from '@/stores/quiz'
import { useAuthStore } from '@/stores/auth'
import QuizCard from '@/components/quiz/QuizCard.vue'
import QuizStartModal from '@/components/quiz/QuizStartModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import Button from '@/components/ui/Button.vue'
import { Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedQuiz = ref(null)
const selectedAttempt = ref(null)
const isModalOpen = ref(false)

const subjects = ['All', 'English']
const activeSubject = ref(route.query.subject || 'English')
const pagination = ref({ page: 1, limit: 15, totalPages: 1 })

const { data: quizzesResponse, isPending: isQuizzesLoading } = useQuery({
  queryKey: ['quizzes', activeSubject, computed(() => pagination.value.page), computed(() => pagination.value.limit)],
  queryFn: () => api.getQuizzes(activeSubject.value, pagination.value.page, pagination.value.limit),
  enabled: computed(() => !!authStore.isAuthenticated),
  staleTime: 1000 * 60 * 60 // 1 hour cache
})

const quizzes = computed(() => quizzesResponse.value?.data || [])
watch(() => quizzesResponse.value?.totalPages, (newTotal) => {
  if (newTotal !== undefined) {
    pagination.value.totalPages = newTotal
  }
})

const { data: attemptsData, isPending: isAttemptsLoading } = useQuery({
  queryKey: ['allExamAttempts'],
  queryFn: () => api.getExamAttempts(),
  enabled: computed(() => !!authStore.isAuthenticated)
})

const attemptsMap = computed(() => {
  if (!attemptsData.value) return {}
  const map = {}
  attemptsData.value.forEach(attempt => {
    if (!map[attempt.quiz_doc_id] || attempt.score > map[attempt.quiz_doc_id].score) {
      map[attempt.quiz_doc_id] = attempt
    }
  })
  return map
})

const isLoading = computed(() => isQuizzesLoading.value || isAttemptsLoading.value)

// Sync URL with active subject
watch(activeSubject, (newVal) => {
  pagination.value.page = 1
  if (newVal === 'All') {
    router.replace({ path: '/quizzes' })
  } else {
    router.replace({ path: '/quizzes', query: { subject: newVal } })
  }
})

// Sync active subject with URL changes (e.g. back button)
watch(() => route.query.subject, (newSubject) => {
  if (newSubject && newSubject !== activeSubject.value) {
    activeSubject.value = newSubject
  }
})

// Removed old manual fetching logic
const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
  }
}

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
  }
}

const goToPage = (page) => {
  if (page !== pagination.value.page) {
    pagination.value.page = page
  }
}

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.totalPages
  
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  if (current <= 3) {
    return [1, 2, 3, 4, 5]
  }
  
  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total]
  }
  
  return [current - 2, current - 1, current, current + 1, current + 2]
})

const filteredQuizzes = computed(() => {
  return quizzes.value.filter(quiz => {
    const matchesSubject = activeSubject.value === 'All' || quiz.subject === activeSubject.value
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          quiz.topic.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSubject && matchesSearch
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  activeSubject.value = 'English'
}

const openQuizModal = (quiz) => {
  selectedQuiz.value = quiz
  selectedAttempt.value = attemptsMap.value[quiz.id] || null
  isModalOpen.value = true
}

const startQuiz = async () => {
  if (!selectedQuiz.value) return
  isModalOpen.value = false
  router.push({ path: `/quiz/${selectedQuiz.value.id}`, query: { subject: selectedQuiz.value.subject } })
}

const viewResults = async () => {
  if (!selectedQuiz.value || !selectedAttempt.value) return
  isModalOpen.value = false
  // Navigate to results page with attempt ID in query, or load it here.
  // Actually, we can just push to /results/:quizId?attemptId=...
  router.push({ path: `/results/${selectedQuiz.value.id}`, query: { attemptId: selectedAttempt.value.id } })
}
</script>
