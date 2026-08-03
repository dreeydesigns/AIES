import React from 'react';
import MessageInbox from '../../components/MessageInbox';
import { useAppContext } from '../../context/AppContext';

export default function MessagesPage() {
  const { currentUser, users } = useAppContext();
  
  let contacts: any[] = [];

  if (currentUser?.role === 'student') {
    // All teachers
    contacts = users.filter(u => u.role === 'teacher').map(u => ({ id: u.id, name: u.name, role: u.role }));
  } else if (currentUser?.role === 'parent') {
    // All teachers
    contacts = users.filter(u => u.role === 'teacher').map(u => ({ id: u.id, name: u.name, role: u.role }));
  } else if (currentUser?.role === 'teacher') {
    // All students and their parents
    const students = users.filter(u => u.role === 'student');
    const parents = users.filter(u => u.role === 'parent' && students.some(s => s.parentIds?.includes(u.id)));
    contacts = [
      ...students.map(u => ({ id: u.id, name: u.name, role: u.role })),
      ...parents.map(u => ({ id: u.id, name: u.name, role: u.role }))
    ];
  }

  // Remove self from contacts
  contacts = contacts.filter(c => c.id !== currentUser?.id);

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex-shrink-0">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Messages</h1>
        <p className="text-sm text-neutral-500">Communicate securely within the AIES platform.</p>
      </div>
      <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <MessageInbox currentUser={currentUser} contacts={contacts} />
      </div>
    </div>
  );
}
