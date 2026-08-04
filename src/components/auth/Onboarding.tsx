import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { linkChildByCode } from '../../lib/linkUtils';
import { GraduationCap, Copy, BookOpen, Users, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [linkCodeInput, setLinkCodeInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const handleCopyCode = () => {
    if (currentUser.linkCode) {
      navigator.clipboard.writeText(currentUser.linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSkip = () => {
    navigate(`/${currentUser.role}`);
  };

  const handleParentLink = async () => {
    if (!linkCodeInput) return;
    setLoading(true);
    setError('');

    try {
      const studentId = await linkChildByCode(currentUser.id, linkCodeInput);
      const newChildIds = [...(currentUser.childIds || []), studentId];
      setCurrentUser({ ...currentUser, childIds: newChildIds });
      
      setLinkCodeInput('');
      navigate(`/${currentUser.role}`);
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred while linking. Please try again.');
      }
      setError('An error occurred while linking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser.role === 'student') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full max-w-md text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Welcome to AIES!</h2>
          <p className="text-neutral-500 mb-8">
            Share this link code with your parent or guardian so they can follow your progress.
          </p>
          
          <div className="bg-neutral-100 p-4 rounded-xl flex items-center justify-between mb-8">
            <span className="font-mono text-2xl font-bold tracking-widest text-neutral-800">{currentUser.linkCode}</span>
            <button 
              onClick={handleCopyCode}
              className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && <p className="text-green-600 text-sm font-bold mb-4">Copied to clipboard!</p>}

          <button 
            onClick={handleSkip}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Continue to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'teacher') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Welcome, Educator</h2>
          <p className="text-neutral-500 mb-8">
            Your account is set up. You can start creating courses and managing your students.
          </p>
          
          <button 
            onClick={handleSkip}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'parent') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Link Your Child</h2>
          <p className="text-neutral-500 mb-6">
            Enter the Link Code provided by your child to track their progress and achievements.
          </p>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg w-full text-center">{error}</div>}
          
          <div className="mb-8 text-left">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Parent Link Code</label>
            <input 
              type="text" 
              value={linkCodeInput}
              onChange={(e) => setLinkCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. AIES-7K3XQ"
              className="w-full px-4 py-3 font-mono text-center text-lg tracking-widest border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all uppercase"
            />
          </div>
          
          <button 
            onClick={handleParentLink}
            disabled={!linkCodeInput || loading}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors mb-4 disabled:opacity-50"
          >
            {loading ? 'Linking...' : 'Link Account'}
          </button>

          <button 
            onClick={handleSkip}
            className="text-sm font-bold text-neutral-500 hover:text-neutral-700"
          >
            I'll do this later
          </button>
        </div>
      </div>
    );
  }

  return null;
}
