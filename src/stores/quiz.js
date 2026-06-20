import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const currentQuiz = ref(null)
  const questions = ref([])
  const answers = ref({}) // { questionId: selectedOptionIndex }
  const markedForReview = ref(new Set())
  const currentQuestionIndex = ref(0)
  const isFinished = ref(false)
  const timeTaken = ref(0)
  const negativeMarkingPenalty = 0.25

  const startQuiz = (quizData, questionsData) => {
    currentQuiz.value = quizData
    questions.value = questionsData
    answers.value = {}
    markedForReview.value = new Set()
    currentQuestionIndex.value = 0
    isFinished.value = false
    timeTaken.value = 0
  }

  const setAnswer = (questionId, optionIndex) => {
    if (optionIndex === null) {
      delete answers.value[questionId]
    } else {
      answers.value[questionId] = optionIndex
    }
  }

  const toggleMarkForReview = (questionId) => {
    if (markedForReview.value.has(questionId)) {
      markedForReview.value.delete(questionId)
    } else {
      markedForReview.value.add(questionId)
    }
  }

  const submitQuiz = (finalTime) => {
    timeTaken.value = finalTime
    isFinished.value = true
  }

  const calculateScore = computed(() => {
    if (!isFinished.value) return null
    
    let correct = 0
    let wrong = 0
    let unanswered = 0

    const isOptionCorrect = (option, answer) => {
      if (!option || !answer) return false;
      return option.startsWith(answer + ')') || option.startsWith(answer + '.') || option === answer;
    }

    questions.value.forEach(q => {
      const userAnswerId = answers.value[q.id]
      if (userAnswerId === undefined) {
        unanswered++
      } else if (isOptionCorrect(q.options[userAnswerId], q.answer)) {
        correct++
      } else {
        wrong++
      }
    })

    const score = correct - (wrong * negativeMarkingPenalty)

    return {
      total: questions.value.length,
      correct,
      wrong,
      unanswered,
      score: Math.max(0, score), // Usually scores can't go below 0, or maybe they can. Let's allow negative? Let's say Math.max(0, score) for now.
      percentage: Math.max(0, (score / questions.value.length) * 100)
    }
  })

  return {
    currentQuiz,
    questions,
    answers,
    markedForReview,
    currentQuestionIndex,
    isFinished,
    timeTaken,
    startQuiz,
    setAnswer,
    toggleMarkForReview,
    submitQuiz,
    calculateScore
  }
})
