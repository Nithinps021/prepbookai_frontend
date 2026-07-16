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
    // Saved sentences for Para Jumble / Sentence Rearrangement blocks
    let savedSentences = '';
    let savedSubTopic = null;

    return qs.map(q => {
      const qData = { ...q };

      const topicLower = (qData.topic || '').toLowerCase();
      const subTopicLower = (qData.sub_topic || '').toLowerCase();

      const isParaJumble = topicLower.includes('jumble') || subTopicLower.includes('jumble');
      const isSentenceRearrangement = topicLower.includes('rearrangement') || subTopicLower.includes('rearrangement');

      // ── Para Jumble / Sentence Rearrangement: prepend saved sentences ──
      if (isParaJumble || isSentenceRearrangement) {
        const qText = (qData.question || '').trim();
        const parts = qText.split(/\n+/);

        // Check if this question has its own labeled sentences (multiline)
        const hasOwnSentences = parts.length > 1 && parts.some(p =>
          /^[\[(]?[A-Z][\])]?[.:)\s]/.test(p.trim()) || /^\d+[.:)\s]/.test(p.trim())
        );

        if (hasOwnSentences) {
          // First question in the block: save sentences (everything except last line)
          savedSentences = parts.slice(0, -1).join('\n');
          savedSubTopic = qData.sub_topic;
        } else if (savedSentences && savedSubTopic === qData.sub_topic) {
          // Subsequent question: prepend the saved sentences to the question
          qData.question = savedSentences + '\n\n' + qText;
        } else {
          // No saved sentences — try to extract from direction field
          const dirText = (qData.direction || '').trim();
          const dirParts = dirText.split('\n');
          const sentenceLines = dirParts.filter(p =>
            /^[\[(]?[A-Z][\])]?[.:)\s]/.test(p.trim()) || /^\d+[.:)\s]/.test(p.trim())
          );
          if (sentenceLines.length >= 3) {
            savedSentences = sentenceLines.join('\n');
            savedSubTopic = qData.sub_topic;
            // Don't prepend for first question — it already shows via direction
          }
        }
      } else {
        // Reset saved sentences when we leave a Para Jumble / Rearrangement block
        savedSentences = '';
        savedSubTopic = null;
      }

      // ── Now apply the standard passage/displayQuestion splitting ──
      const isPassageQ = qData.topic_block === 'Reading Comprehension' ||
                         topicLower.includes('reading comprehension') ||
                         subTopicLower.includes('passage base') ||
                         isParaJumble || isSentenceRearrangement;

      if (isPassageQ) {
        const qText = (qData.question || '').trim();
        const qTextLower = qText.toLowerCase();

        const continuationPhrases = ['based on', 'according to', 'from the passage', 'in the passage', 'what', 'which', 'choose', 'how', 'why', 'with reference'];
        const isContinuation = continuationPhrases.some(phrase => qTextLower.startsWith(phrase));

        const parts = qText.split(/\n+/);

        if (!isContinuation || currentPassage === '') {
          if (parts.length > 1) {
            currentPassage = parts.slice(0, -1).join('\n\n');
            qData.passage = currentPassage;
            qData.displayQuestion = parts[parts.length - 1];
          } else {
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
          qData.passage = currentPassage;
          qData.displayQuestion = qText;
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
      score: Math.max(0, score),
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
