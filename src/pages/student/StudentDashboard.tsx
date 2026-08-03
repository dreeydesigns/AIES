import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { studentMetrics, gamification } from '../../data/mockData';
import { Trophy, Star, Zap, Headset, PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { BADGES_DATA } from '../../utils/badge-manager';

export default function StudentDashboard() {
  const { currentUser, courses, completedLessons, earnedBadges } = useAppContext();
  const navigate = useNavigate();

  // Find the first course for the demo
  const course = courses[0];
  
  // Calculate progress
  const totalLessons = course.lessons.length;
  const completedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);
  
  // Find next lesson
  const nextLesson = course.lessons.find(l => !completedLessons.includes(l.id)) || course.lessons[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Welcome back, {currentUser?.name?.split(' ')[0]}!</h2>
          <p className="text-neutral-500">Here's your learning progress today.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-neutral-700">{currentUser?.points || 0} pts</span>
          </div>
          <div className="w-px h-6 bg-neutral-200"></div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-neutral-700">Lvl {currentUser?.level || 1}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main CTA */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-800 mb-1">Up Next: {nextLesson.title}</h3>
              <p className="text-neutral-500 text-sm mb-4">Course: {course.title}</p>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span className="text-sm font-bold text-neutral-700">{progressPercent}%</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/student/courses/${course.id}/lessons/${nextLesson.id}`)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Continue Learning
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-800">Adaptive Learning Pathway</h3>
                <p className="text-sm text-neutral-500">AI-curated modules based on your learning style.</p>
              </div>
            </div>
            <div className="space-y-4">
              {course.lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isNext = lesson.id === nextLesson.id;
                
                return (
                  <div 
                    key={lesson.id} 
                    onClick={() => navigate(`/student/courses/${course.id}/lessons/${lesson.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-blue-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? 'bg-green-100 text-green-600' :
                        isNext ? 'bg-blue-100 text-blue-600' :
                        'bg-neutral-200 text-neutral-500'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                         isNext ? <PlayCircle className="w-5 h-5" /> :
                         <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800 group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                        <p className="text-xs font-medium text-neutral-500 capitalize">{lesson.type}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Headset className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 bg-white/20 rounded-md text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm">
                Immersive Lab
              </span>
              <h3 className="text-xl font-bold mb-2">Join VR Group Session</h3>
              <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                Collaborate with peers in the virtual chemistry lab for your upcoming assignment.
              </p>
              <button 
                onClick={() => navigate('/student/labs')}
                className="w-full bg-white text-indigo-900 font-bold py-3 px-4 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Headset className="w-5 h-5" />
                Launch VR Environment
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-800 mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              {earnedBadges.length === 0 ? (
                <div className="col-span-2 text-sm text-neutral-500 text-center py-4">No achievements yet. Complete lessons to earn badges!</div>
              ) : (
                earnedBadges.map(badgeId => {
                  const badge = BADGES_DATA[badgeId];
                  if (!badge) return null;
                  return (
                    <div key={badgeId} className="flex flex-col items-center p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                        {badge.icon === 'Zap' && <Zap className="w-6 h-6 text-amber-500" />}
                        {badge.icon === 'Trophy' && <Trophy className="w-6 h-6 text-amber-500" />}
                        {badge.icon === 'Star' && <Star className="w-6 h-6 text-amber-500" />}
                        {badge.icon === 'CheckCircle' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                      </div>
                      <span className="text-xs font-bold text-neutral-700 text-center">{badge.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
