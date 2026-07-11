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

  const transformQuestions = (qs) => {
    let currentPassage = '';
    return qs.map(q => {
      const qData = { ...q };
      
      const isPassageQ = qData.topic_block === 'Reading Comprehension' || 
                         qData.topic === 'Reading Comprehension' || 
                         qData.sub_topic === 'Passage Base';

      if (isPassageQ) {
        const qText = (qData.question || '').trim();
        const qTextLower = qText.toLowerCase();
        
        // Phrases that indicate it's a subsequent question about the same passage
        const continuationPhrases = ['based on', 'according to', 'from the passage', 'in the passage', 'what', 'which', 'choose', 'how', 'why', 'with reference'];
        const isContinuation = continuationPhrases.some(phrase => qTextLower.startsWith(phrase));
        
        const parts = qText.split(/\n+/);
        
        if (!isContinuation || currentPassage === '') {
          // It's a new passage
          if (parts.length > 1) {
            currentPassage = parts.slice(0, -1).join('\n\n');
            qData.passage = currentPassage;
            qData.displayQuestion = parts[parts.length - 1];
          } else {
            // Fallback if no newlines exist: extract the last sentence as the question
            const matches = qText.match(/(.*?[.?!])\s+([^.?!]+[.?!]?)$/);
            if (matches) {
              currentPassage = matches[1].trim();
              qData.passage = currentPassage;
              qData.displayQuestion = matches[2].trim();
            } else {
              currentPassage = qText;
              qData.passage = currentPassage;
              qData.displayQuestion = qText;
            }
          }
        } else if (currentPassage) {
          // It's a subsequent question, use the current passage
          qData.passage = currentPassage;
          
          // Split by comma and remove the first part
          const commaParts = qText.split(',');
          if (commaParts.length > 1) {
            let restOfQuestion = commaParts.slice(1).join(',').trim();
            if (restOfQuestion.length > 0) {
              restOfQuestion = restOfQuestion.charAt(0).toUpperCase() + restOfQuestion.slice(1);
            }
            qData.displayQuestion = restOfQuestion;
          } else {
            qData.displayQuestion = qText;
          }
        } else {
          qData.displayQuestion = qText;
        }
      } else {
        currentPassage = ''; // reset passage for normal questions
        qData.displayQuestion = qData.question;
      }
      return qData;
    });
  };

  const startQuiz = (quizData, questionsData) => {
    currentQuiz.value = quizData
    questions.value = transformQuestions(questionsData)
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
