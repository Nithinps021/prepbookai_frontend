import { useQuizStore } from '@/stores/quiz'

export function useQuiz() {
  const store = useQuizStore()
  return store
}
