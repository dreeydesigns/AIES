import React from 'react';
import EmptyState from '../../components/shared/EmptyState';
import { BookOpen, Users, BarChart, Settings, FolderX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GenericEmptyPage({ title, type }: { title: string, type: 'courses' | 'students' | 'reports' | 'settings' | 'general' }) {
  const navigate = useNavigate();
  
  let icon = FolderX;
  let desc = 'No content available.';
  let action = undefined;
  
  switch(type) {
    case 'courses':
      icon = BookOpen;
      desc = 'You do not have any courses available right now.';
      action = { text: 'Browse Courses', onClick: () => navigate(-1) };
      break;
    case 'students':
      icon = Users;
      desc = 'No students assigned yet.';
      break;
    case 'reports':
      icon = BarChart;
      desc = 'Not enough data to generate reports.';
      break;
    case 'settings':
      icon = Settings;
      desc = 'Settings panel is under construction.';
      break;
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{title}</h1>
      </div>
      <EmptyState 
        icon={icon}
        title={`No ${title} Found`}
        description={desc}
        actionText={action?.text}
        onAction={action?.onClick}
      />
    </div>
  );
}
