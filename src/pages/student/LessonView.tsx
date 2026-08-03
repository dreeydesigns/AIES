import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle, PlayCircle, Trophy, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { evaluateQuiz, QuizResult } from '../../utils/quiz-engine';

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const { courses, quizzes, completeLesson, completedLessons } = useAppContext();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const course = courses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);
  
  if (!course || !lesson) return <div>Lesson not found</div>;

  const isCompleted = completedLessons.includes(lesson.id);
  const quiz = lesson.quizId ? quizzes[lesson.quizId] : null;

  const handleComplete = () => {
    if (!isCompleted) {
      completeLesson(lesson.id, quizResult ? quizResult.pointsEarned : 100, quizResult ? quizResult.score : undefined); 
    }
    navigate('/student');
  };

  const handleQuizSubmit = () => {
    if (!quiz) return;
    const result = evaluateQuiz(quiz, selectedAnswers);
    setQuizResult(result);
    
    if (result.score >= 60 && !isCompleted) {
      completeLesson(lesson.id, result.pointsEarned, result.score); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <span className="hover:text-neutral-800 cursor-pointer" onClick={() => navigate('/student')}>Dashboard</span>
        <span>/</span>
        <span className="hover:text-neutral-800 cursor-pointer">{course.title}</span>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{lesson.title}</span>
      </div>

      {!showQuiz && !quizResult && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <BookOpen className="w-16 h-16 opacity-50" />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{lesson.title}</h1>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {lesson.type}
                </span>
              </div>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>
            
            <div className="prose prose-neutral max-w-none mb-8">
              <p className="text-lg leading-relaxed text-neutral-700">{lesson.content}</p>
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6">
                <h4 className="font-bold text-blue-900 mb-2">Key Takeaways</h4>
                <ul className="list-disc list-inside text-blue-800 space-y-2">
                  <li>Understand the basic structure and function of the topic.</li>
                  <li>Identify the key components discussed in the reading.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-neutral-100">
              {quiz ? (
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Take Quiz to Complete
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleComplete}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Mark as Complete
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showQuiz && !quizResult && quiz && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Knowledge Check</h2>
          <p className="text-neutral-500 mb-8">Answer the following questions to complete this lesson.</p>

          <div className="space-y-8">
            {quiz.questions.map((q, idx) => (
              <div key={q.id} className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-800">
                  {idx + 1}. {q.text}
                </h3>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label 
                      key={optIdx} 
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAnswers[q.id] === optIdx 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        checked={selectedAnswers[q.id] === optIdx}
                        onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className={selectedAnswers[q.id] === optIdx ? 'font-medium text-blue-900' : 'text-neutral-700'}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
            <button 
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}

      {quizResult !== null && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Quiz Completed!</h2>
          <p className="text-neutral-500 mb-6">You scored <span className="font-bold text-neutral-800">{quizResult.score}%</span></p>
          
          <div className="bg-neutral-50 rounded-xl p-6 mb-8 inline-block text-left border border-neutral-100">
            <h4 className="font-bold text-neutral-800 mb-2">Adaptive Recommendation</h4>
            {quizResult.adaptivePath === 'advanced' ? (
              <p className="text-green-700">Excellent work! You've mastered this topic. We're moving you ahead to the advanced module.</p>
            ) : quizResult.adaptivePath === 'standard' ? (
              <p className="text-blue-700">Good job! You've passed the requirements and can proceed to the next standard lesson.</p>
            ) : (
              <p className="text-amber-700">Let's review some core concepts. We've unlocked a remedial practice module for you next.</p>
            )}
          </div>

          <div>
            <button 
              onClick={handleComplete}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
