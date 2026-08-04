const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AdminConsole.tsx', 'utf8');

code = code.replace(/import \(\'\.\.\/\.\.\/lib\/firebase\'\)\.then\(m => m\.logout\(\)\);/g, `logout();`);
if (!code.includes('import { logout }')) {
  code = code.replace(/import \{ emailSignIn \} from '\.\.\/\.\.\/lib\/firebase';/, `import { emailSignIn, logout } from '../../lib/firebase';`);
}
fs.writeFileSync('src/components/auth/AdminConsole.tsx', code);
