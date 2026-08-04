const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AuthScreen.tsx', 'utf8');

if (code.includes('const generateLinkCode = () => {')) {
  code = code.replace(/const generateLinkCode = \(\) => \{[\s\S]*?\};\n/, '');
  code = code.replace(/import \{ db \} from '\.\.\/\.\.\/lib\/firebase';/, `import { db } from '../../lib/firebase';\nimport { generateLinkCode } from '../../lib/linkUtils';`);
  fs.writeFileSync('src/components/auth/AuthScreen.tsx', code);
}
