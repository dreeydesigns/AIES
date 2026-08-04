const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(/import \{ initializeFirestore \} from 'firebase\/firestore';/, `import { getFirestore } from 'firebase/firestore';`);

code = code.replace(/export const db = firebaseConfig\.firestoreDatabaseId \n  \? initializeFirestore\(app, \{\}, firebaseConfig\.firestoreDatabaseId\)\n  : initializeFirestore\(app, \{\}\);/, `export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);`);
  
// I might have replaced newlines wrongly. Let's just do a regex replace.
code = code.replace(/export const db = [\s\S]*?;/, `export const db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);`);

fs.writeFileSync('src/lib/firebase.ts', code);
