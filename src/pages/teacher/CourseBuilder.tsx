import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Save, PlayCircle, FileText, HelpCircle, CheckCircle, Trash2 } from 'lucide-react';

export default function CourseBuilder() {
  const { courses, addLesson, addQuiz } = useAppContext();
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newLessonType, setNewLessonType] = useState('text');
  
  // Quiz Builder State
  const [quizQuestions, setQuizQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: any, optionIndex?: number) => {
    const updated = [...quizQuestions];
    if (field === 'text') updated[index].text = value;
    if (field === 'correctAnswer') updated[index].correctAnswer = value;
    if (field === 'option' && optionIndex !== undefined) {
      updated[index].options[optionIndex] = value;
    }
    setQuizQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!newLessonTitle || !selectedCourse) return;
    
    const lessonId = `l${Date.now()}`;
    let quizId: string | undefined;

    if (newLessonType === 'quiz') {
      quizId = `q${Date.now()}`;
      addQuiz(quizId, {
        id: quizId,
        questions: quizQuestions.map((q, i) => ({
          id: `q${i}`,
          text: q.text || `Question ${i + 1}`,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      });
    }

    const newLesson = {
      id: lessonId,
      title: newLessonTitle,
      content: newLessonContent || (newLessonType === 'quiz' ? 'Take the quiz to test your knowledge.' : 'No content provided.'),
      type: newLessonType as any,
      quizId
    };

    addLesson(selectedCourse.id, newLesson);
    
    // Update local selected course state so the UI reflects the change immediately
    setSelectedCourse(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }));

    setNewLessonTitle('');
    setNewLessonContent('');
    setQuizQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Course Builder</h1>
          <p className="text-neutral-500">Create and publish new lessons instantly.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="bg-neutral-50 border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={selectedCourse.id}
            onChange={(e) => setSelectedCourse(courses.find(c => c.id === e.target.value) || courses[0])}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm overflow-y-auto max-h-[600px]">
          <h3 className="text-lg font-bold text-neutral-800 mb-4">Existing Lessons</h3>
          <div className="space-y-3">
            {selectedCourse.lessons.map(lesson => (
              <div key={lesson.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex items-start gap-3">
                <div className="mt-1 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 text-sm">{lesson.title}</h4>
                  <p className="text-xs text-neutral-500 capitalize">{lesson.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Add New Lesson
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Lesson Title</label>
              <input 
                type="text" 
                value={newLessonTitle}
                onChange={e => setNewLessonTitle(e.target.value)}
                placeholder="e.g., Introduction to Cellular Respiration"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-neutral-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Content Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setNewLessonType('text')}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${newLessonType === 'text' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Article</span>
                </button>
                <button 
                  onClick={() => setNewLessonType('video')}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${newLessonType === 'video' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <PlayCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Video</span>
                </button>
                <button 
                  onClick={() => setNewLessonType('quiz')}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${newLessonType === 'quiz' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Quiz</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Lesson Content (Markdown Supported)</label>
              <textarea 
                rows={8}
                value={newLessonContent}
                onChange={e => setNewLessonContent(e.target.value)}
                placeholder="Write your lesson content here..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-neutral-50"
              ></textarea>
            </div>

            {newLessonType === 'quiz' && (
              <div className="space-y-6 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-800">Quiz Questions</h4>
                  <button 
                    onClick={handleAddQuestion}
                    className="text-emerald-600 text-sm font-bold hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>
                
                {quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 relative group">
                    {quizQuestions.length > 1 && (
                      <button 
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Question {qIndex + 1}</label>
                      <input 
                        type="text"
                        value={q.text}
                        onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                        placeholder="What is the capital of..."
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Options & Correct Answer</label>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswer === oIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <input 
                            type="text"
                            value={opt}
                            onChange={e => handleQuestionChange(qIndex, 'option', e.target.value, oIndex)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-500 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button 
                onClick={handlePublish}
                disabled={!newLessonTitle}
                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                Publish Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
