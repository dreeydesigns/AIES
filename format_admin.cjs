const fs = require('fs');
let code = fs.readFileSync('src/components/auth/AdminConsole.tsx', 'utf8');
code = code.replace(/setError\('This account does not have admin access\. You have been signed out\.'\);/g, `setError('Access Denied');`);
code = code.replace(/setError\('This account does not have admin access\.'\);/g, `setError('Access Denied');`);
code = code.replace(/await import\('\.\.\/\.\.\/lib\/firebase'\)\.then\(m => m\.logout\(\)\);/g, `await logout();`);
code = code.replace(/import\('\.\.\/\.\.\/lib\/firebase'\)\.then\(m => m\.logout\(\)\);/g, `logout();`);
fs.writeFileSync('src/components/auth/AdminConsole.tsx', code);
