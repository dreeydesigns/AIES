import React from 'react';
import SidebarLayout from './SidebarLayout';
import { LayoutDashboard, Users, BookOpen, MessageSquare, BarChart } from 'lucide-react';

export default function TeacherLayout() {
  const navLinks = [
    { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { name: 'Courses', path: '/teacher/courses', icon: BookOpen },
    { name: 'Students & Grading', path: '/teacher/students', icon: Users },
    { name: 'Messages', path: '/teacher/messages', icon: MessageSquare },
    { name: 'Reports', path: '/teacher/reports', icon: BarChart },
  ];
  return <SidebarLayout role="teacher" navLinks={navLinks} />;
}
