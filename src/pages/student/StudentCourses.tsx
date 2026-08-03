import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Library } from 'lucide-react';
import EmptyState from '../../components/shared/EmptyState';

export default function StudentCourses() {
  const { courses, completedLessons } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Courses</h1>
        <p className="text-neutral-500">Browse your enrolled courses and continue learning.</p>
      </div>

      {courses.length === 0 ? (
        <EmptyState 
          icon={Library}
          title="No Courses Found"
          description="You are not enrolled in any courses yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => {
            const completedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
            const progress = Math.round((completedCount / course.lessons.length) * 100);
            
            return (
              <div key={course.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-300 transition-colors">
                <div className="h-32 bg-blue-50 border-b border-neutral-100 flex items-center justify-center">
                  <Library className="w-12 h-12 text-blue-200" />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-neutral-800 mb-2">{course.title}</h3>
                  <p className="text-neutral-500 text-sm mb-6 flex-grow">{course.description}</p>
                  
                  <div className="space-y-4 mt-auto">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-neutral-700">Progress</span>
                      <span className="text-neutral-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/student/courses/${course.id}`)}
                      className="w-full px-4 py-3 bg-neutral-50 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors border border-neutral-200 flex items-center justify-center gap-2 mt-4"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {progress === 0 ? 'Start Course' : 'Continue Course'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
