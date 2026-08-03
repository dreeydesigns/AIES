import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, Activity } from 'lucide-react';

export default function ParentChildren() {
  const { currentUser, users } = useAppContext();
  const navigate = useNavigate();
  
  const children = users.filter(u => currentUser?.childIds?.includes(u.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">My Children</h2>
          <p className="text-neutral-500">View detailed reports and progress for your children.</p>
        </div>
      </div>
      
      {children.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">!</div>
            <div>
              <p className="font-bold text-amber-900">You haven't linked a child yet.</p>
              <p className="text-sm text-amber-700">Enter their link code to get started tracking their progress.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/onboarding')} 
            className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            Enter Link Code
          </button>
        </div>
      )}
      
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
            </div>
            
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-2">
              <button 
                onClick={() => navigate('/parent/messages')}
                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-bold rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message Teacher
              </button>
              <button 
                onClick={() => navigate(`/parent/children/${child.id}/report`)}
                className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                View Full Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
