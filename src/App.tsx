import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { BookOpen, LogIn } from 'lucide-react';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import ParentLayout from './layouts/ParentLayout';
import AdminLayout from './layouts/AdminLayout';
import CourseView from './pages/student/CourseView';
import LessonView from './pages/student/LessonView';
import StudentCourses from './pages/student/StudentCourses';
import MessagesPage from './pages/shared/MessagesPage';
import EmptyState from './components/shared/EmptyState';
import { FolderX, Users, BookOpen, Settings } from 'lucide-react';
import Leaderboard from './pages/student/Leaderboard';
import StudentDetail from './pages/teacher/StudentDetail';
import CourseBuilder from './pages/teacher/CourseBuilder';
import TeacherRoster from './pages/teacher/TeacherRoster';
import ParentChildren from './pages/parent/ParentChildren';
import TeacherReports from './pages/teacher/TeacherReports';
import AdminReports from './pages/admin/AdminReports';
import { googleSignIn, emailSignIn, emailSignUp, initAuth } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <>{children}</>;
}

function AuthScreen() {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

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
        const newUser = {
          name: email.split('@')[0],
          role: 'student',
          points: 0,
          level: 1,
          streak: 0,
          completedLessons: [],
          earnedBadges: []
        };
        await setDoc(doc(db, 'users', user.uid), newUser);
        setCurrentUser({ ...newUser, id: user.uid } as any);
      } else {
        user = await emailSignIn(email, password);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setCurrentUser({ ...userData, id: user.uid });
        } else {
          // Fallback if document missing
          const newUser = {
            name: email.split('@')[0],
            role: 'student',
            points: 0,
            level: 1,
            streak: 0,
            completedLessons: [],
            earnedBadges: []
          };
          await setDoc(doc(db, 'users', user.uid), newUser);
          setCurrentUser({ ...newUser, id: user.uid } as any);
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
          const newUser = {
            name: result.user.displayName || 'New Student',
            role: 'student',
            avatar: result.user.photoURL || undefined,
            points: 0,
            level: 1,
            streak: 0,
            completedLessons: [],
            earnedBadges: []
          };
          await setDoc(doc(db, 'users', result.user.uid), newUser);
          setCurrentUser({ ...newUser, id: result.user.uid } as any);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') { setError('Sign in popup was blocked. Please open the app in a new tab to sign in.'); } else { setError(err.message || 'Failed to sign in'); }
    } finally {
      setLoading(false);
    }
  };
  
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
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
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
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        
        <p className="mt-6 text-sm text-neutral-500 text-center">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthReady } = useAppContext();

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500 font-medium">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<AuthScreen />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses/:courseId" element={<CourseView />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonView />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="labs" element={<div className="pt-6"><EmptyState icon={FolderX} title="VR Labs" description="No content available." /></div>} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherLayout /></ProtectedRoute>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="courses" element={<CourseBuilder />} />
        <Route path="students" element={<TeacherRoster />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="reports" element={<TeacherReports />} />
      </Route>

      {/* Parent Routes */}
      <Route path="/parent" element={<ProtectedRoute allowedRole="parent"><ParentLayout /></ProtectedRoute>}>
        <Route index element={<ParentDashboard />} />
        <Route path="children" element={<ParentChildren />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="resources" element={<div className="pt-6"><EmptyState icon={FolderX} title="Parent Resources" description="No content available." /></div>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<div className="pt-6"><EmptyState icon={Users} title="User Management" description="No students assigned yet." /></div>} />
        <Route path="courses" element={<div className="pt-6"><EmptyState icon={BookOpen} title="Course Oversight" description="You do not have any courses available right now." /></div>} />
        <Route path="gamification" element={<div className="pt-6"><EmptyState icon={Settings} title="Gamification Config" description="Settings panel is under construction." /></div>} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<div className="pt-6"><EmptyState icon={Settings} title="System Settings" description="Settings panel is under construction." /></div>} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

