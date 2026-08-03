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
import StudentSettings from './pages/student/StudentSettings';
import MessagesPage from './pages/shared/MessagesPage';
import EmptyState from './components/shared/EmptyState';
import AuthScreen from './components/auth/AuthScreen';
import AdminConsole from './components/auth/AdminConsole';
import Onboarding from './components/auth/Onboarding';
import ParentReport from './pages/parent/ParentReport';
import { FolderX, Users, Settings } from 'lucide-react';
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
    if (allowedRole === 'admin') {
      return <Navigate to="/admin-console" state={{ from: location }} replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (currentUser.role !== allowedRole) {
    if (allowedRole === 'admin') {
      return <Navigate to="/admin-console" replace />;
    }
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { isAuthReady } = useAppContext();

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500 font-medium">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<AuthScreen />} />
      <Route path="/admin-console" element={<AdminConsole />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses/:courseId" element={<CourseView />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonView />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="labs" element={<div className="pt-6"><EmptyState icon={FolderX} title="VR Labs" description="No content available." /></div>} />
        <Route path="settings" element={<StudentSettings />} />
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
        <Route path="children/:studentId/report" element={<ParentReport />} />
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

