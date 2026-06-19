import { questions } from './questions'
import { quizzes } from './quizzes'
import { user } from './user'

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  async login(email, password) {
    await delay(800)
    if (email && password) {
      return { token: 'mock-jwt-token-123', user }
    }
    throw new Error('Invalid credentials')
  },

  async signup(name, email, password) {
    await delay(1000)
    if (name && email && password) {
      return { token: 'mock-jwt-token-123', user: { ...user, name, email } }
    }
    throw new Error('Registration failed')
  },

  async getUserProfile() {
    await delay(300)
    return user
  },

  async getQuizzes(subject = null) {
    const response = await fetch('/api/quizzes');
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    const data = await response.json();
    if (subject) {
      return data.filter(q => q.subject === subject)
    }
    return data;
  },

  async getQuiz(id) {
    const response = await fetch(`/api/quizzes/${id}`);
    if (!response.ok) {
      throw new Error('Quiz not found');
    }
    return await response.json();
  },

  async getQuestions(quizId) {
    const response = await fetch(`/api/quizzes/${quizId}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return await response.json();
  },

  async submitQuiz(quizId, answers, timeTaken) {
    await delay(1000)
    // In a real app, the server calculates the score.
    // For this mock, we'll just return a success response and let the client handle scoring.
    return {
      success: true,
      message: 'Quiz submitted successfully',
      submissionId: 'sub-' + Math.random().toString(36).substr(2, 9),
      timeTaken
    }
  }
}
