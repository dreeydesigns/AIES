import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Trophy, Medal, Star } from 'lucide-react';

export default function Leaderboard() {
  const { leaderboard } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Leaderboard</h1>
          <p className="text-neutral-500">See how you rank against other students globally.</p>
        </div>
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="text-lg font-bold text-neutral-800">Global Rankings</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
              <div className="w-8 flex justify-center font-bold text-neutral-400">
                {index === 0 && <Medal className="w-6 h-6 text-amber-400" />}
                {index === 1 && <Medal className="w-6 h-6 text-neutral-400" />}
                {index === 2 && <Medal className="w-6 h-6 text-amber-600" />}
                {index > 2 && <span>{index + 1}</span>}
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-neutral-800">{user.name}</h4>
                <p className="text-xs text-neutral-500">Level {user.level}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-800">{user.points}</span>
                <span className="text-xs text-neutral-500">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
