import React from 'react';
import { CheckCircle, Trophy, HelpCircle } from 'lucide-react';

const activities = [
  { id: '1', childName: 'Alex', action: 'completed lesson', target: 'The Cell Structure', time: '2 hours ago', type: 'lesson' },
  { id: '2', childName: 'Alex', action: 'earned badge', target: 'Fast Learner', time: '5 hours ago', type: 'badge' },
  { id: '3', childName: 'Mia', action: 'completed quiz', target: 'Basic Math', time: '1 day ago', type: 'quiz' },
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
      <h3 className="text-lg font-bold text-neutral-800 mb-4">Recent Activity Feed</h3>
      <div className="space-y-4">
        {activities.map(act => (
          <div key={act.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              act.type === 'lesson' ? 'bg-blue-100 text-blue-600' :
              act.type === 'badge' ? 'bg-yellow-100 text-yellow-600' :
              'bg-green-100 text-green-600'
            }`}>
              {act.type === 'lesson' && <CheckCircle className="w-5 h-5" />}
              {act.type === 'badge' && <Trophy className="w-5 h-5" />}
              {act.type === 'quiz' && <HelpCircle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm text-neutral-800">
                <span className="font-bold">{act.childName}</span> {act.action} <span className="font-semibold text-neutral-700">{act.target}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-1">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
