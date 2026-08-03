import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { googleSignIn, emailSignIn, emailSignUp } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BookOpen, LogIn, User, Users, GraduationCap } from 'lucide-react';

const generateLinkCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0, O, 1, I
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'AIES-' + result;
};

export default function AuthScreen() {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/${currentUser.role}`);
      }
    }
  }, [currentUser, navigate]);

  const handleCreateNewUserDoc = async (uid: string, displayName: string | null, photoURL: string | null = null, role: 'student'|'teacher'|'parent') => {
    const newUser: any = {
      name: displayName || email.split('@')[0] || 'User',
      role: role,
      avatar: photoURL || undefined,
    };
    if (role === 'student') {
      newUser.points = 0;
      newUser.level = 1;
      newUser.streak = 0;
      newUser.completedLessons = [];
      newUser.earnedBadges = [];
      newUser.linkCode = generateLinkCode();
      newUser.parentIds = [];
    } else if (role === 'parent') {
      newUser.childIds = [];
    }
    await setDoc(doc(db, 'users', uid), newUser);
    return newUser;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      
      let user;
      if (isSignUp) {
        user = await emailSignUp(email, password);
        const newUser = await handleCreateNewUserDoc(user.uid, null, null, selectedRole);
        setCurrentUser({ ...newUser, id: user.uid } as any);
        navigate('/onboarding');
      } else {
        user = await emailSignIn(email, password);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setCurrentUser({ ...userData, id: user.uid });
        } else {
          // Fallback if document missing
          const newUser = await handleCreateNewUserDoc(user.uid, null, null, 'student');
          setCurrentUser({ ...newUser, id: user.uid } as any);
          navigate('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await googleSignIn();
      if (result) {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setCurrentUser({ ...userData, id: result.user.uid });
        } else {
          // In Google sign in for a new user, if they haven't picked a role, default to student.
          const roleToUse = isSignUp ? selectedRole : 'student';
          const newUser = await handleCreateNewUserDoc(result.user.uid, result.user.displayName, result.user.photoURL, roleToUse);
          setCurrentUser({ ...newUser, id: result.user.uid } as any);
          navigate('/onboarding');
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') { setError('Sign in popup was blocked. Please open the app in a new tab to sign in.'); } else { setError(err.message || 'Failed to sign in'); }
    } finally {
      setLoading(false);
    }
  };
  
  if (isSignUp && step === 1) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight mb-2">Welcome to AIES</h1>
          <p className="text-neutral-500 max-w-md mx-auto">How will you be using the platform?</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setSelectedRole('student')}
              className={`p-6 rounded-xl border-2 text-center transition-all ${selectedRole === 'student' ? 'border-blue-600 bg-blue-50' : 'border-neutral-200 hover:border-blue-300'}`}
            >
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedRole === 'student' ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Student</h3>
              <p className="text-xs text-neutral-500">I want to learn and earn badges</p>
            </button>
            
            <button
              onClick={() => setSelectedRole('teacher')}
              className={`p-6 rounded-xl border-2 text-center transition-all ${selectedRole === 'teacher' ? 'border-emerald-600 bg-emerald-50' : 'border-neutral-200 hover:border-emerald-300'}`}
            >
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedRole === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Teacher</h3>
              <p className="text-xs text-neutral-500">I want to create courses</p>
            </button>
            
            <button
              onClick={() => setSelectedRole('parent')}
              className={`p-6 rounded-xl border-2 text-center transition-all ${selectedRole === 'parent' ? 'border-amber-600 bg-amber-50' : 'border-neutral-200 hover:border-amber-300'}`}
            >
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedRole === 'parent' ? 'bg-amber-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Parent / Guardian</h3>
              <p className="text-xs text-neutral-500">I want to track progress</p>
            </button>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsSignUp(false)}
              className="flex-1 py-3 px-4 bg-white border border-neutral-300 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Back to Login
            </button>
            <button 
              onClick={() => setStep(2)}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Continue as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <BookOpen className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">AIES Platform</h1>
        <p className="text-neutral-500 mt-2 max-w-md mx-auto">
          Alternative International Education System.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full max-w-md flex flex-col items-center">
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg w-full text-center">{error}</div>}
        
        {isSignUp && (
          <div className="w-full mb-6 flex items-center justify-between bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                {selectedRole === 'student' ? <GraduationCap className="w-4 h-4" /> : selectedRole === 'teacher' ? <BookOpen className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Signing up as</p>
                <p className="text-sm font-bold text-neutral-900 capitalize">{selectedRole}</p>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="text-sm text-blue-600 font-bold hover:underline">Change</button>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <div className="w-full flex items-center gap-4 mb-6">
          <div className="h-px bg-neutral-200 flex-1"></div>
          <span className="text-sm text-neutral-500 font-medium">OR</span>
          <div className="h-px bg-neutral-200 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full py-3 px-4 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Processing...' : (isSignUp ? 'Sign Up with Google' : 'Sign In with Google')}
        </button>
        
        <p className="mt-6 text-sm text-neutral-500 text-center">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              if (!isSignUp) setStep(1);
            }}
            className="text-blue-600 font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
