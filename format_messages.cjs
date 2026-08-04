const fs = require('fs');
let code = fs.readFileSync('src/pages/shared/MessagesPage.tsx', 'utf8');

code = `import React, { useState, useEffect } from 'react';
import MessageInbox from '../../components/MessageInbox';
import { useAppContext } from '../../context/AppContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function MessagesPage() {
  const { currentUser } = useAppContext();
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentUser) return;

      const usersRef = collection(db, 'users');
      let fetchedContacts: any[] = [];

      try {
        if (currentUser.role === 'student' || currentUser.role === 'parent') {
          const q = query(usersRef, where('role', '==', 'teacher'));
          const snapshot = await getDocs(q);
          fetchedContacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else if (currentUser.role === 'teacher') {
          const studentsQ = query(usersRef, where('role', '==', 'student'));
          const studentsSnap = await getDocs(studentsQ);
          const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          
          let parentIds = new Set<string>();
          students.forEach(s => {
            if (s.parentIds) {
              s.parentIds.forEach((pid: string) => parentIds.add(pid));
            }
          });

          let parents: any[] = [];
          if (parentIds.size > 0) {
            // Firestore 'in' query supports up to 10 items, but for now we'll just query all parents and filter if it's too big, or chunk it.
            // For simplicity in this demo:
            const parentsQ = query(usersRef, where('role', '==', 'parent'));
            const parentsSnap = await getDocs(parentsQ);
            parents = parentsSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(p => parentIds.has(p.id));
          }

          fetchedContacts = [...students, ...parents];
        }

        // Remove self
        fetchedContacts = fetchedContacts.filter(c => c.id !== currentUser.id);
        
        setContacts(fetchedContacts.map(c => ({ id: c.id, name: c.name, role: c.role })));
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [currentUser]);

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
`

fs.writeFileSync('src/pages/shared/MessagesPage.tsx', code);
