const fs = require('fs');
let firebaseCode = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// We need to import setDoc and doc if not already present. Wait, they might not be imported.
if (!firebaseCode.includes('setDoc')) {
  firebaseCode = firebaseCode.replace(/import \{ getFirestore \} from 'firebase\/firestore';/, `import { getFirestore, doc, setDoc } from 'firebase/firestore';`);
  // also getFirestore is initializeFirestore in current code maybe? We replaced it earlier with initializeFirestore.
}

firebaseCode = firebaseCode.replace(/export const emailSignUp = async \(email: string, password: string\): Promise<User> => \{[\s\S]*?return result\.user;\n\};/, `export const emailSignUp = async (email: string, password: string, role: string, linkCode?: string): Promise<{user: User, userData: any}> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const uid = result.user.uid;
  const userData = {
    name: 'New User',
    role: role,
    avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${uid}\`,
    points: role === 'student' ? 0 : undefined,
    level: role === 'student' ? 1 : undefined,
    streak: role === 'student' ? 0 : undefined,
    linkCode: role === 'student' ? (linkCode || Math.random().toString(36).substring(2, 8).toUpperCase()) : undefined,
  };
  
  const { doc, setDoc } = require('firebase/firestore');
  await setDoc(doc(db, 'users', uid), userData);
  
  return { user: result.user, userData };
};`);

fs.writeFileSync('src/lib/firebase.ts', firebaseCode);
