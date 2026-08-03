import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, MessageSquare, BookOpen } from 'lucide-react';
import RecentActivity from '../../components/RecentActivity';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const mockActivityData = [
  { day: 'Mon', score: 85, attention: 80 },
  { day: 'Tue', score: 88, attention: 82 },
  { day: 'Wed', score: 75, attention: 65 },
  { day: 'Thu', score: 82, attention: 70 },
  { day: 'Fri', score: 90, attention: 85 },
];

export default function ParentDashboard() {
  const { currentUser, users } = useAppContext();
  const navigate = useNavigate();
  
  const children = users.filter(u => currentUser?.childIds?.includes(u.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Parent Dashboard</h2>
          <p className="text-neutral-500">Overview of your children's learning progress and well-being.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => (
          <div key={child.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-800">{child.name}</h3>
                  <p className="text-sm text-neutral-500">Level {child.level || 1} • {child.points || 0} pts</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                Active
              </span>
            </div>
            
            <div className="p-6 flex-grow space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Level</p>
                  <p className="text-2xl font-bold text-neutral-800">{child.level || 1}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Current Streak</p>
                  <p className="text-lg font-bold text-neutral-800">{child.streak || 0} days</p>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-bold text-neutral-800 flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-neutral-400" />
                  Recent Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-600">Points Earned</span>
                    <span className="font-bold text-neutral-800">{child.points || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-2">
              <button 
                onClick={() => navigate('/parent/children')}
                className="px-4 py-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                View Full Report
              </button>
              <button 
                onClick={() => navigate('/parent/messages')}
                className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message Teacher
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-800 mb-6">Weekly Performance Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockActivityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="score" name="Quiz Scores" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="attention" name="Attention %" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <RecentActivity />
    </div>
  );
}
