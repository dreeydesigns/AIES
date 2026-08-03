import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';

export default function CourseView() {
  const { courseId } = useParams();
  const { courses, completedLessons } = useAppContext();
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);
  if (!course) return <div>Course not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{course.title}</h1>
        <p className="text-neutral-500">{course.description}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-800 mb-4">Course Modules</h3>
        <div className="space-y-4">
          {course.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <div 
                key={lesson.id} 
                onClick={() => navigate(`/student/courses/${course.id}/lessons/${lesson.id}`)}
                className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-blue-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                    <p className="text-xs font-medium text-neutral-500 capitalize">{lesson.type}</p>
                  </div>
                </div>
                <PlayCircle className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
