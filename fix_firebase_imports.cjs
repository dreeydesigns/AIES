const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(/import \{ initializeFirestore \} from 'firebase\/firestore';/, `import { initializeFirestore, doc, setDoc } from 'firebase/firestore';`);
code = code.replace(/const \{ doc, setDoc \} = require\('firebase\/firestore'\);/, ``);

fs.writeFileSync('src/lib/firebase.ts', code);
