import { fetchWithAuth } from './apiClient'

// Helper to simulate network delay (useful for mocks, kept for backward compatibility if needed)
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  // User Module Routes
  async registerUser(email, phoneNumber = null) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const response = await fetchWithAuth(`${baseUrl}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, phone_number: phoneNumber })
    });
    
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to register user: ${err}`);
    }
    
    return await response.json();
  },

  async submitQuiz(quiz, questions, answers, timeTaken) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    
    // Map selected index to option letter A,B,C,D,E
    const getOptionLetter = (idx) => {
      if (idx === undefined || idx === null) return null;
      return String.fromCharCode(65 + idx);
    }
    
    // Find correct answer letter
    const getCorrectLetter = (question) => {
      if (!question.options || !question.answer) return 'A'; // fallback
      const correctIdx = question.options.findIndex(opt => {
        return opt.startsWith(question.answer + ')') || opt.startsWith(question.answer + '.') || opt === question.answer;
      });
      return getOptionLetter(correctIdx !== -1 ? correctIdx : 0);
    }

    const payload = {
      quiz_doc_id: quiz.id,
      subject: quiz.subject || 'English Language',
      quiz_type: quiz.quiz_type || 'english_prelims', // fallback type
      total_questions: questions.length,
      marks_per_question: 1.0,
      negative_marks_per_question: 0.25,
      time_taken_seconds: timeTaken,
      started_at: new Date(Date.now() - timeTaken * 1000).toISOString(),
      answers: questions.map((q, idx) => ({
        question_index: idx,
        subject: q.subject || quiz.subject || 'English Language',
        topic: q.topic || 'General',
        sub_topic: q.sub_topic || q.topic || 'General',
        selected_answer: getOptionLetter(answers[q.id]),
        correct_answer: getCorrectLetter(q),
        time_spent_seconds: null
      }))
    };

    const response = await fetchWithAuth(`${baseUrl}/user/exam-attempt/submit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to submit quiz: ${err}`);
    }
    
    return await response.json();
  },

  async getExamAttempts(quizType = null) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    let url = `${baseUrl}/user/exam-attempts`;
    if (quizType) {
      url += `?quiz_type=${encodeURIComponent(quizType)}`;
    }
    
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to fetch exam attempts: ${err}`);
    }
    return await response.json();
  },

  async getExamAttemptDetail(attemptId) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const response = await fetchWithAuth(`${baseUrl}/user/exam-attempt/${attemptId}`);
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to fetch exam attempt detail: ${err}`);
    }
    return await response.json();
  },

  // English Module Routes (Public)
  async getQuizzes(subject = null, page = 1, limit = 15) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    let url = `${baseUrl}/english/quizzes?page=${page}&limit=${limit}`; 
    
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    return await response.json();
  },

  async getQuiz(id, subject) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const response = await fetchWithAuth(`${baseUrl}/english/quizzes/${id}`);
    if (!response.ok) {
      throw new Error('Quiz not found');
    }
    return await response.json();
  },

  async getQuestions(quizId, subject) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const response = await fetchWithAuth(`${baseUrl}/english/quizzes/${quizId}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data.map((q, idx) => ({ ...q, id: q.id || `q-${idx}` }));
  }
}
