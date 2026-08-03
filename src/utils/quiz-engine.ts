import { Quiz } from '../context/AppContext';

export interface QuizResult {
  score: number; // 0 to 100
  correctCount: number;
  totalQuestions: number;
  adaptivePath: 'remedial' | 'standard' | 'advanced';
  pointsEarned: number;
}

export const evaluateQuiz = (quiz: Quiz, answers: Record<string, number>): QuizResult => {
  let correct = 0;
  quiz.questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correct++;
    }
  });

  const totalQuestions = quiz.questions.length;
  const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
  
  let adaptivePath: 'remedial' | 'standard' | 'advanced' = 'standard';
  let pointsEarned = 0;

  if (score >= 85) {
    adaptivePath = 'advanced';
    pointsEarned = 200 + score; // Base 200 + score bonus
  } else if (score >= 60) {
    adaptivePath = 'standard';
    pointsEarned = 150 + score; // Base 150 + score bonus
  } else {
    adaptivePath = 'remedial';
    pointsEarned = 50 + score; // Remedial base + score
  }

  return {
    score,
    correctCount: correct,
    totalQuestions,
    adaptivePath,
    pointsEarned,
  };
};
