const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(/import \{ getFirestore \} from 'firebase\/firestore';/, `import { initializeFirestore } from 'firebase/firestore';`);

code = code.replace(/export const db = firebaseConfig\.firestoreDatabaseId \? getFirestore\(app, firebaseConfig\.firestoreDatabaseId\) : getFirestore\(app\);/, `export const db = firebaseConfig.firestoreDatabaseId 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });`);

fs.writeFileSync('src/lib/firebase.ts', code);
