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
import GenericEmptyPage from './pages/shared/GenericEmptyPage';
import Leaderboard from './pages/student/Leaderboard';
import StudentDetail from './pages/teacher/StudentDetail';
import CourseBuilder from './pages/teacher/CourseBuilder';
import TeacherRoster from './pages/teacher/TeacherRoster';
import ParentChildren from './pages/parent/ParentChildren';
import TeacherReports from './pages/teacher/TeacherReports';
import AdminReports from './pages/admin/AdminReports';
import { googleSignIn, initAuth } from './lib/firebase';
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
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await googleSignIn();
      if (result) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setCurrentUser({ ...userData, id: result.user.uid });
        } else {
          setTempUser(result.user);
          setShowRoleSelection(true);
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') { setError('Sign in popup was blocked. Please open the app in a new tab to sign in.'); } else { setError(err.message || 'Failed to sign in'); }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = async (role: 'student' | 'teacher' | 'parent' | 'admin') => {
    if (!tempUser) return;
    try {
      setLoading(true);
      const newUser = {
        name: tempUser.displayName || 'New User',
        role,
        avatar: tempUser.photoURL || undefined,
        points: role === 'student' ? 0 : undefined,
        level: role === 'student' ? 1 : undefined,
        streak: role === 'student' ? 0 : undefined,
        childIds: role === 'parent' ? [] : undefined
      };
      await setDoc(doc(db, 'users', tempUser.uid), newUser);
      setCurrentUser({ ...newUser, id: tempUser.uid });
    } catch (err: any) {
      setError('Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">Welcome, {tempUser?.displayName}!</h1>
          <p className="text-neutral-500 mt-2 max-w-md mx-auto">Please select your role to continue.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {['student', 'teacher', 'parent', 'admin'].map((r) => (
            <button 
              key={r}
              onClick={() => handleSelectRole(r as any)} 
              disabled={loading}
              className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 capitalize font-bold disabled:opacity-50"
            >
              {r}
            </button>
          ))}
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
        <button 
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Signing in...' : 'Sign In with Google'}
        </button>
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
        <Route path="labs" element={<GenericEmptyPage title="VR Labs" type="general" />} />
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
        <Route path="resources" element={<GenericEmptyPage title="Parent Resources" type="general" />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<GenericEmptyPage title="User Management" type="students" />} />
        <Route path="courses" element={<GenericEmptyPage title="Course Oversight" type="courses" />} />
        <Route path="gamification" element={<GenericEmptyPage title="Gamification Config" type="settings" />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<GenericEmptyPage title="System Settings" type="settings" />} />
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

