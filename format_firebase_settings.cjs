const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(/initializeFirestore\(app, \{ experimentalForceLongPolling: true \}, firebaseConfig\.firestoreDatabaseId\)/g, `initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId)`);
code = code.replace(/initializeFirestore\(app, \{ experimentalForceLongPolling: true \}\)/g, `initializeFirestore(app, {})`);

fs.writeFileSync('src/lib/firebase.ts', code);
