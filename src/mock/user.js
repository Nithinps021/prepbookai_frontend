export const user = {
  id: 'u1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  joinDate: '2024-01-15',
  stats: {
    totalQuizzes: 42,
    averageScore: 78.5,
    timeSpent: 12500, // minutes
    streak: 5
  },
  recentActivity: [
    {
      id: 'a1',
      quizId: 'quiz1',
      quizTitle: 'English Language Grammar Quiz',
      score: 3,
      totalQuestions: 3,
      date: '2024-03-10T14:30:00Z',
      timeTaken: 250 // seconds
    }
  ]
};
