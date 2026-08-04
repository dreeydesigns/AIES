const fs = require('fs');
let code = fs.readFileSync('src/pages/shared/MessagesPage.tsx', 'utf8');

code = code.replace(/if \(currentUser.role === 'student' \|\| currentUser.role === 'parent'\) \{[\s\S]*?\} else if \(currentUser.role === 'teacher'\) \{/, `if (currentUser.role === 'student') {
          const q = query(usersRef, where('role', '==', 'teacher'));
          const snapshot = await getDocs(q);
          fetchedContacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else if (currentUser.role === 'parent') {
          // Parents to their linked children's teachers (assuming all teachers for now)
          const q = query(usersRef, where('role', '==', 'teacher'));
          const snapshot = await getDocs(q);
          fetchedContacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else if (currentUser.role === 'teacher') {`);

fs.writeFileSync('src/pages/shared/MessagesPage.tsx', code);
