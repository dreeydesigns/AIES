const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AuthScreen.tsx', 'utf8');

code = code.replace(/return 'AIES-' \+ result;/, `return result;`);

fs.writeFileSync('src/components/auth/AuthScreen.tsx', code);
