import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Download, ArrowLeft, Award, BookOpen, Activity } from 'lucide-react';

export default function ParentReport() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { users, courses } = useAppContext();
  
  const student = users.find(u => u.id === studentId && u.role === 'student');

  if (!student) {
    return (
      <div className="p-8 text-center text-neutral-500">
        Student not found or not linked.
      </div>
    );
  }

  const completed = student.completedLessons || [];
  
  // Calculate some dummy history
  const history = completed.map((lessonId, i) => {
    // Find the course
    const course = courses.find(c => c.lessons.some(l => l.id === lessonId));
    const lesson = course?.lessons.find(l => l.id === lessonId);
    
    return {
      id: lessonId,
      date: new Date(Date.now() - (completed.length - i) * 86400000).toLocaleDateString(),
      course: course?.title || 'Unknown Course',
      lesson: lesson?.title || 'Unknown Module',
      score: 80 + Math.floor(Math.random() * 20),
    };
  }).reverse();

  return (
    <div className="space-y-6">
      {/* Hide on print */}
      <div className="print:hidden flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Children
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Download className="w-4 h-4" /> Download / Print Report
        </button>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-2xl border border-neutral-200 shadow-sm print:border-none print:shadow-none print:p-0">
        <div className="border-b border-neutral-200 pb-8 mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Student Progress Report</h1>
          <p className="text-lg text-neutral-500">AIES Platform - Generated {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-3xl">
            {student.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-neutral-800">{student.name}</h2>
            <p className="text-neutral-500">Student ID: {student.id.substring(0, 8)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 print:border-neutral-300">
            <div className="flex items-center gap-2 text-amber-600 font-bold mb-2">
              <Activity className="w-5 h-5" /> Current Level
            </div>
            <p className="text-3xl font-bold text-neutral-900">{student.level || 1}</p>
          </div>
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 print:border-neutral-300">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
              <BookOpen className="w-5 h-5" /> Total Points
            </div>
            <p className="text-3xl font-bold text-neutral-900">{student.points || 0}</p>
          </div>
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 print:border-neutral-300">
            <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
              <Award className="w-5 h-5" /> Badges Earned
            </div>
            <p className="text-3xl font-bold text-neutral-900">{(student.earnedBadges || []).length}</p>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 border-b border-neutral-100 pb-2">Recent Activity History</h3>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-lg">
                  <div>
                    <p className="font-bold text-neutral-900">{h.lesson}</p>
                    <p className="text-sm text-neutral-500">{h.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">{h.score}% Score</p>
                    <p className="text-sm text-neutral-500">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 italic">No completed lessons yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
