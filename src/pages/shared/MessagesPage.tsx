import React from 'react';
import MessageInbox from '../../components/MessageInbox';
import { useAppContext } from '../../context/AppContext';

export default function MessagesPage() {
  const { currentUser } = useAppContext();
  
  // Mock contacts based on role
  const contacts = currentUser?.role === 'student' 
    ? [{ id: 'u2', name: 'Sarah Miller', role: 'teacher' }] 
    : currentUser?.role === 'teacher' 
      ? [
          { id: 'u1', name: 'Alex Johnson', role: 'student' },
          { id: 'u3', name: 'David Johnson', role: 'parent' }
        ]
      : [{ id: 'u2', name: 'Sarah Miller', role: 'teacher' }];

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Messages</h1>
        <p className="text-neutral-500">Communicate securely within the AIES platform.</p>
      </div>
      <MessageInbox currentUser={currentUser} contacts={contacts} />
    </div>
  );
}
