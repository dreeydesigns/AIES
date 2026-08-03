import React from 'react';
import SidebarLayout from './SidebarLayout';
import { LayoutDashboard, Users, BookOpen, Award, Settings, BarChart } from 'lucide-react';

export default function AdminLayout() {
  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Course Oversight', path: '/admin/courses', icon: BookOpen },
    { name: 'Gamification Config', path: '/admin/gamification', icon: Award },
    { name: 'System Reports', path: '/admin/reports', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];
  return <SidebarLayout role="admin" navLinks={navLinks} />;
}
