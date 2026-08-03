import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Server, Users, Settings, Zap, ToggleRight, ToggleLeft } from 'lucide-react';

const mockSystemData = [
  { time: '08:00', activeUsers: 1200, bandwidth: 45 },
  { time: '10:00', activeUsers: 2500, bandwidth: 80 },
  { time: '12:00', activeUsers: 3100, bandwidth: 95 },
  { time: '14:00', activeUsers: 2800, bandwidth: 85 },
  { time: '16:00', activeUsers: 1500, bandwidth: 50 },
];

export default function AdminDashboard() {
  const [rules, setRules] = useState([
    { id: 1, name: 'Daily Login Bonus', points: 10, active: true },
    { id: 2, name: 'Perfect Quiz Score', points: 150, active: true },
    { id: 3, name: 'First 100 Logins Bug', points: 100, active: true, warning: true },
    { id: 4, name: 'VR Lab Completion', points: 200, active: true },
  ]);

  const toggleRule = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">System Administrator</h2>
          <p className="text-neutral-500">Global metrics and configuration management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Active Users</p>
            <p className="text-2xl font-bold text-neutral-800">3,142</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">API Health</p>
            <p className="text-2xl font-bold text-neutral-800">99.9%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Server className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">VR Bandwidth</p>
            <p className="text-2xl font-bold text-neutral-800">85 TB</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-6">System Load (Today)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSystemData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="bandwidth" name="Bandwidth (TB)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Gamification Rules Engine
            </h3>
          </div>
          
          <div className="space-y-4">
            {rules.map(rule => (
              <div key={rule.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                rule.warning ? 'bg-red-50 border-red-200' : 'bg-neutral-50 border-neutral-100'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-neutral-800">{rule.name}</h4>
                    {rule.warning && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase tracking-wider">
                        Suspicious Activity
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">Reward: {rule.points} pts</p>
                </div>
                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                    rule.active ? 'text-green-600 hover:bg-green-100' : 'text-neutral-400 hover:bg-neutral-200'
                  }`}
                >
                  {rule.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
