import { questions } from './questions'
import { quizzes } from './quizzes'
import { user } from './user'
import { fetchWithAuth } from './apiClient'

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

  async getQuizzes(subject = null, page = 1, limit = 15) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    let url = `${baseUrl}/english/quizzes?page=${page}&limit=${limit}`; // For now all quizzes are english quizzes in the backend
    
    // We are leaving this public as per the plan, but we can also use fetchWithAuth if preferred. Let's use standard fetch here to match backend.
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    return await response.json();
  },

  async getQuiz(id, subject) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const response = await fetchWithAuth(`${baseUrl}/english/quizzes/${id}`);
    if (!response.ok) {
      throw new Error('Quiz not found');
    }
    return await response.json();
  },

  async getQuestions(quizId, subject) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const response = await fetchWithAuth(`${baseUrl}/english/quizzes/${quizId}/questions`);
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data.map((q, idx) => ({ ...q, id: q.id || `q-${idx}` }));
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
