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
  const timeSpent = ref({}) // { questionId: seconds }
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
      const isOddSentenceOut = topicLower.includes('odd sentence') || subTopicLower.includes('odd sentence');
      const isParaCompletion = topicLower.includes('para completion') || subTopicLower.includes('para completion');
      const isClozeTest = topicLower.includes('cloze') || subTopicLower.includes('cloze');

      // ── Para Jumble / Sentence Rearrangement / Odd Sentence Out / Para Completion / Cloze Test: Prepend sentences ──
      if (isParaJumble || isSentenceRearrangement || isOddSentenceOut || isParaCompletion || isClozeTest) {
        let qText = (qData.question || '').trim();
        
        // Determine if this is the start of a block
        // We consider it the start if we have no saved sentences, or if the sub_topic changes
        // But also check if qText is long (contains the sentences). If it's a new long question, it's a new block.
        const isLongQuestion = qText.length > 150 || qText.split('\n').length > 2;

        if (!savedSentences || savedSubTopic !== qData.sub_topic || isLongQuestion) {
          const parts = qText.split(/\n+/);
          if (parts.length > 1) {
             savedSentences = parts.slice(0, -1).join('\n\n');
          } else {
             const matches = qText.match(/(.*?[.?!])\s+([^.?!]+[.?!]?)$/);
             if (matches) {
               savedSentences = matches[1].trim();
             } else {
               savedSentences = qText;
             }
          }
          savedSubTopic = qData.sub_topic;
        } else {
          // It's a subsequent short question: split by the first period and take the second part
          let cleanedQText = qText;
          const periodIndex = cleanedQText.indexOf('.');
          
          // If there is a period and it's not at the very end of the string
          if (periodIndex !== -1 && periodIndex < cleanedQText.length - 1) {
            // Keep everything after the first period
            cleanedQText = cleanedQText.substring(periodIndex + 1).trim();
          }
          
          if (!cleanedQText) cleanedQText = qText; // fallback

          // Prepend the saved sentences to the cleaned question text
          qData.question = savedSentences + '\n\n' + cleanedQText;
        }
      } else {
        // Reset saved sentences when we leave a block
        savedSentences = '';
        savedSubTopic = null;
      }

      // ── Column Matching: Remove first sentence if it's an instruction ──
      const isColumnMatching = topicLower.includes('column') || subTopicLower.includes('column');
      if (isColumnMatching && qData.question) {
        let qText = qData.question.trim();
        const lowerText = qText.toLowerCase();
        
        // If the question doesn't start directly with "Column I", it usually has an instruction sentence
        if (!lowerText.startsWith('column i') && !lowerText.startsWith('column 1')) {
          const firstPeriodIdx = qText.indexOf('.');
          // Find the actual start of the column data, which usually has a colon or newline
          const actualCol1Idx = qText.indexOf('Column I:');
          
          if (firstPeriodIdx !== -1) {
            // If we found 'Column I:', we can just strip everything before it
            if (actualCol1Idx !== -1) {
              qData.question = qText.substring(actualCol1Idx).trim();
            } 
            // Fallback: just remove the first sentence if it seems like an instruction
            else {
              qData.question = qText.substring(firstPeriodIdx + 1).trim();
            }
          }
        }
      }

      // ── Now apply the standard passage/displayQuestion splitting ──
      const isPassageQ = qData.topic_block === 'Reading Comprehension' ||
                         topicLower.includes('reading comprehension') ||
                         subTopicLower.includes('passage base') ||
                         isParaJumble || isSentenceRearrangement || isOddSentenceOut || isParaCompletion || isClozeTest;

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

      // ── Explicit sub_question handling ──
      // If the backend provided an explicit sub_question, force the layout:
      // question -> left side (passage)
      // sub_question -> right side (displayQuestion)
      if (qData.sub_question) {
        qData.passage = qData.question;
        qData.displayQuestion = qData.sub_question;
        // Also update currentPassage in case subsequent questions in the block need it
        currentPassage = qData.question;
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
    timeSpent.value = {}
  }

  const setAnswer = (questionId, optionIndex) => {
    if (optionIndex === null) {
      delete answers.value[questionId]
    } else {
      answers.value[questionId] = optionIndex
    }
  }

  const incrementTimeSpent = (questionId) => {
    if (!timeSpent.value[questionId]) {
      timeSpent.value[questionId] = 0
    }
    timeSpent.value[questionId]++
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

  const loadAttempt = (quizData, questionsData, attemptData) => {
    currentQuiz.value = quizData
    questions.value = transformQuestions(questionsData)
    answers.value = {}
    markedForReview.value = new Set()
    currentQuestionIndex.value = 0
    timeSpent.value = {}
    
    // Map backend attempt data to local state
    if (attemptData && attemptData.answers) {
      attemptData.answers.forEach(ans => {
        if (ans.selected_answer) {
          const optionIndex = ans.selected_answer.charCodeAt(0) - 65
          const q = questions.value[ans.question_index]
          if (q && optionIndex >= 0 && optionIndex < 5) {
            answers.value[q.id] = optionIndex
          }
        }
        
        const q = questions.value[ans.question_index]
        if (q) {
          timeSpent.value[q.id] = ans.time_spent_seconds || 0
        }
      })
    }
    
    isFinished.value = true
    timeTaken.value = attemptData?.time_taken_seconds || 0
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
    timeSpent,
    startQuiz,
    setAnswer,
    incrementTimeSpent,
    toggleMarkForReview,
    submitQuiz,
    loadAttempt,
    calculateScore
  }
})
