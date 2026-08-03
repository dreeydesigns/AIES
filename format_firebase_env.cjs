const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(/const configModules = import\.meta\.glob\('\.\.\/\.\.\/firebase-applet-config\.json', \{ eager: true \}\);\nconst configModule: any = Object\.values\(configModules\)\[0\];\nconst firebaseConfig = configModule \? configModule\.default : \{/, `const firebaseConfig = {`);

fs.writeFileSync('src/lib/firebase.ts', code);
