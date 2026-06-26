import { api } from './src/mock/api.js';

async function run() {
  try {
    const quizzes = await api.getQuizzes();
    const id = quizzes.data[0].id;
    console.log("Quiz ID:", id);
    const questions = await api.getQuestions(id);
    console.log("Questions:", questions.length);
    if(questions.length > 0) {
      console.log("Q1 keys:", Object.keys(questions[0]));
    }
  } catch (e) {
    console.error(e);
  }
}
run();
