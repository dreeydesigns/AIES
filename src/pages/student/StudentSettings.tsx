import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Copy, Link, Settings } from 'lucide-react';

export default function StudentSettings() {
  const { currentUser } = useAppContext();
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const handleCopyCode = () => {
    if (currentUser.linkCode) {
      navigator.clipboard.writeText(currentUser.linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Account Settings</h2>
          <p className="text-neutral-500">Manage your profile and connections.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Link className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Parent / Guardian Link</h3>
            <p className="text-neutral-500 text-sm">Share this code with your parents so they can track your progress.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-neutral-700">Your Link Code</label>
          <div className="flex items-center gap-4">
            <div className="bg-neutral-100 px-6 py-3 rounded-xl border border-neutral-200 font-mono text-xl font-bold tracking-widest text-neutral-800 flex-1">
              {currentUser.linkCode || 'Not generated'}
            </div>
            <button 
              onClick={handleCopyCode}
              disabled={!currentUser.linkCode}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-bold"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {currentUser.parentIds && currentUser.parentIds.length > 0 && (
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <h4 className="font-bold text-neutral-900 mb-4">Linked Accounts</h4>
            <div className="space-y-2">
              {currentUser.parentIds.map((pid, i) => (
                <div key={pid} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 rounded-lg">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-neutral-600">
                    {/* Just placeholder for parent name if we don't have it joined, or we can fetch it. For now just show ID or index */}
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">Parent Account</p>
                    <p className="text-xs text-neutral-500">ID: {pid.substring(0,8)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
